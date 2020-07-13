<template>
  <div >
    <div class="textImg">
      <el-tabs :tab-position="tabPosition" style="height: 630px;">
        <el-tab-pane label="分享海报">
            <div class="paneBox">
              <Upload :croppParame="croppParamePoster" :isCrop="false" item="imgPoster" name="imgPoster" :imgList="imgPoster" :parame="uploadParame" @onSuccess="getImage"></Upload>
              <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸750*1200像素</p>
            </div>
            <div class="btn-box-s">
               <el-button size="small" @click="submitForm"  type="primary" plain>保存</el-button>
            </div>
        </el-tab-pane>
     <!--   <el-tab-pane label="首页图文">
          <div class="paneBox">
            <div class="uploadimg">
              <Upload :croppParame="croppParame" :isCrop="true" item="homePoster" name="homePoster" :imgList="homePoster" :parame="uploadParame" @onSuccess="getImage"></Upload>
              <p class="imgMsg"><i class="el-icon-warning-outline"></i>建议尺寸300*1000像素</p>
            </div>
            <div class="textContent">
              <Editor ref="hometext" name="hometext" @getContent="getContent"></Editor>
            </div>
          </div>
          <div class="btn-box-s">
             <el-button size="small" @click="submitForm" type="primary" plain>保存</el-button>
          </div>
        </el-tab-pane> -->
        <el-tab-pane label="关于我们">
          <div class="paneBox">
            <Editor ref="gywmtext" name="gywmtext" @getContent="getContent"></Editor>
         </div>
         <div class="btn-box-s">
            <el-button size="small" @click="submitForm"  type="primary" plain>保存</el-button>
         </div>
        </el-tab-pane>
        <el-tab-pane label="购买须知">
          <div class="paneBox">
            <Editor ref="gmxztext" name="gmxztext" @getContent="getContent"></Editor>
          </div>
          <div class="btn-box-s">
             <el-button size="small" @click="submitForm"  type="primary" plain>保存</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>

    </div>

  </div>
</template>

<script>
  import Upload from '@/components/upload';
  import Editor from '@/components/editor';
  export default {
    components:{Upload,Editor},
    data(){
      return{
        tabPosition: 'top',
        // 上传图片设置
        croppParamePoster:{
          croppersW:"1000px",//裁剪显示区域大小（像素）
          croppersH:"1400px",//裁剪显示区域大小（像素）
          autoCropWidth:"750", //裁剪框的宽度（无）
          autoCropHeight:"1200", //裁剪框的高度（无）
          top:"30vh",           //裁剪后弹窗顶部距离
          topCrop:"20vh"       //裁剪前弹窗顶部距离
        },
        croppParame:{
          croppersW:"750px",//裁剪显示区域大小（像素）
          croppersH:"400px",//裁剪显示区域大小（像素）
          autoCropWidth:"600", //裁剪框的宽度（无）
          autoCropHeight:"200", //裁剪框的高度（无）
          top:"30vh",           //裁剪后弹窗顶部距离
          topCrop:"20vh"       //裁剪前弹窗顶部距离
        },
        uploadParame:{
          data:{path:"home"},//上传图片时携带图片参数
          limit:1,//图片上传最大数量
          action:this.$api.upload,//上传图片地址
        },
        imgPoster:[], //海报
        homePoster:[],//首页图片
        dataPost:{
          imgPoster:"",
          homeimg:"",
          hometext:"",
          gywmtext:"",
          gmxztext:"",
        },


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
      submitForm(){

        this.setedit();
        let obj=this.dataPost;
        let off=true;
         for(var key in obj){
           if(!obj[key]) off=false;
         }
         if(!off){
           this.$message.warning('信息不完善！');
           return false;
         }
         //提交内容处理
         this.postData(this.dataPost);
      },
      getContent({name,content}){
        this.dataPost[name]=content;
      },
      //上传图片
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
      //获取编辑器
      edittext(name){
        //设置编辑器内容
        let {editor}=this.$refs[name].editor();
        return editor;
      },
      //设置内容
      setedit(){

        this.dataPost.imgPoster=this.imgPoster.join(",");
        // this.dataPost.homeimg=this.homePoster.join(",");


        var hometext="",gywmtext="",gmxztext="";
        // if(this.edittext('gmxztext').txt.text()!=""){
        //   hometext=this.edittext('hometext').txt.html();
        // }

        if(this.edittext('gywmtext').txt.text()!=""){
          gywmtext=this.edittext('gywmtext').txt.html();
        }

        if(this.edittext('gmxztext').txt.text()!=""){
          gmxztext=this.edittext('gmxztext').txt.html();
        }

        // this.dataPost.hometext=hometext;
        this.dataPost.gywmtext=gywmtext;
        this.dataPost.gmxztext=gmxztext;

      },
      setData({imgPoster,hometext,gywmtext,gmxztext}){
        let data={
          imgPoster:imgPoster,
          // homeimg:homeimg,
          hometext:hometext,
          gywmtext:gywmtext,
          gmxztext:gmxztext
        };

        // this.edittext('hometext').txt.html(hometext);
        this.edittext('gywmtext').txt.html(gywmtext);
        this.edittext('gmxztext').txt.html(gmxztext);

        this.imgPoster=[imgPoster];//海报
        // this.homePoster=[homeimg]; //首页图片
        this.dataPost=data;
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
        	url:this.$api.imgtext,
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
        	url:this.$api.imgtext,
        	success:(res)=>{
            loading.close();
            if(res.code==200){
               this.setData(res.data);
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
  .textImg{
    padding-top: 20px;
  }
  .paneBox{
    padding-left: 20px;
    position: relative;
    z-index: 1;
  }
  .textContent{
    padding-top: 15px;
  }
  .btn-box-s{
    padding-left:19px;
    padding-top: 15px;
  }
  .uploadimg{
    position: relative;
    z-index: 9;
  }
  .textContent{
    position: relative;
    z-index: 1;
  }
</style>
