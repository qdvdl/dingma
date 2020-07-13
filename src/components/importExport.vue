<template>
  <div>
    <div class="importexport">
      <div class="btn-item">
        <slot name="btnheader"></slot>
      </div>
      <div class="btn-item" v-if="isImport">
        <el-upload
          class="upload-demo"
          :action="action"
          :accept="accept"
          :show-file-list="false"
          :http-request="uploadRequest">
         <el-button size="small" type="warning" round><i class="el-icon-upload2"></i> 导入文件</el-button>
          <!-- <el-progress :percentage="percentage" :color="customColorMethod"></el-progress> -->
        </el-upload>
      </div>
      <div class="btn-item" v-if="isExport">
        <el-button size="small" @click="exportDownload(false)"  type="success" round><i class="el-icon-download"></i> 导出文件</el-button>
      </div>
      <div class="btn-item" v-if="isDown">
        <el-button @click="templateDownload" size="small" type="info" round><i class="el-icon-bottom"></i> 下载模版</el-button>
      </div>
      <div class="btn-item">
        <slot name="btnfooter"></slot>
      </div>
    </div>

    <el-dialog width="20%" title="表格格式" :close-on-click-modal="false" :visible.sync="dialogTableVisible">
        <div class="table-body">
          <div class="item" v-for="(value, key, index) in tableTitle" :key="key">
           {{key}}列为=>{{value}}
          </div>
          <p class="msg">如不清楚请参照模版！</p>
        </div>
    </el-dialog>

     <el-dialog  width="80%" title="错误数据,请检查以下数据" :close-on-click-modal="false"  :visible.sync="errVisible">
       <el-table  max-height="400" :data="errdata">
         <el-table-column v-for="(value, key, index) in tableTitle" :key="key" :label="value">
          <template slot-scope="scope">
            {{scope.row.data[field[index]]}}
          </template>
         </el-table-column>
         <el-table-column label="错误信息" width="300px">
          <template slot-scope="scope">
            <span class="error">{{scope.row.error}}</span>
          </template>
         </el-table-column>
         <!-- <el-table-column property="address" label="地址"></el-table-column> -->
       </el-table>
     </el-dialog>

     <el-dialog
       title="选择导出"
       :visible.sync="exportVisible"
       :close-on-click-modal="false"
       top="30VH"
       width="30%"
       center>

       <div>
         <el-radio v-model="importType" label="all" border>导出全部数据</el-radio>
         <el-radio v-model="importType" label="screen" border>导出筛选数据</el-radio>
         <!-- <el-radio v-model="radio1" label="1" border>导出筛选数据1</el-radio>
         <el-radio v-model="radio1" label="2" border>备选项2</el-radio> -->
       </div>

       <span slot="footer" class="dialog-footer">
         <el-button @click="exportVisible = false">取 消</el-button>
         <el-button type="primary" @click="exportDownload(true)">确 定</el-button>
       </span>
     </el-dialog>



  </div>
</template>

<script>
  let SparkMD5 = require('spark-md5');
  // 导入导出组件
  export default {
    name:"ImportExport",
    data(){
      return{
          accept:".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
          maxSize:2,
          percentage:0,
          loading:false,
          tableTitle:[], //字段对应
          dialogTableVisible:false,//字段展示弹窗
          errVisible:false, //错误数据弹窗
          errdata:[], //错误数据
          field:[],  //字段名称
          exportVisible:false, //导出数据弹窗
          importType:""
      }
    },
    props:{
      action:String ,//导入文件地址
      templateUrl:String, //下载文件模版地址
      exportUrl:String,//导出数据地址
      extra:Object,        //筛选额外参数
      isImport:Boolean,   //是否显示导入
      isExport:Boolean,    //是否显示导出
      isDown:Boolean,      //是否显示下载
    },
    methods:{
      //导出数据
      exportDownload(off){
        if(off){
          let data={}
          if(this.importType===""){
            this.$message.error("请选择导出类型！");
            return false;
          }
          if(this.importType==="screen"){
            data=this.extra;
          }
          let fide=this.parseParams(data);
         //表格数据获取
         const loading = this.$loading({
           lock: true,
           text: '加载中',
           spinner: 'el-icon-loading',
           background: 'rgba(0, 0, 0, 0.7)'
         });
         this.$request({
         	type:"post",
         	url:this.exportUrl,
         	success:(res)=>{
            loading.close();
            if(res.code===200){
             let str_arr=res.data.name.split('_');
             let href=`${this.$http}${str_arr[0]}/${str_arr[1]}?dowfiled=${str_arr[2]}&${fide}`;
             //  console.log(href);
             // return false;
             let a = document.createElement('a')
              a.href =href;
              a.click();
              this.exportVisible=false;
            }else{
              this.$message.error(res.msg);
            }
         	},error:(err)=>{
         		this.$message.error(err);
         	}
         });

         // this.exportVisible=false;
        }else{
          this.importType="";
          this.exportVisible=true;
        }

      },
      //下载模版
      templateDownload(){
          let a = document.createElement('a')
              a.href =this.$http+`${this.templateUrl}`
              a.click();
          this.$message({ message:'下载成功',type: 'success'});
      },
      parseParams(data){
          try {
              var tempArr = [];
              for (var i in data) {
                  var key = encodeURIComponent(i);
                  var value = encodeURIComponent(data[i]);
                  tempArr.push(key + '=' + value);
              }
              var urlParamsStr = tempArr.join('&');
              return urlParamsStr;
          } catch (err) {
              return '';
          }
      },
      //导入文件后写入数据
      upFile(data,info){
        info.path='import';
        this.$confirm('是否确认上传导入？','消息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton:true,
          type: 'warning',
          closeOnClickModal:false,
          closeOnPressEscape:false,
          beforeClose:(action, instance, done)=>{
            if(action=='confirm'){
                 this.loading=true;
                 this.$request({
                     type:"file",
                     url:this.action,
                     data:{
                       arrForm:data,
                       info:info,
                       uploading:(e,lent,sum)=>{
                         //进度条
                         //this.percentage=(lent/10)*100;
                         instance.confirmButtonLoading = true;
                         instance.confirmButtonText = '上传中...';

                       },
                       uploadend:()=>{
                         //全部上传结束
                         instance.confirmButtonText = '导入中...';
                         instance.confirmButtonLoading = false;
                       }
                     },
                     success:(res)=>{
                       this.loading=false;
                       done();
                       instance.confirmButtonLoading = false;
                       if(res.code===40000){
                          //导入成功
                          this.$message({ message: res.msg,type: 'success'});
                          this.$emit('successLoad');
                       }else if(res.code===40002){
                          //导入发生错误
                         // this.$message.error(res.msg);
                          this.errdata=res.error_data;
                          this.field= res.field
                          this.tableTitle=res.title;

                          this.$message({
                            message: res.msg,
                            type: 'error',
                            duration:2000,
                            onClose:()=>{
                              this.errVisible=true;
                            }
                          });
                       }else if(res.code===40003){
                          //表头不一致
                          this.tableTitle=res.title;
                          this.$message({showClose: true, message:res.msg,type: 'warning' ,
                            duration:2000,
                            onClose:()=>{
                              this.dialogTableVisible=true;
                            }
                          });
                       }else{
                         //发生错误
                         this.$message.error(res.msg);
                       }

                     },error:(err)=>{
                          instance.confirmButtonLoading = false;
                          this.loading=false;
                          done();
                          this.$message.error(err);
                     }
                 });
            }else{
              if(!this.loading){
                 done();
                 instance.confirmButtonLoading = false;
              }else{
                 this.$message({message: '文件正在操作中请勿取消操作！', type: 'warning'});
              }
            }

          }
        }).then(action=> {

        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '您取消了上传导入！'
          });
        });

      },
       //获取文件信息分割文件进行上传
      uploadRequest(d){

        let file=d.file;
        let type=file.type;

        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;//兼容
        let bytesPerPiece=this.maxSize*1024 * 1024;//每个文件切片大小定为1MB .1048576=1MB
        let chunks = Math.ceil(file.size /bytesPerPiece); //计算文件切片总份数

        let sizes = Math.ceil(file.size/1024);
        if(sizes>700){
          this.$message({message: '请上传不要超过700KB的文件,请分批上传！', type: 'warning'});
          return false;
        }


        this.fielSlice(file,(hexHash)=>{
          let arrForm=[];
          for(var i=0;i<chunks;i++){
              const start = i * bytesPerPiece;
              const end = Math.min(file.size, start + bytesPerPiece);
             // console.log(blobSlice.call(file, start, end));
              let form=new FormData();
              //图片切片
              form.append('file',blobSlice.call(file, start, end));
              form.append('index', i);
             // console.log(start,file.size);
              arrForm.push(form)
          }
          this.upFile(arrForm,{
            chunks:chunks, //分片总数
            hash:hexHash, //机密的唯一文件
            size:file.size,  //大小
            name:file.name   //文件名称
          });

        },(err)=>{
          console.log(err);
        });
      },
      //加密文件唯一标示
      fielSlice(file,success,err){
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;//兼容
        let bytesPerPiece=this.maxSize*1024 * 1024;//每个文件切片大小定为1MB .1048576=1MB
        let fileSize=file.size; //文件大小
        let fileName=file.name; //文件名称
        let chunks = Math.ceil(fileSize /bytesPerPiece); //计算文件切片总份数
        let currentChunk = 0; //读取第几块

        let spark = new SparkMD5.ArrayBuffer(); //二进制加密对象
        let fileReader = new FileReader();  //读取文件对象

        fileReader.onload=(e)=>{
          //读取文件操作完成
          //console.log(`第${currentChunk}分片解析完成，开始解析${currentChunk + 1}分片`,'共'+chunks+'份数');
          spark.append(e.target.result);
          currentChunk++;
          if (currentChunk < chunks) {
              var start = currentChunk * bytesPerPiece;
              let end = ((start + bytesPerPiece) >= fileSize) ? fileSize : start + bytesPerPiece;
              fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
          } else {
              const result=spark.end();
              const sparkMd5 = new SparkMD5();
              sparkMd5.append(result);
              sparkMd5.append(file.name);
              const hexHash = sparkMd5.end();
              success(hexHash)
          }
        }
        fileReader.onerror = function () {
          //读取文件发生错误
           err('oops, something went wrong.')
        };
        var start = currentChunk * bytesPerPiece;
        let end = ((start + bytesPerPiece) >= fileSize) ? fileSize : start + bytesPerPiece;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
    }
  }
</script>

<style scoped>
  .importexport{
    display: flex;
  }
  .importexport .btn-item{
    margin-right: 10px;
    position: relative;
  }
  .progress-box{
    position: absolute;
    left: -7px;
    bottom: -20px;
    width: 134px;
    height: 20px;
  }
  .table-body{
    padding-bottom: 15px;
  }
   .table-body .item{
    height: 30px;
    line-height: 30px;
  }
  .table-body .msg{
    color:  red;
    padding-top: 30px;
  }
  .error{
    color: red;
  }

</style>
