<template>
  <div>
   <div class="page-box">
      <el-pagination
        @size-change="pageSizeChange"
        @current-change="thisPageChang"
        background
        layout="total,sizes,prev,pager,next,jumper"
        :current-page='pageMeter.page'
        :page-size="pageMeter.limit"
        :total="pageMeter.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name:'pageBott',
    data(){
      return {
        pageSize:this.pageMeter.limit, //显示页数
        thisPage:this.pageMeter.page  //当前页码
      }
    },
    props:{
      pageMeter:Object //分页参数配置
    },
    methods:{
      pageSizeChange(val){
        //每显示多少条数触发
        this.pageSize=val;
        this.thisPage=1;
        this.pageChang();
      },
      thisPageChang(val){
        //当前也数
        this.thisPage=val;
        this.pageChang();
      },
      pageChang(){
        //console.log(this.pageMeter);
        //触发后变化
        setTimeout(()=>{
          this.$emit('currChange',{
            limit:this.pageSize,
            page:this.thisPage
          })
        },10)
      }
    }
  }
</script>

<style scoped>
  .page-box{
    padding: 15px 0;
    text-align: center;
  }
</style>
