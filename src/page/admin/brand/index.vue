<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="品牌名称:">
              <el-input v-model="extra.name" placeholder="品牌名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" size="small" round  @click="eventOperation({data:{},type:'add'})">添加品牌<i class="el-icon-plus el-icon--right"></i></el-button>
      <div class="user main">
      <TbaleList :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>

       <el-drawer
         size='50%'
         :wrapperClosable='true'
         :show-close="false"
         :visible.sync="visible"
         direction="rtl"
         custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
         <div class="drawerContent">
           <!-- <UserDetails ref="userdetails" :data="userdata" /> -->
           <AddBrand ref="addBrand" @evnetPost="submit"></AddBrand>
         </div>
       </el-drawer>

    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import AddBrand from "./add";  //添加数据
  export default {
    components:{TbaleList,PageBott,AddBrand},
    data(){
      return{
         title:"添加品牌",
          visible:false,
          type:"",
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
            name:""
          },
          operation:{
            add:"addBrand",
            edit:"editBrand",
            del:"delBrand"
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
        //this.$refs.addBrand.showFormData();
        this.visible=false;
      },
      //搜索数据
      search_btn(off){
        if(!off){
          this.extra={
            name:""
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
          this.title="添加品牌";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addBrand.showFormData();
          },30)
        }else if(type=='edit'){
          this.title="编辑品牌";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addBrand.showFormData(data,type);
          },30)
        }else if(type=='del'){
          let {id,name}=data.row;
          this.$confirm('此操作将永久删除, 是否确定删除此品牌?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.postData({
              id:id,
              name:name,
            },this.$api.delBrand);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        }




      },
      //保存数据
      submit(data){
        //添加数据
        if(this.type==='add'){
          this.postData(data,this.$api.addBrand);
        }
         //编辑数据
        if(this.type==='edit'){
          this.postData(data,this.$api.editBrand);
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
          {prop:"imgurl",name:"品牌图片",minWidth:170,isShowType:"img",isbase:false},
          {prop:"name",name:"品牌名称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"datetime",name:"添加时间",minWidth:170,isShowType:"default"},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
            {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
          ]}
        ]
        return c;
      },
      currChange({limit,page}){
        this.pageMeter.limit=limit;
        this.pageMeter.page=page;
        //分页开始
        console.log(limit,page);
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
        url:this.$api.brandList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
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
