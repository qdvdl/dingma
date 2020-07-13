<template>
  <div class="info">
      <div class="botder-title"><strong>轮播图设置</strong></div>
      <div class="info-box"><el-button type="primary" icon="el-icon-plus" round size="small" @click="addInfo">添加</el-button> </div>
      <div class="info-box">
          <TbaleList :tableData="tableData"  @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      </div>
      <!-- 信息添加弹窗 -->
        <el-drawer
          size='50%'
          :wrapperClosable='true'
          :show-close="false"
          :visible.sync="visible"
          direction="rtl"
          custom-class="drawer-box"
          @close="close">
          <div slot="title" class="drawer-title">轮播内容<div class="icon" @click="close('hide')"><i class="el-icon-close"></i></div></div>
          <div class="drawerContent">
              <el-form ref="infoData" :rules="postRules" :model="infoData" label-width="90px">
                <el-form-item label="图片:" prop="imgurl">
                  <Upload :croppParame="croppParame" :isCrop="true" item="imgurlInfo" name="imgurlInfo" :imgList="imgurlInfo" :parame="uploadParame" @onSuccess="getImage"></Upload>
                  <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸750*400像素</p>
                </el-form-item>
                <el-form-item label="名称:" prop="name">
                  <el-input maxlength="5" placeholder="请输入名称" v-model="infoData.name"></el-input>
                </el-form-item>
                <el-form-item label="内容:" prop="content">
                   <Editor ref="content" name="content"></Editor>
                </el-form-item>
              </el-form>
              <div class="btn-box-s">
                 <el-button @click="submitFormInfo('infoData')" size="small" type="primary" plain>保存</el-button>
              </div>
          </div>
        </el-drawer>
  </div>
</template>

<script>
  import Editor from '@/components/editor';
  import TbaleList from '@/components/table';//表格展示数据
  import Upload from '@/components/upload';
  export default {
    components:{TbaleList,Upload,Editor},
    data(){
      return{
        // 上传图片配置
          croppParame:{
            croppersW:"1000px",//裁剪显示区域大小（像素）
            croppersH:"500px",//裁剪显示区域大小（像素）
            autoCropWidth:"750", //裁剪框的宽度（无）
            autoCropHeight:"400", //裁剪框的高度（无）
            top:"30vh",           //裁剪后弹窗顶部距离
            topCrop:"20vh"       //裁剪前弹窗顶部距离
          },
          uploadParame:{
            data:{path:"sheet"},//上传图片时携带图片参数
            limit:1,//图片上传最大数量
            action:this.$api.upload,//上传图片地址
          },
          imgurl:[],
          //提交信息
          postRules:this.verification(), //验证表单
          //添加表格成交信息
          imgurlInfo:[],
          infoData:{
            imgurl:"",
            name:"",
            content:""
          },
          //数据表格
          tableData:[],//表格数据
          visible:false,
          http:this.$http,
          otype:'',
          index:'',
          column:[
            //配置列表显示数据
            {prop:"bannerurl",name:"图片",minWidth:170,isShowType:"img"},
            {prop:"name",name:"名称",minWidth:170,isShowType:"default",isUnfold:true},
            {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
               {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
               {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
            ]}
          ],
          handleNname:{
            add:"addBanner",
            edit:"editBanner",
            del:"delBanner"
          }
      }
    },
    mounted(){
      this.getData();
    },
    methods:{
      refreshData(){
        //刷新数据
        this.getData();
      },
      eventOperation({data,type}){
          //验证是否有操作权限
          if(!this.$handleVerify(this.handleNname[type])){
            this.$message({
              showClose: true,
              message:this.$authorityMsg,
              type: 'error'
            });
            return false;
          }
          this.otype=type;
          let row=data.row;
          if(type==="del"){

            this.$confirm('是否确定删除此信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //删除
              this.postData({id:row.id,name:row.name},this.$api.delBanner);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });

          }
          if(type==="edit"){
             this.otype='edit';
             this.visible=true;
             this.infoData={
               id:row.id,
               imgurl:row.bannerurl,
               name:row.name,
               content:row.content
             };
             this.imgurlInfo=[row.bannerurl];
             setTimeout(()=>{
               this.edittext('content').txt.html(row.content);
             }, 300);

          }
        },
        //添加信息
        addInfo(){
          //验证是否有操作权限
          if(!this.$handleVerify(this.handleNname['add'])){
            this.$message({
              showClose: true,
              message:this.$authorityMsg,
              type: 'error'
            });
            return false;
          }

          if(this.tableData.length>=5){
            this.$message.warning('最多添加5条轮播信息！');
            return false;
          }
          this.clearPostData();
          this.visible=true;
          this.otype='add';
        },
        clearPostData(){
          this.imgurlInfo=[];
          this.infoData={
            imgurl:"",
            name:"",
            content:""
          }
          this.clearedit('content');
        },
        close(t){
          this.visible=false;
        },
        //获取编辑器
        edittext(name){
          //设置编辑器内容
          if(this.$refs[name]){
            let {editor}=this.$refs[name].editor();
            return editor;
          }
        },
        //清除编辑器内容
        clearedit(name){
          if(this.$refs[name]){
            let {editor}=this.$refs[name].editor();
            editor.txt.clear()
          }
        },
       //添加信息验证
        submitFormInfo(formName){

          if(this.edittext('content').txt.text()!=""){
            this.infoData.content=this.edittext('content').txt.html();
          }else{
            this.infoData.content="";
          }

          this.infoData.imgurl=this.imgurlInfo.join(",");
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data=this.infoData;
              this.submitPostData(this.otype,data)

            } else {
              return false;
            }
          });
        },
        submitPostData(type,data){

          if(type=='add'){
             this.postData(data,this.$api.addBanner);
          }

          if(type=='edit'){
             this.postData(data,this.$api.editBanner);
          }
        },
        verification(){
          var v=[
             {field:"imgurl",type:{required:"请上传图片！"}},
             {field:"name",type:{required:"请填写名称！"}},
             {field:"content",type:{required:"内容不能为空！"}},
          ];
          v=this.$verification(v);
          return v;
        },
        //添加后获取图片
        getImage({set,imgUrl,index}){
          if(set.type==="add"){
            //添加
            this[index].push(imgUrl);
          }else if(set.type==="edit"){
            //编辑
            this.$set(this[index],set.index,imgUrl);
          }else if(set.type==="del"){
            //删除
           this[index]=this[index].filter((item,i)=>{
              if(set.index!=i){
                return item;
              }
            });
          }
        },
        setData({shareImgurl,shareName,info}){
          this.share={
            shareName:shareName,
            shareImgurl:shareImgurl
          },
          this.imgurl=[shareImgurl];
          this.tableData=info;
        },
        //提交数据后台
        postData(data,url){
          const loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:url,
            data:data,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                this.getData();
                this.clearPostData();
                this.visible=false;
                this.$message.success(res.msg);
              }else{
                this.$message.error(res.msg);
              }
          	},error:(err)=>{
          		this.$message.error(err);
          	}
          });
        },
        //获取列表数据
        getData(){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.banner,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 // this.setData(res.data.info);
                 this.tableData=res.data;
              }else{
                this.$message.error('数据加载失败');
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
  .info-box{
    padding-top: 15px;
  }
  .info{
    padding-top: 15px;
  }
  .botder-title strong{
    margin-right:25px;
  }
  .btn-box-s{
    padding-left: 90px;
  }

  .drawerContent{
   height: 93vh;
   background: #FFFFFF;
   overflow: scroll;
   padding-top: 15px;
  }

</style>
