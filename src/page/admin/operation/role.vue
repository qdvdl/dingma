<template>
 <div>
      <div class="btn-box btn-box-p-top">
        <el-button type="primary" size="small" round  @click="operation('add')">添加角色<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>

      <!-- 表格 -->
      <div class="data-list-box">
        <el-table ref="filterTable" :data="tableData" row-key="id" :header-cell-style="headerClassName" max-height="700" style="width: 100%">
          <el-table-column prop="id" label="ID" width="180">
          </el-table-column>
          <el-table-column prop="role_name" label="角色名称"></el-table-column>
          <el-table-column prop="time" label="添加时间"></el-table-column>
          <el-table-column label="操作" width="250">
              <template slot-scope="scope">
                <el-button size="mini" @click="operation('edit',scope)">编辑</el-button>
                <el-button size="mini" type="danger" @click="operation('del',scope)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 操作 -->
      <AddRole :auth="auth" ref="addRole" @close="dialogClose"></AddRole>
 </div>
</template>

<script>
  import AddRole from "@/page/component/admin/addRole"
  export default {
    components:{AddRole},
    data(){
      return{
        tableData: [], //角色列表
        auth:[],       //权限菜单列表
        handleNname:{
          add:"addRole",
          edit:"editRole",
          del:"delRole"
        }
      }
    },
    created(){
      this.getData();
    },
    methods:{
      refreshData(){
        //刷新数据
        this.getData();
      },
     //关闭窗口时重置数据，防止添加时记录上次值
      dialogClose(t){
        if(t==='load'){
          this.getData();
        }
        this.checkList=[];
      },
      operation(type,data){
        
        //验证是否有操作权限
        if(!this.$handleVerify(this.handleNname[type])){
          this.$message({showClose: true, message:this.$authorityMsg,type: 'error'});
          return false;
        }
        
        this.$refs.addRole.operation(type,data);
      },
      headerClassName({row, rowIndex}){
        //设置表头样式
        return {"backgroundColor":"#eef1f6","color":"#000000"};
      },
      //获取表格数据
      getData(){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.role,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                this.tableData=res.data.role;
                this.auth=res.data.auth;
                this.dialogClose();
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

<style scoped>
@import url("../../../assets/css/main.css");
.auth-list li{
  overflow: hidden;
}
.b-title{
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
}
/* .from-box{
  max-height: 600px;
  overflow-y: scroll;
} */

.title{
  padding:0 20px;
  height:60px;
  line-height: 60px;
  font-size: 16px;
  border-bottom: 1px solid #f7f7f7;
}
.title .icon{
 float: right;
 cursor: pointer;
}
.auth—box-list{
  min-width: 600px;
  max-height:75vh;
  overflow: auto;
  margin-bottom: 15px;
}
.drawer-box{
  min-width: 800px;
}
</style>
