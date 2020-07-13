<template>
  <div class="info">
      <div class="botder-title"><strong>成交信息设置</strong></div>
      <div class="info-box"><el-button type="primary" icon="el-icon-plus" round size="small" @click="addInfo">添加信息</el-button> </div>
      <div class="info-box">
          <TbaleList :tableData="tableData"  @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      </div>
      <div class="botder-title">
          <strong>分享设置</strong>
      </div>
      <div class="info-box" style="width: 50%;">
          <el-form ref="share" :rules="postRules" :model="share" label-width="90px">
            <el-form-item label="分享标题:" prop="shareName">
              <el-input maxlength="20" v-model="share.shareName"></el-input>
            </el-form-item>
            <el-form-item label="分享图片:" prop="shareImgurl">
              <Upload :croppParame="croppParame" :isCrop="true" item="imgurl" name="imgurl" :imgList="imgurl" :parame="uploadParame" @onSuccess="getImage"></Upload>
              <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸300*300像素</p>
            </el-form-item>
          </el-form>
      </div>
      <div class="btn-box-s">
         <el-button @click="submitForm('share')"  type="primary" plain>保存</el-button>
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
          <div slot="title" class="drawer-title">成交信息<div class="icon" @click="close('hide')"><i class="el-icon-close"></i></div></div>
          <div class="drawerContent">
              <el-form ref="infoData" :rules="postRulesInfo" :model="infoData" label-width="90px">
                <el-form-item label="分享图片:" prop="imgurl">
                  <Upload :croppParame="croppParame1" :isCrop="true" item="imgurlInfo" name="imgurlInfo" :imgList="imgurlInfo" :parame="uploadParame" @onSuccess="getImage"></Upload>
                  <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸100*100像素</p>
                </el-form-item>
                <el-form-item label="手机号:" prop="tel">
                  <el-input maxlength="11" placeholder="请输入手机号" v-model="infoData.tel"></el-input>
                </el-form-item>
                <el-form-item label="车辆品牌:" prop="brand_name">
                  <el-select v-model="infoData.brand_name" placeholder="请选择车辆品牌" style="width: 100%;">
                    <el-option v-for="item in brand" :key="item.id" :label="item.name" :value="item.name"></el-option>
                  </el-select>
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
  import TbaleList from '@/components/table';//表格展示数据
  import Upload from '@/components/upload';
  export default {
    components:{TbaleList,Upload},
    data(){
      return{
          croppParame1:{
            croppersW:"400px",//裁剪显示区域大小（像素）
            croppersH:"400px",//裁剪显示区域大小（像素）
            autoCropWidth:"100", //裁剪框的宽度（无）
            autoCropHeight:"100", //裁剪框的高度（无）
            top:"30vh",           //裁剪后弹窗顶部距离
            topCrop:"20vh"       //裁剪前弹窗顶部距离
          },
        // 上传图片配置
          croppParame:{
            croppersW:"800px",//裁剪显示区域大小（像素）
            croppersH:"400px",//裁剪显示区域大小（像素）
            autoCropWidth:"300", //裁剪框的宽度（无）
            autoCropHeight:"300", //裁剪框的高度（无）
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
          share: {
            shareName: '',
            shareImgurl:""
          },
          postRules:this.verification(), //验证表单
          postRulesInfo:this.verificationInfo(),
          //添加表格成交信息
          imgurlInfo:[],
          infoData:{
            imgurl:"",
            tel:"",
            brand_name:""
          },
          brand:[],
          //数据表格
          tableData:[],//表格数据
          visible:false,
          http:this.$http,
          otype:'',
          index:'',
          column:[
          //配置列表显示数据
          {prop:"imgurl",name:"头像",minWidth:170,isShowType:"img"},
          {prop:"tel",name:"手机号",minWidth:170,isShowType:"default",isUnfold:true},
          {prop:"brand_name",name:"车辆品牌",minWidth:170,isShowType:"default"},
          {prop:'state',name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
             {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
             {size:"mini",type:"danger",plain:true,name:"删除",field:'del'}
          ]}
        ]
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
          this.otype=type;
          if(type==="del"){

            this.$confirm('是否确定删除此信息?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tableData=this.tableData.filter((item,i)=>{
               if(data.$index!=i)  return item;
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });

          }
          if(type==="edit"){
            let row=this.tableData[data.$index];
            this.index=data.$index;
            this.visible=true;
            this.infoData={
              imgurl:row.imgurl,
              tel:row.tel,
              brand_name:row.brand_name
            };
            this.imgurlInfo=[row.imgurl];
          }
        },
        //添加信息
        addInfo(){
          if(this.tableData.length>=10){
            this.$message.warning('最多添加10条成交信息！');
            return false;
          }
          this.imgurlInfo=[];
          this.infoData={
            imgurl:"",
            tel:"",
            brand_name:""
          }
          this.visible=true;
          this.otype='add';
        },
        close(t){
          this.visible=false;
        },
        //添加提交
        submitForm(formName){
          if(this.tableData.length<=0){
            this.$message.warning('至少添加一条成交信息！');
            return false;
          }
          this.share.shareImgurl=this.imgurl.join(",");
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data=this.share;
              data.info=this.tableData;
              this.postData(data);
            } else {
              return false;
            }
          });
        },
        submitFormInfo(formName){
          this.infoData.imgurl=this.imgurlInfo.join(",");
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data=this.infoData;
              let i="";
              let off=this.tableData.some((item,k)=>{
                 if(item.tel==data.tel){
                   i=k;
                 }
                 return item.tel==data.tel;
              });
              if(this.otype==='add'){
                if(off){
                  this.$message.warning('列表中手机号已存在，不能重复添加！');
                  return false;
                }
                this.tableData.push(data);
              }
              //如果是编辑替换当前数据
              if(this.otype==='edit'){
                if(off&&i!=this.index){
                  this.$message.warning('列表中手机号已存在，不能重复添加！');
                  return false;
                }
                this.$set(this.tableData,this.index,data);
              }
              this.close();
            } else {
              return false;
            }
          });
        },
        verificationInfo(){
          var v=[
             {field:"imgurl",type:{required:"请上传头像！"}},
             {field:"tel",type:{required:"请填写手机号！",tel:'必须是正确的11为手机号'},textCount:[11]},
             {field:"brand_name",type:{required:"请选择车辆品牌！"},textCount:[2,20]},
          ];
          v=this.$verification(v);
          return v;
        },
        //验证消息
        verification(){
          var v=[
             {field:"shareName",type:{required:"请输入分享标题！"},textCount:[2,20]},
             {field:"shareImgurl",type:{required:"请上传图片！"}},
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
        postData(data){
          const loading = this.$loading({
            lock: true,
            text: '提交中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"post",
          	url:this.$api.setBasics,
            data:data,
          	success:(res)=>{
             loading.close();
              if(res.code==200){
                this.$message.success(res.msg);
              }else{
                this.$message.error('数据加载失败');
              }
          	},error:(err)=>{
          		this.$message.error(err);
          	}
          });
        },
        getData(){
          const loading = this.$loading({
            lock: true,
            text: '加载中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          this.$request({
          	type:"get",
          	url:this.$api.setBasics,
          	success:(res)=>{
              loading.close();
              if(res.code==200){
                 this.setData(res.data.info);
                 this.brand=res.data.brand;
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
