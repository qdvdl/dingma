<template>
  <div>
    <div class="search-box">
        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
          <el-form-item label="管理员:">
            <el-input v-model="formSearch.name" placeholder="管理员名称"></el-input>
          </el-form-item>
          <el-form-item label="操作内容:">
            <el-input v-model="formSearch.details" placeholder="操作内容"></el-input>
          </el-form-item>
          <el-form-item label="操作时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formSearch.time" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSearch">查询</el-button>
            <el-button type="primary" size="small" @click="onSearch(false)">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
    <AdminLog ref="adminLog" :extra="formSearch"></AdminLog>
  </div>
</template>

<script>
    import AdminLog from "@/page/component/admin/logtable"
    export default {
      components:{AdminLog},
      data(){
        return{
          formSearch:{
            name:"",
            time:"",
            details:""
          }
        }
      },
      methods:{
        refreshData(){
          //刷新数据
          this.$refs.adminLog.loadTable(true)
        },
        onSearch(off){
          if(!off){
             this.formSearch={
               name:"",
               time:"",
               details:""
             }
             setTimeout(()=>{
               this.$refs.adminLog.loadTable(true)
             },30)
          }else{
            this.$refs.adminLog.loadTable(true)
          }

        }
      }
    }
</script>

<style>
  @import url("../../../assets/css/main.css");
</style>
