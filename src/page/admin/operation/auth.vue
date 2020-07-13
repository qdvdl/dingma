<template>
 <div>
      <div class="btn-box btn-box-p-top">
        <el-button type="primary" size="small" round  @click="operation('add')">顶级栏目<i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <!-- 弹层 -->
      <el-dialog
        :title="title"
        :visible.sync="visible"
        width="50%"
        @close="dialogClose"
        top="20vh"
        center
        >
        <el-form label-position="right" status-icon ref="addData" label-width="80px" :rules="addRules" :model="addData" class="demo-ruleForm">
          <el-form-item label="栏目名称" prop="title">
           <el-input v-model="addData.title" placeholder="请输入栏目名称"></el-input>
          </el-form-item>
          <el-form-item label="Path名称" prop="name">
           <el-input v-model="addData.name"  placeholder="请输入path名称" ></el-input>
          </el-form-item>
          <el-form-item label="排序值"  prop="order" >
           <el-input v-model.number="addData.order" placeholder="请输入排序值"></el-input>
          </el-form-item>
         <!-- <el-form-item label="层级"  prop="order" >
           <el-input v-model.number="addData.order" placeholder="请输入排序值"></el-input>
          </el-form-item> -->
          <el-form-item label="Icon图标" prop="icon">
           <el-input v-model="addData.icon" placeholder="请输入图片class名称,只支持element框架icon图标"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addData')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 表格 -->
      <div class="data-list-box">
        <el-table
        ref="filterTable"
          :data="tableData"
           row-key="id"
          :header-cell-style="headerClassName"
          :tree-props="{children: 'children'}"
          max-height="700"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID" width="180">
          </el-table-column>
          <el-table-column
            prop="title"
            label="栏目名称">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称">
            <template slot-scope="scope">
              <span v-if="scope.row.name!=''">{{scope.row.name}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="icon"
            label="图标"
           >
           <template slot-scope="scope">
             <i :class="scope.row.icon" style="font-size: 18px;"></i>
           </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="排序"
           >
          </el-table-column>
          <el-table-column
            label="操作"
            width="250"
            >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" plain @click="operation('add',scope)">添加</el-button>
                <el-button size="mini" @click="operation('edit',scope)">编辑</el-button>
                <el-button size="mini" type="danger" @click="operation('del',scope)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
      </div>

 </div>
</template>

<script>
  export default {
    data(){
      var validateName = (rule, value, callback) => {
        let regExp =/^[a-zA-Z]{1}([a-zA-Z0-9]|[\/]){2,18}$/;
        if(!regExp.test(value)){
          callback(new Error('必须是3-18英文字母或者符号！'));
        }else{
          callback();
        }
      };

      var validateIcon=(rule, value, callback)=>{
        let regExp =/^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){4,18}$/;
        if(!regExp.test(value)){
          callback(new Error('必须是6-18英文字母或者符号！'));
        }else{
          callback();
        }
      }
      return{
        title:"添加",
        visible:false,//弹出层显示
        addData:{
          title:"",
          order:0,
          name:"",
          icon:"",
          id:"",
          parent_id:""
        },
        type:"",
        addRules:{
          title:[
            { required: true, message: '请输入栏目名称', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          order:[
            { type: 'number', message: '排序必须是数字'}
          ],
          name:[
            { validator: validateName, trigger: 'blur' }
          ]
        },
        tableData: []
      }
    },
    created(){
      this.getData();
    },
    methods:{
      //添加提交
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data=this.addData;
            data.type=this.type;
            this.submitData(data);
          } else {
            // console.log('error submit!!');
            return false;
          }
        });

      },
      dialogClose(){
        this.addData={
          title:"",
          order:0,
          name:"",
          icon:"",
          id:"",
          parent_id:""
        }
        //this.$refs.addData.resetFields()
      },
      operation(type,data={row:{}}){

        //操作按钮
        let {id,parent_id,title,order,name,icon,children}=data.row;
        this.type=type;
        if(type==="edit"){
          this.title="修改栏目";
          this.addData={
            title:title,
            order:parseInt(order),
            name:name,
            icon:icon,
            id:id,
            parent_id:parent_id
          };
          this.visible=true;
        }else if(type==="del"){
          this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if(children.length===0){
              this.submitData({id:id,type:'del'});
            }else{
              this.$message({
                type: 'error',
                message: '该栏目有子栏目，删除失败！'
              });
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });


        }else if(type==="add"){
          this.title="添加栏目";
          this.addData.id=id;
          this.visible=true;

        }
      },
      onSubmit() {
        console.log('submit!');
      },
      headerClassName({row, rowIndex}){
        //设置表头样式
        return {"backgroundColor":"#eef1f6","color":"#000000"};
      },
      //获取表格数据
      getData(f){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:"index.php/api/auth",
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.tableData=res.data;

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
      },
      submitData(data){
          const loading = this.$loading({
            lock: true,
            text: '提交中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:"index.php/api/authAdd",
            data:data,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                this.visible=false;
                this.getData();
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
</style>
