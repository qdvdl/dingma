<template>
 <div>
      <div class="btn-box btn-box-p-top">
        <el-button type="primary" size="small" round  @click="operation('add')">添加管理员<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <!-- 数据表格 -->
      <div class="data-list-box">
        <el-table
        ref="filterTable"
          :data="tableData"
           row-key="id"
          :header-cell-style="headerClassName"
          max-height="700"
          style="width: 100%">
          <el-table-column prop="id" label="ID" width="50"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
               <el-image style="max-height:20px;max-width: 20px;" :src="scope.row.headimg_url" :preview-src-list="[scope.row.headimg_url]">
                  <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
               </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="user_name" label="账号"></el-table-column>
          <el-table-column prop="tel" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色名称"></el-table-column>
          <el-table-column prop="time" width="180" label="添加时间"></el-table-column>
          <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button size="mini" v-if='scope.row.id!=1' @click="operation('edit',scope)">编辑</el-button>
                <el-button size="mini"  v-if='scope.row.id!=1' type="danger" @click="operation('del',scope)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- end数据表格 -->
      <!-- 弹层 -->
      <addAdmin ref="addAdmin"  @close="dialogClose" :role="role"></addAdmin>

 </div>
</template>

<script>
  // import Upload from '@/components/upload';
  import addAdmin from "@/page/component/admin/addAdmin"
  export default {
    components:{addAdmin},
    data(){
      return{
        tableData: [], //表格数据
        role:[], //角色类型
        handleNname:{
          edit:"editAdmin",
          add:"addAdmin",
          del:"delAdmin"
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
          this.getData()
        }
      },
      //表格操作按钮
      operation(type,data){
        //验证是否有操作权限
        if(!this.$handleVerify(this.handleNname[type])){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }

        let addAdmin=this.$refs.addAdmin;
        addAdmin.operation(type,data)

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
          	url:this.$api.admin,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.tableData=res.data.admin;
                 this.role=res.data.role;
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
.drawer-box{
  padding-top: 15px;
  padding-right: 15px;
  padding-left: 15px;
}
</style>
