<template>
  <div>
      <ImportExport/>




    <div class="item">

      <h2 class="title">1.导入</h2>

        <el-upload
          class="upload-demo"
          action=""
           :accept="accept"
          :http-request="_import"
          list-type="picture">
          <el-button size="small" type="primary">本地导入</el-button>
        </el-upload>
        <ul>
          <li v-for="(item,index) in data" :key="index">{{item}}</li>
        </ul>
    </div>
    <div class="item">
      <h2 class="title">2.导出</h2>
      <el-button size="small" type="danger" @click="_export">导出</el-button>
    </div>
    <div class="item">
      <h2 class="title">3.分片上传导入</h2>
      <el-upload
        class="upload-demo"
        action=""
         :accept="accept"
        :http-request="uploadRequest"
        list-type="picture">
        <el-button size="small" type="danger">导入文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

    </div>
  </div>
</template>

<script>

  import UploadAll from '@/components/uploadAll';//批量组件
  import ImportExport from '@/components/importExport';//导入导出


  let XLSX = require('xlsx');
  let SparkMD5 = require('spark-md5');
  export default {
    components:{UploadAll,ImportExport},
    data(){
      return{
        // accept:".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        accept:"",
        data:[],
        list:[
          ["姓名","年龄","手机号","身份证"]
        ]
      }
    },
    created(){
      for(var i=0;i<100000;i++){
        this.list.push([
          "张"+(i+1),
          (i+1),
          "18200213228"+i,
          "6226251991081"+i
        ])
      }
    },
    methods:{
      upFile(data,info){
         // let arrForm=[];
         //info.url="index.php/main/uploadd";
          this.$request({
          	type:"file",
          	url:"main/sheetUpload",
            data:{
              arrForm:data,
              info:info,
              url:"main/sheetUpload",
              uploading:(e,arrProgress)=>{
                console.log(e.hash,arrProgress);
              }
            },
          	success:(res)=>{
             // console.log(res);
          	},error:(err)=>{
          		//console.log(err);
          	}
          });
      },
      uploadRequest(d){
        let file=d.file;
        let type=file.type;
        //console.log(type);
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;//兼容
        let bytesPerPiece=2*1024 * 1024;//每个文件切片大小定为1MB .1048576=1MB
        let chunks = Math.ceil(file.size /bytesPerPiece); //计算文件切片总份数

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
      fielSlice(file,success,err){
        //问价加米
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;//兼容
        let bytesPerPiece=2*1024 * 1024;//每个文件切片大小定为1MB .1048576=1MB
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
           console.warn('oops, something went wrong.');
           err('oops, something went wrong.')
        };

        var start = currentChunk * bytesPerPiece;
        let end = ((start + bytesPerPiece) >= fileSize) ? fileSize : start + bytesPerPiece;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));

      },
      _export(){
          const ws = XLSX.utils.aoa_to_sheet(this.list);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
          /* 生成文件并发送到客户端 */
          XLSX.writeFile(wb, "sheetjs.xlsx");
      },
      _import(d){
        const reader = new FileReader();
        reader.readAsBinaryString(d.file);
        reader.onload = (e) => {
          // 解析数据
          const bstr=e.currentTarget.result
          const wb = XLSX.read(bstr, {type:'binary'});
          //获得第一个工作表
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          //数组转换层json格式
          const data = XLSX.utils.sheet_to_json(ws, {header:1});
         // console.log(data);
          this.data=data;
        }
      }

    }
  }
</script>

<style>
  .item{
    padding: 15px 0;
  }
</style>
