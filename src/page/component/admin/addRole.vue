<template>
 <div>
      <!-- 操作 -->
       <el-drawer
         :visible.sync="visible"
         direction="rtl"
         size="50%"
         :show-close="false"
         :wrapperClosable='false'
         :before-close="dialogClose">
         <div slot="title" class="title">{{title}}<div class="icon" @click="dialogClose"><i class="el-icon-close"></i></div></div>
         <div class="drawer-box">
           <!-- 权限名称 -->
              <el-form inline="inline" label-position="right" status-icon ref="postData" label-width="80px" :rules="postRules" :model="postData" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="role_name">
                 <el-input v-model="postData.role_name" maxlength="6" placeholder="请输入角色名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                 <el-input v-model="postData.remark" maxlength="20"  placeholder="请输入备注" ></el-input>
                </el-form-item>
              </el-form>
              <div class="auth—box-list">
                <!-- 权限选择  -->
                <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                  <div v-for="item in auth" :key="item.id">
                    <el-divider><span>{{item.title}}</span></el-divider>
                    <div class="auth-list" v-for="items in item.children" :key="items.id" v-if="items.name!=authOff">
                        <el-checkbox :label="items.id" >{{items.title}}</el-checkbox>
                        <el-checkbox :label="itemss.id" v-for="itemss in items.children" :key="itemss.id" >{{itemss.title}}</el-checkbox>
                        <el-divider></el-divider>
                    </div>
                  </div>
                </el-checkbox-group>
              </div>
             <div slot="footer" class="dialog-footer">
               <el-button size="small" type="primary" @click="submitForm('postData')">保 存</el-button>
               <el-button size="small" @click="dialogClose">取 消</el-button>

             </div>
         </div>
      </el-drawer>

 </div>
</template>

<script>
  export default {
    data(){
      return{
        authOff:this.$authOff,
        title:"",  //弹出标题
        visible:false,//弹出层添加菜单
        postData:{    //提交数据
          role_name:"",
          remark:"",
          auth_id:""
        },
        type:"", //操作类型
        postRules:this.verification(), //验证表单
        checkList: []  //当前选中权限菜单列表权限
      }
    },
    props:{
      auth:Array|Object
    },
    methods:{
      //复选框选中事件，返回所有选中的
      handleCheckedCitiesChange(value){
        this.checkList=value;
        this.postData.auth_id=value.join(",");
      },
      //表单验证
      verification(){
        //自定义
        var v=[
           {field:"role_name",type:{required:"请输入角色名称！",chinese:"必须是中文！"},textCount:[2,6]},
           {field:"remark",textCount:[0,20]}
        ];
        v=this.$verification(v);
        return v;
      },
      //添加提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.postData;
            data.type=this.type;
            this.submitData(data);
          } else {
            return false;
          }
        });
      },
      //提交数据到后台
      submitData(data){
        let posturl="";
        if(data.type==="add"){
          posturl=this.$api.addRole;
        }

        if(data.type==="edit"){
          posturl=this.$api.editRole;
        }

        if(data.type==="del"){
          posturl=this.$api.delRole;
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
      },
     //关闭窗口时重置数据，防止添加时记录上次值
      dialogClose(t){
        this.postData={
          role_name:"",
          remark:"",
          auth_id:""
        }
        this.visible=false;
        this.checkList=[];
        this.$emit('close',t)
      },
      operation(type,data={row:{}}){
        //操作按钮
        let {id,role_name,remark,auth_id}=data.row;
        this.type=type;
        if(type==="edit"){
          this.title="修改角色";
          this.postData={
            id:id,
            role_name:role_name,
            remark:remark,
            auth_id:auth_id
          };
          this.checkList=auth_id.split(',');
          this.visible=true;
        }else if(type==="del"){
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitData({id:id,type:'del'});
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }else if(type==="add"){
          this.title="添加角色";
          this.visible=true;
        }
      }
    }
  }

</script>

<style scoped>
@import url("../../../assets/css/main.css");
.auth-list li{
  overflow: hidden;
}
.b-title{
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 400;
}

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
.auth—box-list{
  min-width: 600px;
  max-height:75vh;
  overflow: auto;
  margin-bottom: 15px;
}
.drawer-box{
  min-width: 800px;
}
.dialog-footer{
  text-align: left;
}
</style>
