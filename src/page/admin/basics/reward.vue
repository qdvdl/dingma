<template>
  <div class="reward">
      <div class="info-box"><el-button type="primary" round icon="el-icon-plus" size="small" @click="eventOperation('add')">添加奖励<i class="el-icon-plus el-icon--right"></i></el-button> </div>
      <div class="list">
         <TbaleList :tableData="tableData"  @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      </div>
      <el-drawer
        size='50%'
        :wrapperClosable='true'
        :show-close="false"
        :visible.sync="visible"
        direction="rtl"
        custom-class="drawer-box" >
        <div slot="title" class="drawer-title">{{title}}<div class="icon" @click="handleClose('hide')"><i class="el-icon-close"></i></div></div>
        <div class="drawerContent">
          <AddReward  ref="addreward" @evnetPost="submit" />
        </div>
      </el-drawer>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import AddReward from '@/page/component/basics/addReward';//表单提交呢
  export default {
    components:{TbaleList,AddReward},
    data(){
      return{
        title:'添加礼品',
        visible:false,
        // 表格
        tableData:[],
        type:'',
        column:[
          //配置列表显示数据
          {prop:"imgurl",name:"礼品图片",minWidth:170,isShowType:"img"},
          {prop:"name",name:"礼品名称",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"price",name:"对应价值（元）",minWidth:170,isShowType:"default"},
          {prop:"priceSum",name:"获取要求(成交单数)",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"添加时间",minWidth:170,isShowType:"default"},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
             {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
          ]}
        ]
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      refreshData(){
        //刷新数据
        this.getData();
      },
      submit(d){
        d.type=this.type;
        this.postData(d);
      },
      handleClose(){
        this.visible=false;
      },
      eventOperation({data,type}){
         //验证是否有操作权限
         if(!this.$handleVerify('addReward')){
           this.$message({
             showClose: true,
             message:this.$authorityMsg,
             type: 'error'
           });
           return false;
         }
        if(type==='edit'){
          this.title="编辑奖励";
          this.type=type;
          setTimeout(()=>{
            this.$refs.addreward.showFormData(data,type);
          },20);
          this.visible=true;
        }else if(type==='del'){
          this.$confirm('此操作将永久删除, 是否确定删除此礼品?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.postData({
              type:'del',
              id:data.row.id,
              name:data.row.name
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else{
          this.title="添加奖励";
          this.type='add';
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addreward.showFormData();
          },20);
        }

      },

      postData(d,url){
        const loading = this.$loading({
          lock: true,
          text: '提交中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.$request({
        	type:"post",
        	url:this.$api.addReward,
          data:d,
        	success:(res)=>{
            loading.close();
            if(res.code==200){
              this.getData();
              this.$message.success(res.msg);
              this.handleClose();
            }else{
              this.$message.error(res.msg);
            }
        	},error:(err)=>{
        		this.$message.error(err);
        	}
        });


      },
      getData(){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.reward,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.tableData=res.data;
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
  .reward{
    padding-top: 20px;
  }
  .info-box{
    margin-bottom: 15px;
  }
</style>
