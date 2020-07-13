<template>
  <div>
    <div @click="showVisibleList" class="el-upload el-upload--picture-card">
       <i class="el-icon-plus"></i>
    </div>

    <el-dialog :before-close="dialogBeforeClose" width="80%" top="10vh" :close-on-click-modal="false" :visible.sync="visibleList">
      <div slot="title" class="btn-title">
        <div class="inline" v-show="!disabled">
          <el-upload ref="listUpload" :limit="maxLimit" :on-exceed="onExceed" :show-file-list="false" :multiple="true" :http-request="httpRequest" :action="action">
            <el-button plain><i class="el-icon-circle-plus"></i>批量选择</el-button>
          </el-upload>
        </div>
        <div class="inline" v-show="disabled">
          <el-button :disabled="disabled" plain><i class="el-icon-circle-plus"></i>批量选择</el-button>
        </div>
        <div class="inline">
           <el-button type="primary" :disabled="disabled"   @click="uploadAll"><i class="el-icon-upload"></i>开始上传</el-button>
        </div>
        <div class="inline" v-if="uploadSuccess.length>0">
           <el-button type="success" @click="saveAll"><i class="el-icon-finished"></i>保存列表</el-button>
        </div>
      </div>
      <el-table  empty-text="暂无文件" width="80%" height="500px" :border='true' :data="imgList">
         <el-table-column property="name" label="名称"></el-table-column>
         <el-table-column property="size" label="大小" width="200">
           <template slot-scope="scope">{{scope.row.size}}KB</template>
         </el-table-column>
         <el-table-column  label="状态">
           <template slot-scope="scope">
             <el-progress :text-inside="true" :stroke-width="15" :percentage="scope.row.progress" status="success"></el-progress>
           </template>
         </el-table-column>
         <el-table-column label="操作"  width="180" align="center">
            <template slot-scope="scope">
                <el-button @click="delListFile(scope.row)" :disabled="disabled"  type="danger" size="small" icon="el-icon-delete" circle></el-button>
            </template>
         </el-table-column>
     </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name:"uploadList",
    data(){
      return{
        disabled:false,//全部禁止上传
        imgList:[],    //选择好的列表
        visibleList:false,
        action:"", //文件上传数量
        maxLimit:this.limit, //最大上传数量
        uploadSum:0,
        uploadSuccess:[]//上传成功文件列表
       }
    },
    props:{
      limit:Number,
      parame:Object|Array
    },
    methods:{
      dialogBeforeClose(done){
        if(this.uploadSuccess.length>0){
          this.$alert('关闭后会清除上传列表,确认要关闭吗？', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              if(action!="cancel"){
                done();
              }
            }
          });
        }else{
           done();
        }
      },
      showVisibleList(){
        this.uploadSuccess=[];//清空当前选择的
        this.imgList=[];      //清空当前选择的
        this.visibleList=true;//启动选择列表
        this.$refs.listUpload.clearFiles();
        let sum=this.limit-this.imgList.length;
        this.maxLimit=sum;
      },
      saveAll(){
        let res=this.uploadSuccess;
        for(var i=0;i<res.length;i++){
          this.$emit('onSaveAll',{res:res[i]})
        }
        this.visibleList=false;
      },
      uploadAll(){
        //方式重复上传
        let imgList=this.imgList;
        if(imgList.length<=0||imgList.length==this.uploadSuccess.length){
          this.$message({message:"请选择文件后上传！", type: 'warning'});
          return false;
        }

        this.disabled=true; //禁止重复提交
        //循环开始上传列表
        for(var i=0;i<imgList.length;i++){
          let row=imgList[i];
          if(row.progress===0){
            this.requestList(this.parame,row);
          }
        }
      },
      setAllHash(d){
        d.id=`${d.hash}${this.imgList.length}`;
        d.index=this.imgList.length;
        d.progress=0;
        this.imgList.push(d);
      },
      httpRequest(d){
        //选择文件
        let file=d.file;
        let sizes = Math.ceil(file.size/1024);
        this.$emit('setBatchHash',{file:file});
      },
      onExceed(files,fileList){
        let sum=this.limit-this.imgList.length;
        this.$message({message:`最多还可以选择${sum}个文件!`, type: 'warning'});
      },
      delListFile(row){
        //删除列表中的文件
        this.imgList=this.imgList.filter((item)=>{
          if(item.id!==row.id) return item;
        })
        //删除已经上传的文件
        this.uploadSuccess=this.uploadSuccess.filter((item,index)=>{
          if(index!=row.index) return item;
        })
        this.$refs.listUpload.clearFiles();
        let sum=this.limit-this.imgList.length;
        this.maxLimit=sum;
      },
     requestList(d,row,index){
         //上传信息
        let info=Object.assign({},{
          chunks:row.chunks,
          hash:row.hash,
          size:row.size,
          name:row.name,
          isFileType:row.isFileType
        },d.data);
        //开始提交后台
        this.$request({
            type:"file",
            url:d.action,
            data:{
              arrForm:row.arrForm,
              info:info,
              uploading:(e,lent,sum)=>{
                //计算进度进度条
                row.progress=(lent/sum)*100;
                this.$set(this.imgList,index,row);
              }
            },
            success:(res)=>{
              if(res.code===200){
                this.uploadSuccess.push(res)
              }else{
                 this.$message.error(res.msg);
              }
              this.allSuccess();
            },error:(err)=>{
               this.$message.error(err);
            }
        });
      },
      allSuccess(){
        //全部上传完成
        if(this.uploadSuccess.length===this.imgList.length){
           this.$message({
              message: '列表上传成功！',
              type: 'success'
           });
          this.disabled=false; //解除重复提交
        }
      }

    }

  }
</script>

<style>
  .imgBox{
    overflow: hidden;
  }
  .inline{
    display:inline-block;
    width: 130px;
  }
  .img-inline{
    float: left;
    width: 148px;
    height: 148px;
    display: table;
    margin-right: 15px;
    margin-bottom: 15px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
  }
 .img-inline .item{
     display: table-cell;
     vertical-align: middle;
     text-align: center;
     background: #EBEEF5;
     border-radius: 6px;
     border: 1px solid #EBEEF5;
  }
  .box{
     background: #EBEEF5;
     max-height: 148px;
     max-width: 148px;
     overflow: hidden;
     overflow: hidden;
  }
  .img-inline .el-image{
    display: inline;
  }
  .dialog-footer{
    text-align:left;
  }
  .btn-title{
    /* border-bottom: 1px solid #ebeef5; */
    padding-bottom:13px;
    overflow: hidden;
  }

</style>
