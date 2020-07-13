<template>
 <!-- 弹层 -->
 <el-dialog :title="title" :visible="visible" width="363px" @close="dialogClose" >
   <div class="app-admin-info">
     <el-form label-position="center" status-icon ref="postData" label-width="80px" :rules="postRules" :model="postData" class="demo-ruleForm">
       <div v-if="vtype==='set'">
         <el-form-item label="旧密码" prop="password" v-if="type!='edit'">
             <el-input type="password" maxlength="18" v-model="postData.password" placeholder="请输入新密码"  autocomplete="off"></el-input>
         </el-form-item>
         <el-form-item label="新密码" prop="checkPass" v-if="type!='edit'">
             <el-input type="password" maxlength="18" v-model="postData.checkPass" placeholder="请输入新密码"  autocomplete="off"></el-input>
         </el-form-item>
       </div>
       <div v-if="vtype==='img'">
         <el-form-item label="" prop="headimg">
            <Upload  :croppParame="croppParame" :isCrop="true" :item="0" :imgList="imageUrl" :parame="uploadParame" @onSuccess="getImage"></Upload>
         </el-form-item>
       </div>
     </el-form>
     <div slot="footer" class="index-app-footer">
       <el-button size="small" type="primary" @click="submitForm('postData')">保 存</el-button>
       <el-button size="small" @click="dialogClose">取 消</el-button>
     </div>
   </div>
 </el-dialog>
</template>

<script>
  import Upload from '@/components/upload';
  export default {
    name:"SetUserInfo",
    components:{Upload},
    data(){
      return{
          title:"",
          postData:{
            password:"",
            checkPass:"",
            headimg:""
          },//表单提交数据
          postRules:this.verification(), //验证表单
          type:"", //操作类型
          imageUrl:[], //上传图片集合
          uploadParame:{
            data:{path:"admin"},//上传图片时携带图片参数
            limit:1,//图片上传最大数量
            action:this.$api.upload,//上传图片地址
          },
          croppParame:{
            croppersW:"400px",//裁剪显示区域大小（像素）
            croppersH:"300px",//裁剪显示区域大小（像素）
            autoCropWidth:"200", //裁剪框的宽度（无）
            autoCropHeight:"200", //裁剪框的高度（无）
            top:"30vh",           //裁剪后弹窗顶部距离
            topCrop:"25px"       //裁剪前弹窗顶部距离
          }
      }
    },
    props:{
      visible:Boolean,
      vtype:String
    },
    created(){
      let imgsrc=this.$store.getters.getData.userInfo.headimg;
      if(imgsrc){
         this.imageUrl=imgsrc.split(",");
      }
    },
    methods:{
      //表单验证
      verification(){
        //自定义
        var validatePass2 = (rule, value, callback) => {
          if(value===""){
            callback(new Error('请输入确认密码!'));
          }else if(value===this.postData.password) {
            callback(new Error('新密码和旧密码一致!'));
          } else {
            callback();
          }
        };
        var v=[
           {field:"password",type:{required:"请填写旧密码！"},textCount:[6,18]},
           {field:"checkPass",validator:validatePass2,textCount:[6,18]} //自定义
        ];
        v=this.$verification(v);
        return v;
      },
      dialogClose(type){
        this.$emit("visibleClose",type);
      },
      getImage({set,imgUrl,index}){
        if(set.type==="add"){
          //添加
          this.imageUrl.push(imgUrl);
          // this.imageUrl=imgUrl;
        }else if(set.type==="edit"){
          //编辑
          // this.imageUrl=imgUrl;
         this.$set(this.imageUrl,set.index,imgUrl);
        }else if(set.type==="del"){
          //删除
          // this.imageUrl=[];
          this.imageUrl=this.imageUrl.filter((item,i)=>{
            if(set.index!=i){
              return item;
            }
          });
        }
      },
      submitForm(formName){
        this.postData.headimg=this.imageUrl.join(",");
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.postData;
            data.vtype=this.vtype;
           // console.log(data)
            this.submitData(data);
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      submitData(data){
        // console.log(data)
        // return ;
          const loading = this.$loading({
            lock: true,
            text: '提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:"index.php/api/setIinfo",
            data:data,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                if(this.vtype==="set"){
                   this.dialogClose('ok');
                }
                if(this.vtype==="img"){
                  this.$store.dispatch('setUserinfos',{
                    key:"headimg",
                    data:this.imageUrl.join(",")
                  });
                  this.dialogClose('no');
                }
              }else{
               this.$message({
                 showClose: true,
                 message: res.msg,
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

<style>
  .index-app-footer{
    text-align: center;
  }
  .app-admin-info{
    padding-right: 20px;
  }
</style>
