<template>
  <div style="padding-top: 20px;" class="main">
    <h3 class="info-title">车辆信息</h3>
    <el-row class="item">
      <el-col :span="3"><strong>车辆品牌：</strong> </el-col>
      <el-col :span="21">{{data.b_name}}</el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>车辆型号：</strong> </el-col>
      <el-col :span="21">{{data.version}}</el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>厂商指导价：</strong> </el-col>
      <el-col :span="21">{{data.price}}</el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>赠送内容：</strong> </el-col>
      <el-col :span="21">{{data.text}}</el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>分享标题：</strong> </el-col>
      <el-col :span="21">{{data.title}}</el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>封面图：</strong> </el-col>
      <el-col :span="21">
      <el-image style="width: 150px; max-height: 150px;margin-right: 10px;" :src="http+data.imgsrc" :preview-src-list="[http+data.imgsrc]"></el-image>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>banner图：</strong> </el-col>
      <el-col :span="21">
        <el-image v-for="img in data.banner.split(',')" :key="img" style="width: 150px; max-height: 150px;margin-right: 10px;" :src="http+img" :preview-src-list="[http+img]"></el-image>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong>分期方案：</strong> </el-col>
      <el-col :span="21">
        <div class="content" v-html="data.planText"></div>
      </el-col>
    </el-row>
    <el-row class="item">
      <el-col :span="3"><strong style="text-align:left;">配置详情介绍:</strong> </el-col>
      <el-col :span="21">
      <div class="content" v-html="data.sugText"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        http:this.$http
      }
    },
    name:"vehicleInfo",
    props:{
      data:Object|Array,//详情
    },
    filters:{
      imgarr(banner){
        return banner.split(',');
      }
    },
    methods:{

    }
  }
</script>

<style scoped>
  .main{
    height: 92vh;
    overflow: auto;
    /* background: red; */
  }
  .info-title{
    height: 40px;
    line-height: 40px;
    color: #888;
    /* padding-top: 40px; */
    font-size:16px;

  }
  strong{
    font-size: 15px;
    display: inline-block;
    width: 100%;
    text-align: right;
    /* background: red; */
  }
  .item{
    min-height: 40px;
    line-height: 40px;
   /* padding-left:15px; */
    /* background: red; */
    border-bottom: 1px solid #AAAAAA;
    margin-bottom: 15px;
  }
  .content{
    word-wrap: break-word;
    word-break: break-all;
  }
</style>
