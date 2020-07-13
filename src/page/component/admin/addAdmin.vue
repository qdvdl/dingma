<template>
 <div>
      <!-- 弹层 -->
      <el-drawer
        :visible.sync="visible"
        direction="rtl"
        size="50%"
        :show-close="false"
        :wrapperClosable='false'
        :before-close="dialogClose">
          <div slot="title" class="title">{{title}}<div class="icon" @click="dialogClose"><i class="el-icon-close"></i></div></div>
          <div class="drawer-box">
           <el-form label-position="right" status-icon ref="postData" label-width="80px" :rules="postRules" :model="postData" class="demo-ruleForm">
             <el-form-item label="姓名" prop="name">
              <el-input maxlength="6" v-model="postData.name" placeholder="请输入管理员姓名"></el-input>
             </el-form-item>
             <el-form-item label="账号" prop="user_name">
              <el-input maxlength="10" v-model="postData.user_name"  placeholder="请输入登录账号" ></el-input>
             </el-form-item>
             <el-form-item label="密码" prop="password" v-if="type!='edit'">
                 <el-input type="password" maxlength="18" v-model="postData.password" placeholder="请输入新密码(不填默认为:123456)"  autocomplete="off"></el-input>
             </el-form-item>
             <el-form-item label="密码" v-else prop="passwords">
                 <el-input type="password" maxlength="18" v-model="postData.passwords" placeholder="请输入新密码(不填不修改)"  autocomplete="off"></el-input>
             </el-form-item>

             <el-form-item label="确认密码" prop="checkPass" v-if="postData.passwords&&postData.passwords.length>=6">
                 <el-input type="password" maxlength="18" v-model="postData.checkPass" placeholder="请再次输入密码"  autocomplete="off"></el-input>
             </el-form-item>

             <el-form-item label="电话"  prop="tel" >
              <el-input maxlength="11"  v-model="postData.tel" placeholder="请输正确的11位手机号"></el-input>
             </el-form-item>
             <el-form-item label="角色名称" prop="role_id">
                 <el-select v-model="postData.role_id" placeholder="请选择角色名称">
                   <el-option v-for="item in role" :key="item.id" :label="item.role_name" :value="item.id"></el-option>
                 </el-select>
             </el-form-item>
             <el-form-item label="头像" prop="headimg">
                <Upload  :croppParame="croppParame" :isCrop="true" :imgList="imageUrl" :parame="uploadParame" @onSuccess="getImage"></Upload>
             </el-form-item>
           </el-form>
            <div slot="footer" class="admin-dialog-footer">
              <el-button size="small" type="primary" @click="submitForm('postData')">保 存</el-button>
              <el-button size="small" @click="dialogClose">取 消</el-button>
            </div>
          </div>
      </el-drawer>
 </div>
</template>

<script>
  import Upload from '@/components/upload';

  export default {
    components:{Upload},
    data(){
      return{
        //图片上传参数配置
        uploadParame:{
          data:{path:"admin"},//上传图片时携带图片参数
          limit:1,//图片上传最大数量
          action:String, //上传图片地址
          action:this.$api.upload,//上传图片地址
        },
        imageUrl:[], //上传图片集合
        title:"",//弹出名称
        visible:false,//弹出层显示
        postData:{
          name:"",
          user_name:"",
          tel:"",
          role_id:"",
          headimg:"",
          password:"",
          passwords:"",
          checkPass:""
        },
        type:"", //操作类型
        postRules:this.verification(), //验证表单
        // role:[], //角色类型
        handleNname:{
          edit:"editAdmin",
          add:"addAdmin",
          del:"delAdmin"
        },
        croppParame:{   //裁剪配置
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
      role:Array|Object
    },
    methods:{
      //表单验证
      verification(){
        //自定义
        var validatePass2 = (rule, value, callback) => {
          if (this.postData.passwords!=""&&value !== this.postData.passwords) {
            callback(new Error('两次输入密码不一致!'));
          } else {
            callback();
          }
        };
        var v=[
           {field:"name",type:{required:"请输入管理员姓名！",chinese:"必须是中文！"},textCount:[2,6]},
           {field:"user_name",type:{required:"请输入登录账号！",strAZaz:"必须是英文字母！"},textCount:[4,10]},
           {field:"password",type:{required:"请输入密码！"},textCount:[6,18]},
           {field:"passwords",textCount:[6,18]},
           {field:"tel",type:{required:"请输入管理员手机号！",tel:"请输入正确格式的手机号！"},textCount:[11,11],lengthText:"请输入11位手机号码！"},
           {field:"role_id",type:{required:"请选择角色！"}},
           {field:"checkPass",validator:validatePass2} //自定义
        ];
        v=this.$verification(v);
        return v;
      },
      //上传图片
      getImage({set,imgUrl,index}){
        if(set.type==="add"){
          //添加
          this.imageUrl.push(imgUrl);
        }else if(set.type==="edit"){
          //编辑
          this.$set(this.imageUrl,set.index,imgUrl);
        }else if(set.type==="del"){
          //删除
          this.imageUrl=this.imageUrl.filter((item,i)=>{
            if(set.index!=i){
              return item;
            }
          });
        }
      },
      //关闭窗口时重置数据，防止添加时记录上次值
      dialogClose(t){
        this.postData={
          name:"",
          user_name:"",
          tel:"",
          role_id:"",
          headimg:"",
          password:"",
          passwords:"",
          checkPass:""
        }
        this.imageUrl=[];
        this.visible=false;
        this.$emit('close',t);
      },
      operation(type,d){
        this.type=type;
        if(type==="edit"){
          let {id,name,user_name, tel,role_id,headimg}=d.row;
          this.title="修改管理员信息";
          this.postData={
            id:id,
            name:name,
            user_name:user_name,
            tel:tel,
            role_id:role_id,
            headimg:headimg,
            password:"",
            passwords:"",
            checkPass:""
          };
          this.imageUrl=headimg.split(",");
          this.visible=true;
        }else if(type==="del"){
          let {id,name,user_name}=d.row;
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitData({id:id,type:'del'});
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else if(type==="add"){
          this.title="添加管理员信息";
          this.visible=true;
        }

      },
      //添加提交
      submitForm(formName){
        this.postData.headimg=this.imageUrl.join(",");
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.postData;
            data.type=this.type;
            if(this.type==='edit'){
              data.password=this.postData.passwords;
            }
            this.submitData(data);
          } else {
            return false;
          }
        });
      },
      submitData(data){
          let posturl="";
          if(data.type==="add"){
            posturl=this.$api.addAdmin;
          }
          
          if(data.type==="edit"){
            posturl=this.$api.editAdmin;
          }
          
          if(data.type==="del"){
            posturl=this.$api.delAdmin;
          }
          
          const loading = this.$loading({
            lock: true,
            text: '提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:posturl,
            data:data,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                this.visible=false;
                this.dialogClose('load');
                this.$message({
                  showClose: true,
                  message: res.msg,
                  type: 'success'
                });
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
.admin-dialog-footer{
  text-align: left;
  padding-left: 80px;
}
</style>
