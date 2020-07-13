<template>
  <div>
     <div class="user">
       <el-row  :gutter="0">
         <el-col :span="1">
           <div class="user-info user-header">
             <el-image :src="data.headimg" :preview-src-list="[data.headimg]">
                 <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
             </el-image>
           </div>
         </el-col>
         <el-col :span="6"><div class="user-info"><strong>用户昵称：</strong>{{data.nickname}}</div></el-col>
         <el-col :span="6"><div class="user-info"><strong>绑定手机号：</strong>{{data.tel}}</div></el-col>
       </el-row>
     </div>

     <el-tabs>
       <el-tab-pane label="下线信息">
        <span class="title-txt">线下类型：</span>
         <el-select v-model="value" @change="selectSearch" placeholder="线下类型">
           <el-option
             v-for="item in options"
             :key="item.value"
             :label="item.label"
             :value="item.value">
           </el-option>
         </el-select>
         <div class="user">
           <TbaleList :tableData="tableData" :column="column"></TbaleList>
           <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
         </div>
       </el-tab-pane>
       <el-tab-pane label="礼品详情">
          <TbaleList :tableData="tableDataR" @tabBtnOperation="eventOperationR" :column="columnR"></TbaleList>
       </el-tab-pane>
     </el-tabs>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  export default {
    name:"userDetails",
    components:{TbaleList,PageBott},
    data(){
      return{
         value:'all',
         options:[
           {value: 'all',label: '全部'},
           {value: '1',label: '一级下线'},
           {value: '2',label: '二级下线'},
          ],
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          tableData:[],
          column:this.columns(),
          extra:{
            type:"all",
            id:this.data.id
          },
          // 奖励
          tableDataR:[],
          columnR:[
            {prop:"imgurl",name:"礼品图片",minWidth:170,isShowType:"img",isbase:false},
            {prop:"name",name:"礼品名称",minWidth:170,isShowType:"default",isUnfold:true},
            {prop:"price",name:"对应价值",minWidth:170,isShowType:"default"},
            {prop:"priceSum",name:"获取要求(成交单数)",minWidth:170,isShowType:"default"},
            {prop:"send_date",name:"发送时间",minWidth:170,isShowType:"default"},
            {prop:'receive',name:"领取时间",minWidth:200,align:'center',fixed:"right",isText:true,isTextState:"1",isTextprop:"receive_date",isShowType:"btn",btnArr:[
               {size:"mini",type:"primary",plain:true,name:"未领取",field:'receive',state:'1'}
            ]}
          ],
      }
    },
    props:{
      data:Object|Array
    },
    mounted(){
      //this.loadTable(true);
    },
    methods:{
      //领取礼品
      eventOperationR({type,data}){
        //验证是否有操作权限
        if(!this.$handleVerify('receiveGifts')){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }

        this.$confirm('是否确定礼品已领取？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

         const loading = this.$loading({
           lock: true,
           text: '提交中...',
           spinner: 'el-icon-loading',
           background: 'rgba(0, 0, 0, 0.7)'
         });
         this.$request({
          type:"post",
          data:{id:data.row.ur_id,user_id:data.row.user_id,nickname:this.data.nickname},
          url:this.$api.receiveGifts,
          success:(res)=>{
           // console.log(res);
             loading.close();
             if(res.code==200){
               this.tableDataR=res.data.reward;
                this.$message.success(res.msg);
             }else{
               this.$message.error(res.msg);
             }
          },error:(err)=>{
            this.$message.error(err);
          }
         });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消领取'
          });
        });

      },
      resetload(data){
        this.extra.id=data.id;
        this.loadTable(true);
      },
      selectSearch(value){
        this.extra.type=value;
        this.loadTable(true);
      },
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"nickname",name:"用户昵称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"tel",name:"绑定手机号",minWidth:170,isShowType:"default"},
          {prop:"childtype",name:"下线类别",minWidth:170,isShowType:"default"},
          {prop:"deal_type",name:"是否下单",minWidth:170,isShowType:"default"},
          {prop:"deal_sum",name:"成交金额",minWidth:170,isShowType:"default"}
        ]
        return c;
      },
      currChange({limit,page}){
        this.pageMeter.limit=limit;
        this.pageMeter.page=page;
        //分页开始
        this.loadTable();
      },
      loadTable(isReset){
        //isReset是否重置从第一页开始
        if(isReset){
          this.pageMeter.page=1;
        }
        let data=Object.assign({},this.extra,{
          limit:this.pageMeter.limit,
          page:this.pageMeter.page
        });
        this.getData(data);
      },
      getData(data){
       const loading = this.$loading({
         lock: true,
         text: '加载中',
         spinner: 'el-icon-loading',
         background: 'rgba(0, 0, 0, 0.7)'
       });
       this.$request({
        type:"get",
        data:data,
        url:this.$api.userDetails,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
              this.tableDataR=res.data.reward;
           }else{
              this.$message.error('数据加载失败');
           }
        },error:(err)=>{
          this.$message.error(err);
        }
       });

      }

    }
  }
</script>

<style scoped>
  .user-header{
    width: 50px;
    height: 50px;
    background: #EEEEEE;
    border-radius: 50%;
    box-shadow: 0 0 10px #AAAAAA;
    margin-left: 15px;
  }
  .user-header .el-image{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .user-info{
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .user{
    padding:10px 0;
    font-size: 14px;
  }
  .title-txt{
    font-size: 15px;
  }
</style>
