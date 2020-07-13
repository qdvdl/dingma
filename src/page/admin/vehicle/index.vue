<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="选择品牌:">
              <el-select @change="refreshData" v-model="extra.brand_id" placeholder="选择品牌">
                  <el-option
                    v-for="item in brand"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="添加时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" size="small" round  @click="eventOperation({data:{},type:'add'})">添加车辆<i class="el-icon-plus el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList minHeight="530" :unfold="true" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>

       <el-drawer
         size='80%'
         :wrapperClosable='true'
         :show-close="false"
         :visible.sync="visible"
         direction="rtl"
         custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
         <div class="drawerContent">
           <!-- <UserDetails ref="userdetails" :data="userdata" /> -->
           <AddBrand :brand="brand" ref="addBrand" @evnetPost="submit"></AddBrand>
         </div>
       </el-drawer>

    </div>

<!-- 详情-->
        <el-drawer
          size='60%'
          :wrapperClosable='true'
          :show-close="false"
          :visible.sync="isSeeShow"
          direction="rtl"
          custom-class="drawer-box" >
          <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
          <div class="drawerContent">
            <VehicleInfo :data="info"></VehicleInfo>
          </div>
        </el-drawer>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import AddBrand from "./add";  //添加数据
  import VehicleInfo from "./see";  //详情数据
  export default {
    components:{TbaleList,PageBott,AddBrand,VehicleInfo},
    data(){
      return{
         info:"",
         isSeeShow:false,
         title:"添加品牌",
          visible:false,
          type:"",
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          brand:[],
          tableData:[],
          userdata:{},
          column:this.columns(),
          extra:{
            brand_id:"",
            datetime:""
          },
          operation:{
            add:"addVehicle",
            edit:"editVehicle",
            del:"delVehicle",
            see:"seeVehicle",
            homeYes:"homeVehicle", //首页展示
            headYes:"headVehicle",//一成首付
            homeNo:"homeVehicle", //首页展示
            headNo:"headVehicle"//一成首付
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
       //刷新数据
      refreshData(){
        this.loadTable(true);
      },
      //关闭弹窗
      handleClose(t){
        if(t=='load'){
          this.loadTable(this.type=='add',this.type=='del');
        }
        this.isSeeShow=false;
        this.visible=false;
      },
      //搜索数据
      search_btn(off){
        if(!off){
          //清空搜索数据
          this.extra={
            brand_id:"",
            datetime:""
          }
        }
        this.loadTable(true);
      },
      //触发操作按钮
      eventOperation({data,type}){
        //验证是否有操作权限
        if(!this.$handleVerify(this.operation[type])){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }
        //如果是添加
        this.type=type;
        if(type=='add'){
          this.title="添加车辆";
          this.visible=true;
          setTimeout(()=>{
           this.$refs.addBrand.showFormData();
          },30)
        }else if(type=='edit'){
          this.title="编辑车辆";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addBrand.showFormData(data,type);
          },30)
        }else if(type=='del'){
          let {id,title}=data.row;

          this.$confirm('此操作将永久删除, 是否确定删除此车辆?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.postData({
              id:id,
              title:title,
            },this.$api.delVehicle);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else if(type=='homeYes'||type=='homeNo'){
           let {id,title}=data.row;
          let msg=type==='homeYes' ? "是否确定将车辆推荐至首页?" : "是否确定将车辆撤销首页推荐？";
          this.$confirm(msg,'提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.postData({
              id:id,
              title:title,
              type:type
            },this.$api.homeVehicle);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消设置'
            });
          });

        }else if(type=='headYes'||type=='headNo'){
           let {id,title,fprices,mprices}=data.row;

            if(fprices==""||fprices==null){
              this.$message({
                type: 'info',
                message: '请先设置车辆一成首付!'
              });
              return false;
            }

           if(mprices==""||fprices==null){
             this.$message({
               type: 'info',
               message: '请先设置车辆一成月供金额!'
             });
             return false;
           }


          let msg=type==='headYes' ? "是否确定将车辆设置一成首付？" : "是否确定将车辆撤销一成首付？";
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.postData({
                id:id,
                title:title,
                type:type
              },this.$api.headVehicle);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消设置'
              });
          });

        }else if(type=='see'){
          this.isSeeShow=true;
          this.info=data.row;
         // console.log(1)
        }
      },
      //保存数据
      submit(data){
        //添加数据
        if(this.type==='add'){
          this.postData(data,this.$api.addVehicle);
        }
         //编辑数据
        if(this.type==='edit'){
          this.postData(data,this.$api.editVehicle);
        }
      },
      //提交数据后台
      postData(data,url){
        const loading = this.$loading({
          lock: true,
          text: '操作中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$request({
         type:"post",
         data:data,
         url:url,
         success:(res)=>{
            loading.close();
            if(res.code==200){
               this.$message.success(res.msg);
               this.handleClose('load');
            }else{
               this.$message.error(res.msg);
            }
         },error:(err)=>{
           this.$message.error(err);
         }
        });
      },
      // 表格数据相关
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"imgsrc",name:"车辆图片",minWidth:170,isShowType:"img",isbase:false},
          {prop:"b_name",name:"车辆品牌",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"version",name:"车辆型号",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"price",name:"厂商指导价(元)",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"text",name:"赠送的服务",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"datetime",name:"添加时间",minWidth:170,isShowType:"default"},
          {prop:"fprice",name:"普通首付(元)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"mprice",name:"普通月供(元)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"fprices",name:"一成首付(元)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"mprices",name:"一成月供(元)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
            {size:"mini",type:"danger",plain:true,name:"删除",field:'del'},
            {size:"mini",type:"danger",plain:true,name:"详情",field:'see'},
            {size:"mini",type:"danger",plain:true,name:"推荐车型",field:'homeYes',state:"1",fieldName:"home"},
            {size:"mini",type:"danger",plain:true,name:"撤销推荐车型",field:'homeNo',state:"2",fieldName:"home"},
            {size:"mini",type:"danger",plain:true,name:"人气车型",field:'headYes',state:"1",fieldName:"head"},
            {size:"mini",type:"danger",plain:true,name:"撤销人气车型",field:'headNo',state:"2",fieldName:"head"}
          ]}
        ]
        return c;
      },

      currChange({limit,page}){
        this.pageMeter.limit=limit;
        this.pageMeter.page=page;
        //分页开始
       // console.log(limit,page);
        this.loadTable();
      },
      loadTable(isReset,isResetCount){
        //isReset是否重置从第一页开始
        //isResetCounts 重新计算分页
        if(isReset){
          this.pageMeter.page=1;
        }

        if(isResetCount){
          if(this.tableData.length<=1&&this.pageMeter.page>1){
            this.pageMeter.page=this.pageMeter.page-1;
          }
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
        url:this.$api.vdlautoList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
              this.brand=res.data.brand;
           }else{
              this.$message.error(res.msg);
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
   @import url("../../../assets/css/main.css");
</style>
