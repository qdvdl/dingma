<template>
  <div>
    <div class="croppers" v-bind:style="{width:'94%',height:croppParame.croppersH}">
       <VueCropper
        ref="cropper"
        :canMoveBox="canMoveBox"
        :fixedBox="fixedBox"
        :autoCrop="autoCrop"
        :autoCropWidth="croppParame.autoCropWidth"
        :autoCropHeight="croppParame.autoCropHeight"
        :mode="mode"
        :img="img"
        :infoTrue="infoTrue"
        :centerBox="centerBox"
        :canMove="canMove"
        :outputSize="1"
        @realTime="realTime"
        />
    </div>


     <!-- 裁剪图片按钮 -->
    <div class="cropper-btn">
      <el-button title="放大"  @click="imgOperation('size_fd')" type="primary" icon="el-icon-zoom-in" circle></el-button>
      <el-button title="缩小" @click="imgOperation('size_sx')"  type="success" icon="el-icon-zoom-out" circle></el-button>
      <el-button title="裁剪" @click="imgOperation('crop')"  type="info" icon="el-icon-camera" circle></el-button>
      <el-button title="左旋转" @click="imgOperation('rotateLeft')" type="warning" icon="el-icon-refresh-left" circle></el-button>
      <el-button title="右旋转" @click="imgOperation('rotateRight')" type="danger" icon="el-icon-refresh-right" circle></el-button>
    </div>



  </div>
</template>

<script>
  import { VueCropper }  from 'vue-cropper';

  export default {
    components:{VueCropper},
    name:"imgCrop",
    data(){
      return{
          // 截图参数配置
          mode:"auto",//显示图片大小设置
          autoCrop:true,//是否生成截图框
         // autoCropWidth:"300", //裁剪框的宽度
         // autoCropHeight:"300", //裁剪框的高度
          fixedBox:true,//截图框是否可以鼠标拖动改变大小
          canMoveBox:false,//截图框是否可以拖动
          canMove:true, //图片是否可以拖动
         // img:"",//需要截图的图片资源 url 地址 || base64 || blob
          centerBox:false,//是让截图框和图片大小一致，如果开启：当图片<截图框（框大小和图片一致），
          infoTrue:false,
          blobimg:"",//裁剪后的图片
          isShowBlob:false
      }
    },
    props:{
      img:String, //需要截图的图片资源 url 地址 || base64 || blob
      croppParame:Array|Object
    },
    mounted(){
      //this.$refs.cropper.cropW='100px';
     // this.$refs.cropper.cropH="100px";
    },
    methods:{
      imgOperation(type){
        if(type==="size_sx"){
          //缩小
          this.$refs.cropper.changeScale(-5);
        }else if(type==="size_fd"){
          //放大
          this.$refs.cropper.changeScale(5);
        } else if(type==="crop"){
          //开始裁剪
          this.$refs.cropper.startCrop()
          this.$refs.cropper.getCropData((data) => {
              this.$emit('getCropDatas',{data:data});
              // this.blobimg=data;
              // this.isShowBlob=true;
          })

        }else if(type==="rotateLeft"){
          this.$refs.cropper.rotateLeft(); //向左边旋转90度
        }else if(type==="rotateRight"){
          this.$refs.cropper.rotateRight(); //向右边旋转90度
        }

      },
      realTime(data){
        //console.log(data)
      }
    }
  }
</script>

<style>

.preview{
  width: 300px;
  height: 300px;
  overflow: hidden;

}
.preview img{
  max-width: 100%;
}
.cropper-btn{
  text-align: center;
  padding-top: 40px;
}
.cropper-img{
  /* background: red; */
  text-align: center;
}
.pmsg{
  margin-bottom: 15px;
  color:#b3b3b3;
  font-size: 12px;
}
</style>
