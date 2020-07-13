<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="用户昵称:">
              <el-input v-model="extra.nickname" placeholder="用户昵称"></el-input>
            </el-form-item>
            <el-form-item label="手机号:">
              <el-input v-model="extra.tel" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="注册时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.datetime" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="user">
      <TbaleList minHeight="530" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
       <el-drawer
         size='80%'
         :wrapperClosable='true'
         :show-close="false"
         :visible.sync="visible"
         direction="rtl"
         custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="用户详情"></el-page-header></div>
         <div class="drawerContent">
           <UserDetails ref="userdetails" :data="userdata" />
         </div>
       </el-drawer>
    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import UserDetails from "./details";  //详情数据
  export default {
    components:{TbaleList,PageBott,UserDetails},
    data(){
      return{
          visible:false,
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          tableData:[],
          userdata:{},
          column:this.columns(),
          extra:{
            nickname:"",
            tel:"",
            datetime:""
          }
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      refreshData(){
        //刷新数据
        this.loadTable(true);
      },
      handleClose(){
        this.visible=false;
      },
      search_btn(off){
        if(!off){
          this.extra={
            nickname:"",
            tel:"",
            datetime:""
          }
        }
        this.loadTable(true);
      },
      eventOperation({type,data}){
        //验证是否有操作权限
        if(!this.$handleVerify('userDetails')){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }
        if(type==='see'){
           this.visible=true;
           this.userdata=data.row;
           setTimeout(()=>{
             // console.log(this.$refs.userdetails);
              this.$refs.userdetails.resetload(data.row);
           },10)
        }
      },
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"headimg",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"nickname",name:"昵称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"tel",name:"绑定手机号",minWidth:170,isShowType:"default"},
          {prop:"first_sum",name:"一级线下人数",minWidth:170,isShowType:"default"},
          {prop:"second_sum",name:"二级下线人数",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"注册时间",minWidth:170,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"info",plain:true,name:"详情",field:'see'}
          ]}
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
        url:this.$api.userList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
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
   @import url("../../../assets/css/main.css");
</style>
