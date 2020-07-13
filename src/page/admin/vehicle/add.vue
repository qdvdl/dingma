<template>
  <div class="form-box">
    <div class="formBoxS">
      <CreateForm ref="myForm" labelWidth="125px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="提交" :formData="formData" :formListItem="formListItem()"/>
    </div>
  </div>
</template>

<script>
  import CreateForm from "@/components/form";
  export default {
    components:{CreateForm},
    name:"addVehicle",
    data(){
      return{
          formData:this.setFormData(),
          rules:this.verification(),
          type:'',
      }
    },
    props:{
      brand:Object|Array
    },
    methods:{
        showFormData(data,type){
           if(type==="edit"){
            let {id,brand_id,fprice,fprices,mprice,mprices,version,price,text,title,imgsrc,banner,planText,sugText}=data.row;
            let d={
               fprice:fprice,
               mprice:mprice,
               fprices:fprices,
               mprices:mprices,
               id:id,
               brand_id:brand_id,
               version:version,
               price:price,
               text:text,
               title:title,
               imgsrc:imgsrc,
               banner:banner,
               planText:planText,
               sugText:sugText,
               imageUrl:[imgsrc]
            }
            d.bimageUrl=banner.split(',');
            this.formData=d;
            this.$refs.myForm.getEditor(planText,0);
            this.$refs.myForm.getEditor(sugText,1);
           }else{
             this.formData=this.setFormData();
             this.$refs.myForm.clearEditor(0);
             this.$refs.myForm.clearEditor(1);
           }
        },
        onSubmit({data}){
          //console.log(data);
          // 提交内容
          this.$emit('evnetPost',data);
        },
        setFormData(){
          //配置数据
          return {
            price:"",
            fprice:"",
            mprice:"",
            fprices:"",
            mprices:"",
            title:"",
            text:"",
            brand_id:"",
            imgsrc:"",
            imageUrl:[],
            banner:"",
            bimageUrl:[],
            planText:"",
            sugText:""
          }
        },
        verification(){
          //自定义验证
          var vimg = (rule, value, callback) => {
           // console.log(value)
            if (value!==""&&value.split(",").length<1) {
              callback(new Error('请上传图片至少上传1张!'));
            } else {
              callback();
            }
          };
          //分期方案内容
          var textCount = (rule, value, callback) => {
           var v=value.replace(/<\/?.+?>/g,"");
           var value=v.replace(/ /g,"");  //dds为得到后的内容
            if (value==="") {
              callback(new Error('内容不能为空!'));
            } else {
              callback();
            }
          };
          //验证数据
          var v=[
            {field:"brand_id",type:{required:"请选择车辆品牌！"}},
            {field:"version",type:{required:"请输入车辆型号！"},textCount:[1,20]},
            {field:"price",type:{required:"请输入厂家指导价！",price:'金额格式错误，小数点前面最大输入9位，保留两位小数！'},textCount:[1,12]},
            {field:"fprice",type:{required:"请输入普通首付金额！",price:'金额格式错误，小数点前面最大输入9位，保留两位小数！'},textCount:[1,12]},
            {field:"mprice",type:{required:"请输入普通月供金额！",price:'金额格式错误，小数点前面最大输入9位，保留两位小数！'},textCount:[1,12]},
            {field:"fprices",type:{price:'金额格式错误，小数点前面最大输入9位，保留两位小数！'},textCount:[1,12]},
            {field:"mprices",type:{price:'金额格式错误，小数点前面最大输入9位，保留两位小数！'},textCount:[1,12]},
            {field:"text",type:{required:"请输入赠送内容！"},textCount:[5,100]},
            {field:"title",type:{required:"请输入分享标题！"},textCount:[1,30]},
            {field:"imgsrc",validator:vimg,type:{required:"请上传封面图片！"}},
            {field:"banner",validator:vimg,type:{required:"请上banner图片！"}},
            {field:"planText",validator:textCount,type:{required:"请填写分期方案！"}},
            {field:"sugText",validator:textCount,type:{required:"详情介绍！"}}
          ];
          v=this.$verification(v);
          return v;
        },
        formListItem(){
          //配置表单
          let form=[
            {prop:"brand_id",placeholder:"请选择品牌",label:'车辆品牌：',type:'select',select:this.brand},
            {prop:"version", maxlength:20,placeholder:"请输入车辆型号",label:'车辆型号：',type:'text'},
            {prop:"price", maxlength:12,placeholder:"请输入厂商指导价",label:'厂商指导价：',type:'text'},
            {prop:"fprice", maxlength:12,placeholder:"请输入普通首付金额",label:'普通首付金额：',type:'text'},
            {prop:"mprice", maxlength:12,placeholder:"请输入普通月供金额",label:'普通月供金额：',type:'text'},
            {prop:"fprices", maxlength:12,placeholder:"请输入一成首付金额",label:'一成首付金额：',type:'text'},
            {prop:"mprices", maxlength:12,placeholder:"请输入一成首付月供金额",label:'一成月供金额：',type:'text'},
            {prop:"text", maxlength:100,placeholder:"请输入赠送内容",label:'赠送内容：',type:'textarea',height:"60px"},
            {prop:"title", maxlength:30,placeholder:"请输入分享标题",label:'分享标题：',type:'text'},
            {prop:"imgsrc", label:'封面图：',type:'imgUpload',placeholder:'图片建议尺寸：330*236;',
               croppParamePoster:{
                 croppersW:"1000px",//裁剪显示区域大小（像素）
                 croppersH:"500px",//裁剪显示区域大小（像素）
                 autoCropWidth:"330", //裁剪框的宽度（无）
                 autoCropHeight:"236", //裁剪框的高度（无）
                 top:"30vh",           //裁剪后弹窗顶部距离
                 topCrop:"20vh"       //裁剪前弹窗顶部距离
               },
               isCrop:true,
               uploadParame:{
                  data:{path:"reward"},//上传图片时携带图片参数
                  limit:1,//图片上传最大数量
                  action:this.$api.upload, //上传图片地址
               },
               name:'imageUrl' //formData对应key值名，formData[key]必须是数组
            },
            {prop:"banner", label:'banner图：',type:'imgUpload',placeholder:'图片建议尺寸：750*426;',
               croppParamePoster:{
                 croppersW:"1000px",//裁剪显示区域大小（像素）
                 croppersH:"500px",//裁剪显示区域大小（像素）
                 autoCropWidth:"750", //裁剪框的宽度（无）
                 autoCropHeight:"426", //裁剪框的高度（无）
                 top:"30vh",           //裁剪后弹窗顶部距离
                 topCrop:"20vh"       //裁剪前弹窗顶部距离
               },
               isCrop:true,
               uploadParame:{
                  data:{path:"reward"},//上传图片时携带图片参数
                  limit:5,//图片上传最大数量
                  action:this.$api.upload, //上传图片地址
               },
               name:'bimageUrl' //formData对应key值名，formData[key]必须是数组
            },
            {prop:"planText",label:'分期方案：',type:'editConten',height:"auto"},
            {prop:"sugText",label:'详情介绍：',type:'editConten',height:"auto"}

          ];
          return form;
        }
    }
  }
</script>

<style scoped>
  .item{
    background: green;
    margin-bottom: 20px;
    height: 180px;
  }
  .form-box{
    padding-top: 15px;
    padding-right: 15px;
    padding-bottom: 15px;
  }
  .formBoxS{
    height: 90vh;
    overflow: scroll;
  }
</style>
