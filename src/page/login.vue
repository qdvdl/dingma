<template>
  <div class="login">
      <div class="login-box">
          <h1 class="title">{{websiteName}}</h1>
          <el-form label-position="right"	 :model="postData" :rules="rules" ref="postData" label-width="70px" class="demo-ruleForm">
            <div class="form-box">
              <el-form-item label="账号:" prop="user_name">
                <el-input v-model="postData.user_name" maxlength="11" placeholder="输入登录账号"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="pass">
               <el-input type="password" maxlength="18"  v-model="postData.pass" placeholder="账号密码"></el-input>
              </el-form-item>
              <el-form-item label="验证码:" prop="code">
                <el-col :span="13">
                   <el-input maxlength="4" v-model="postData.code" placeholder="验证码"></el-input>
                </el-col>
                <el-col :span="11">
                   <div class="code-list" @click="randomRange">
                      <el-image :src="imgcode">
                         <div slot="error" class="image-slot"><i class="el-icon-refresh"></i></div>
                         <div slot="placeholder" class="image-slot"><i class="el-icon-loading"></i></div>
                      </el-image>
                   </div>
                </el-col>
              </el-form-item>
            </div>
          </el-form>
          <div class="form-btn">
            <el-button style="width: 50%;" type="primary" @click="submitForm('postData')">登录</el-button>
          </div>
      </div>

  </div>
</template>

<script>
  export default {
    data(){
      return{
        img:"",
        color:["#aaa","red","#aaa","#bbb","#aaa","#bbb"],
         postData: {
           user_name: '',
           pass: '',
           code: ''
         },
         code:[],
         imgcode:'',
         websiteName:this.$store.getters.getData.siteinfo.name,
         rules:this.verification()
      }
    },
    created(){
      this.randomRange(4,6);
    },
    methods:{

      //验证表单
      verification(){
        //自定义
        var v=[
           {field:"user_name",type:{required:"请输入登录账号！"},textCount:[4,11]},
           {field:"pass",type:{required:"请输入登录密码！"},textCount:[6,18]},
           {field:"code",type:{required:"请输入验证码！"}} //自定义
        ];
        v=this.$verification(v);
        return v;
      },
      //添加提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.postData;
            this.submitData(data);
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      submitData(data){
        const loading = this.$loading({
          lock: true,
          text: '等待验证登录...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$request({
          type:"post",
          url:this.$api.login,
          data:data,
          success:(res)=>{
            if(res.code==200){
              this.$message({showClose: true, message: res.msg,type: 'success' });
              this.login(true,res.data);
            }else{
              this.$message({showClose: true, message: res.msg,type: 'error' });
            }
            loading.close();
          },
          error:(err)=>{
            this.$message.error(err);
            loading.close();
          }

        })

      },
      login(state,d){
        // console.log(d);
        // return false;
        // 登录成功后处理

        let store=this.$store.getters.getData;
        store.userInfo=d.userinfo;
        store.login=state;
        store.Breadcrumb=[];
        store.active="0";
        store.operation=d.operation;
        store.menu=d.auth_list;
        store.siteinfo=d.siteinfo;

        this.$store.dispatch('setDatas',store);
        setTimeout(()=>{
           location.href=this.$base;
        },300)



      },
      getCode(){

        this.$request({
          type:"get",
          url:this.$api.code,
          success:(res)=>{
            if(res.code==200){
              this.imgcode=this.$http+res.codeimg+"?"+Math.random()
            }else{
              this.$message.error('网络发生错误！');
            }
          },
          error:(err)=>{
            this.$message.error(err);
          }

        })
      },
      randomRange(min,max){
         this.getinfo();
          setTimeout(()=>{
            this.getCode();
          },500)
      },
      getinfo(){
        this.$request({
          type:"get",
          url:this.$api.setAdmin,
          success:(res)=>{
            if(res.code==200){
              this.websiteName=res.data.name;
              this.$store.dispatch('setDataKeys',{
                key:"siteinfo",
                data:res.data
              });
            }else{
              this.$message.error('网络发生错误！');
            }
          },
          error:(err)=>{
            this.$message.error(err);
          }

        })
      }
    }
  }
</script>

<style scoped>
.login{
  background: #409EFF;
  height: 100%;
}
.login-box{
  background: #FFFFFF;
  width: 500px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -250px;
  margin-top: -250px;
  border-radius: 10px;
  box-shadow: 0px 2px 30px #FFFFFF;
  overflow: hidden;
  padding: 10px;
}
.title{
  text-align: center;
  height: 80px;
  line-height: 80px;
  font-weight: 500;
}
.form-box{
  padding-right: 15px;
  padding-left: 15px;
}
.form-btn{
  text-align: center;
  padding-bottom: 15px;
}
.code-list{
  padding:0 20px;
  background: #FFFFFF;
  display: inline-block;
  /* margin-left: 20px; */
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  /* border: 1px solid #e4e4e4; */
}
.code-list span{
  font-weight: bold;
}

</style>
