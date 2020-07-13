<template>
  <div>
    <TbaleList  :tableData="tableData" :unfold="true" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
    <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件

export default {
  name:'adminlog',
  components:{TbaleList,PageBott},
  data(){
    return{
      //分页配置
        pageMeter:{
          limit:10,
          page:1,
          total:0
        },
      //数据表格配置
        tableData:[],//表格数据
        column:[
          //配置列表显示数据
          {prop:"id",name:"ID",minWidth:100,isShowType:"default"},
          {prop:"name",name:"管理员",minWidth:170,isShowType:"default"},
          {prop:"type",name:"操作类型",minWidth:170,isShowType:"default"},
          {prop:"time",name:"操作时间",minWidth:170,isShowType:"default"},
          {prop:"details",name:"操作内容",minWidth:170,isShowType:"false",isShow:false,isUnfold:true},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
          ]}
        ]
    }
  },
  props:{
    extra:Object|Array
  },
  mounted(){
    this.loadTable(true);
  },
  methods:{

    eventOperation({data,type}){

      //验证是否有操作权限
      if(!this.$handleVerify('dellog')){
        this.$message({
          showClose: true,
          message: this.$authorityMsg,
          type: 'error'
        });
        return false;
      }

      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback:(action)=>{
          if(action!="cancel"){
           this.del({id:data.row.id});
          }
        }
      })
    },
    del(data,f){
      const loading = this.$loading({
        lock: true,
        text: '正在处理...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$request({
      	type:"post",
      	url:this.$api.dellog,
        data:data,
      	success:(res)=>{
          loading.close();
          if(res.code==200){
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'success'
            });
            this.loadTable(false,true);
          }else{
           this.$message({
             showClose: true,
             message: res.msg,
             type: 'error'
           });
          }
      	},error:(err)=>{
      		this.$message.error(err);
      	}
      });
    },
    //##数据表格部分分页###
    currChange({limit,page}){
      this.pageMeter.limit=limit;
      this.pageMeter.page=page;
      //分页开始
      this.loadTable();
    },
    //分页操作
    loadTable(isReset,isResetCount){

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
    //获取数据
    getData(d){
      //表格数据获取
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$request({
      	type:"get",
      	url:this.$api.log,
        data:d,
      	success:(res)=>{
          loading.close();
          if(res.code==200){
             this.tableData=res.data.data;
             this.pageMeter.total=res.data.count;
          }else{
            this.$message({
              showClose: true,
              message: '数据加载失败',
              type: 'error'
            });
          }
      	},error:(err)=>{
      		this.$message.error(err);
      	}
      });
    }
  }
}
</script>

<style>
</style>
