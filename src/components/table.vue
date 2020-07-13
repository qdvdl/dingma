<template>
  <div class="data-list-box">
  <el-table
      ref="filterTable"
      :data="tableData"
      row-key="id"
      :header-cell-style="headerClassName"
      :max-height="!minHeight? 600 : minHeight"
      empty-text="暂无数据"
      @expand-change="expandChangeSelect"
      :expand-row-keys="expanded"
      style="width: 100%">
        <!-- 展开显示特殊字段 -->
        <el-table-column type="expand" v-if="unfold">
          <template slot-scope="props">
           <el-form label-width="120px" label-position="left" inline class="demo-table-expand">
             <el-form-item v-if="unfolds.isUnfold" :label="unfolds.name+':'" v-for="(unfolds,index) in column" :key="index+'_'+props.row.id">
               <span v-if="props.row[unfolds.prop]">{{props.row[unfolds.prop]}}</span>
               <span v-else>--</span>
             </el-form-item>
           </el-form>
          </template>
        </el-table-column>
        <!-- 列表数据 -->
        <el-table-column :show-overflow-tooltip='true' v-if="!item.isShow"  v-for="(item,index) in column" :fixed="item.fixed" :align="item.align" :key="index" :prop="item.prop" :label="item.name" :min-width="item.minWidth">
          <template slot-scope="scope">
            <!-- 自定义图片 -->
            <div v-if="item.isShowType==='img'">
              <el-image v-if="!item.isbase" style="max-height:20px;max-width: 20px;" :src="http+scope.row[item.prop]" :preview-src-list="[http+scope.row[item.prop]]">
                 <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
              </el-image>
              <el-image v-else style="max-height:20px;max-width: 20px;" :src="scope.row[item.prop]" :preview-src-list="[scope.row[item.prop]]">
                 <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
              </el-image>
            </div>
            <!-- 自定义btn -->
            <div v-else-if="item.isShowType==='btn'">
                <div v-if="item.isText&&item.isTextState==scope.row[item.prop]">
                  {{scope.row[item.isTextprop]}}
                </div>
                <div v-else>
                  <div v-if="item.btnArr.length>3">
                    <el-dropdown trigger="click"  @command="handleCommand">
                        <el-button plain size="small" split-button type="primary">
                          更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <div class="operation-btn-list" v-for="btn in item.btnArr" :key="btn.field">
                            <el-dropdown-item v-if="btn.state&&btn.state!==scope.row[btn.fieldName]" :command="{field:btn.field,scope:scope}">{{btn.name}}</el-dropdown-item>
                            <el-dropdown-item v-if="!btn.state" :command="{field:btn.field,scope:scope}">{{btn.name}}</el-dropdown-item>
                          </div>
                        </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <div v-if="item.btnArr.length<=3">
                    <div class="operation-btn-list" v-for="btn in item.btnArr" :key="btn.field">
                      <el-button  @click="operation(btn.field,scope)" v-if="btn.state!==scope.row[btn.fieldName]"  :size="btn.size" :type="btn.type" :plain='btn.plain'>{{btn.name}}</el-button>
                      <el-button  v-if="!btn.state"  @click="operation(btn.field,scope)"  :size="btn.size" :type="btn.type" :plain='btn.plain'>{{btn.name}}</el-button>
                    </div>
                  </div>
                </div>

            </div>
            <!-- 自定义内容 -->
            <div class="el-tooltip" v-else>
              <div class="textBox">
                <span v-if="scope.row[item.prop]">{{scope.row[item.prop]}}</span>
                <span v-else>--</span>
              </div>
            </div>
          </template>
        </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name:"tableList",
    data(){
      return{
         http:this.$http,
          expanded:[],//当展开id唯一标示
         // unfold:true,//展开展示
         //isUnfold：是否展示在详情里面，isShow：设置字段是否同时展示：true展示，false不展示（只展示列表）
          columns:[  //表格数据配置
           {prop:"id",name:"ID",minWidth:100,isShowType:"default"},
           {prop:"imgurls",name:"缩略图",minWidth:170,isShowType:"img"},
           {prop:"title",name:"文章标题",minWidth:170,isShowType:"default",isUnfold:true},
           {prop:"creater",name:"原创作者",minWidth:170,isShowType:"default"},
           {prop:"create_time",name:"创建时间",minWidth:170,isShowType:"default"},
           {prop:'keyword',name:"关键词",isShow:true,isUnfold:true},
           {prop:'describe',name:"文章摘要",isShow:true,isUnfold:true},
           {prop:'issuer',name:"发布人",isShow:true,isUnfold:true},
           {prop:'issuer_time',name:"发布时间",isShow:true,isUnfold:true},
           {prop:'update_time',name:"更新时间",isShow:true,isUnfold:true},
           {prop:'state_text',name:"文章状态",isUnfold:true},
           {prop:'state',name:"操作",minWidth:270,align:'center',fixed:"right",isShowType:"btn",btnArr:[
              {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
              {size:"mini",type:"success",plain:true,name:"发布",field:'issuer',state:'ok'},
              {size:"mini",type:"warning",plain:true,name:"取消发布",field:'issuers',state:'on'},
              {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
           ]}
          ]
      }
    },
    props:{
      minHeight:String,
      tableData:Array, //表格数据
      column:Array,   //参数设置
      unfold:Boolean //是否展示详情区域
    },
    methods:{
      //操作按钮过多直接触发
      handleCommand({field,scope}){
        this.operation(field,scope);
      },
      headerClassName({row, rowIndex}){
        //设置表头样式
        return {"backgroundColor":"#eef1f6","color":"#000000"};
      },
      dataFormatter(row, column){
        //表数据过滤
        this.$emit('tabDataFormatter',{
          row:row,
          column:column
        });
      },
      operation(type,data){
        //操作返回
        this.$emit('tabBtnOperation',{
          type:type,
          data:data
        })
      },
      expandChangeSelect(row,expandedRows){
        //展开行
         if(this.expanded.length){
           if(row.id!==this.expanded[0]){
             this.expanded=[];
             this.expanded.push(row.id);
           }else{
             this.expanded=[];
           }
         }else{
           this.expanded.push(row.id);
         }
      }
    }

  }
</script>

<style scoped>
  .data-list-box{
    border: 1px solid #EBEEF5;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand>>> label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
  .el-form--inline >>>.el-form-item__content{
    width: 60%;
  }
  .el-tooltip{
    width: 100%;
    /* background: gold; */
    /* overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap; */


  }
  .operation-btn-list{
    display: inline;
  }

  .el-tooltip .textBox{

    width: 100%;
    /* background: gold; */
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;


  /*  background: goldenrod;
    width: 100%;
    height: 80px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden; */
  }
</style>
