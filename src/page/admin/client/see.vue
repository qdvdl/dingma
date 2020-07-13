<template>
  <div style="padding-top: 20px;">
    <h3 class="info-title">客户信息</h3>
    <el-row class="item">
      <el-col :span="3">
        <strong>客户姓名：</strong>
      </el-col>
      <el-col :span="9">{{data.client_name}}</el-col>
      <el-col :span="3"> <strong>客户电话：</strong></el-col>
      <el-col :span="9">{{data.client_tel}}</el-col>
    </el-row>
    <h3 class="info-title">车辆信息</h3>
    <el-row class="item">
      <el-col :span="3">
        <strong>车辆品牌：</strong>
      </el-col>
      <el-col :span="9">{{data.b_name}}</el-col>
      <el-col :span="3"> <strong>车辆型号：</strong></el-col>
      <el-col :span="9">{{data.v_version}}</el-col>
    </el-row>
    <h3 class="info-title">成交信息</h3>
    <el-row class="item">
      <el-col :span="3">
        <strong>是否成交：</strong>
      </el-col>
      <el-col :span="21">{{data.state_text}}</el-col>
    </el-row>
    <el-row class="item" v-if="data.state_text==='是'">
      <el-col :span="3">
        <strong>成交时间：</strong>
      </el-col>
      <el-col :span="9">{{data.deal_time}}</el-col>
      <el-col :span="3"> <strong>成交价格：</strong></el-col>
      <el-col :span="9">{{data.deal_price}}</el-col>
    </el-row>
    <h3 class="info-title">业务员信息</h3>
    <el-row class="item">
      <el-col :span="3">
        <strong>业务员：</strong>
      </el-col>
      <el-col :span="21">{{data.business}}</el-col>
    </el-row>
    <h3 class="info-title">客户信息备注</h3>
    <el-row class="item">
      <el-col :span="24">{{data.remark}}</el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name:"clientInfo",
    props:{
      data:Object|Array,//详情
    },
    methods:{

    }
  }
</script>

<style scoped>
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
</style>
