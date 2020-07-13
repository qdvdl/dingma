<template>
 <div>
  <div class="botder-title">
      <strong>概览</strong>
  </div>
  <ul class="gl">
    <li>
      <h3>管理员</h3>
      <p>{{sum_admin}}</p>
    </li>
    <li>
      <h3>用户数</h3>
      <p>{{sum_user}}</p>
    </li>
    <li>
      <h3>成交客户数量</h3>
      <p>{{dealc_sum}}</p>
    </li>
    <li>
      <h3>成交车辆数量</h3>
      <p>{{dealv_sum}}</p>
    </li>
  </ul>

  <div class="botder-title">
     <strong>最新日志</strong>
  </div>
  <el-row>
    <el-col :span="24">
     <el-table
     ref="filterTable"
       :data="tableData"
        row-key="id"
       :header-cell-style="headerClassName"
       max-height="500"
       style="width: 100%">
       <el-table-column prop="id" label="ID" width="150"></el-table-column>
       <el-table-column prop="name" label="管理员" width="180"></el-table-column>
       <el-table-column prop="type" label="操作类型" width="180"></el-table-column>
       <el-table-column prop="time" width="180" label="操作时间"></el-table-column>
       <el-table-column prop="details" label="操作内容"></el-table-column>
     </el-table>
     </el-col>
   </el-row>
 </div>
</template>

<script>

  export default {
    data(){
      return{
        loading:null,
        tableData: [],//表格数据
        sum_admin:0,
        sum_user:0,
        dealc_sum:0,
        dealv_sum: 0
      }
    },
    created(){
      this.getData();
    },
    methods:{
      refreshData(){
        this.getData();
      },
      headerClassName({row, rowIndex}){
        //设置表头样式
        return {"color":"#000000"};
      },
      //获取表格数据
      getData(f){
         this.loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.getLog,
          	success:(res)=>{
              this.loading.close();
              if(res.code==200){
                this.tableData=res.data.log;
                this.sum_admin=res.data.admin_sum;
                this.sum_user=res.data.sum_user;
                this.dealc_sum=res.data.dealc_sum;
                this.dealv_sum=res.data.dealv_sum;
                
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
@import url("../assets/css/main.css");

.gl{
  display: flex;
  padding-top: 15px;
  border-bottom:1px solid #EBEEF5 ;
  padding-bottom: 15px;
}
.gl li{
  list-style: none;
  width: 230px;
  height: 100px;
  border: 1px solid #EBEEF5;
  background: #f9f9f9;
  text-align: center;
  margin-right: 15px;

}
.gl li h3{

  margin-top: 8px;
  line-height: 40px;
  color: #999;
  font-weight: 400;
}
.gl li p{
   font-size: 26px;
   color: #20a53a;
}
</style>
