<template>
  <div class="form-box">
    <div class="formBoxS">
    <el-row style="border-bottom: 1px solid #E4E7ED;padding-bottom: 15px;">
      <el-col :span="4">
        <div style="margin-left: 22px;">
          <el-avatar :size="70" :src="formData.u_img">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
          </el-avatar>
        </div>
      </el-col>
      <el-col :span="20" >
        <div class="grid-content bg-purple-light" style="height: 35px;line-height:35px;"><strong>评价人昵称：</strong>{{formData.nickname}}</div>
        <div class="grid-content bg-purple-light" style="height: 30px;line-height: 30px;"><strong>评价人电话：</strong>{{formData.u_tel}}</div>
      </el-col>
    </el-row>

    <el-row style="border-bottom: 1px solid #E4E7ED;">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>评价星级：</strong>{{formData.star}}</div>
      </el-col>
      <el-col :span="24" v-if="formData.text">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>评价内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
          {{formData.text}}
        </div>
      </el-col>
      <el-col :span="24" v-if="formData.img">
          <el-image v-for="(img,idex) in formData.img" :key="img" style="width: 150px; max-height: 150px;margin-right: 10px;" :src="img" :preview-src-list="[img]"></el-image>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>评价时间：</strong>{{formData.datetime}}</div>
      </el-col>
    </el-row>

    <el-row style="border-bottom: 1px solid #E4E7ED;padding-top: 10px;" v-if="formData.reply">
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="line-height:25px;"><strong>回复内容</strong></div>
        <div class="grid-content bg-purple-light" style="line-height:30px;padding: 10px 0px;word-wrap: break-word;word-break: break-all;">
          {{formData.reply}}
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content bg-purple-light" style="height: 60px;line-height:60px;"><strong>回复时间：</strong>{{formData.replytime}}</div>
      </el-col>
    </el-row>
      <el-row style="border-bottom: 0px solid #E4E7ED;padding-top: 10px;"  v-if="!formData.reply">
          <el-col :span="24">
            <el-input type="textarea" placeholder="请输入回复内容" v-model="reply" maxlength="200" show-word-limit> </el-input>
          </el-col>
          <el-col :span="24" style="padding: 40px 0">
               <el-button @click="onSubmit" size="mini" type="primary">回复</el-button>
          </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>

  export default {
    name:"addVehicle",
    data(){
      return{
        http:this.$http,
        formDeal:{
          deal_price:"",
          deal_time:""
        },
        reply:"",
        formData:this.setFormData(),
        rules:this.verification(),
        type:'',
        deal_state:''
      }
    },
    props:{
      vehicle:Object|Array
    },
    methods:{
        dealPrice(v){
          this.formDeal.deal_price=(v.match(/^\d*(\.?\d{0,2})/g)[0]) || null; //保留2位小数字
        },
        showFormData(data,type){
           if(type==="edit"){
            //console.log(data.row);

            let {id,u_img,nickname,star,text,img,datetime,reply,replytime,u_tel}=data.row;
            img=img.map((item)=>{
              return this.$http+item;
            })

            let d={
               id:id,
               u_tel:u_tel,
               u_img:u_img,
               nickname:nickname,
               star:star,
               text:text,
               img:img,
               datetime:datetime,
               reply:reply,
               replytime:replytime
            }
            this.formData=d;
           }else{
            this.formData=this.setFormData();
           }

        },
        onSubmit({data}){
          let d={
            id: this.formData.id,
            reply:this.reply
          };
          if(d.reply==""){
             this.$message.warning('回复内容不能为空！');
          }
          this.$emit('evnetPost',d);
        },
        setFormData(){
          //配置数据
          return {
            nickname:"",
            star:"",
            text:"",
            img:"",
            datetime:"",
            reply:"",
            replytime:""
          }
        },
        verification(){
          //验证数据
          var v=[
            {field:"reply",type:{required:"请输入5-200备注内容！"},textCount:[5,200]},
          ];
          v=this.$verification(v);
          return v;
        },
        formListItem(){
          //配置表单
          let form=[
            {prop:"reply", maxlength:200,placeholder:"请输入回复信息",label:'',type:'textarea',height:"110px"}
          ];
          return form;
        }
    }
  }
</script>

<style scoped>
  .item{
    background: green;
    margin-bottom: 20px;
    height: 180px;
  }
  .form-box{
    padding-top: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
  }
  .formBoxS{
    height: 90vh;
    overflow: scroll;
  }
  .selectInfo{
    padding-top: 22px;
  }
</style>
