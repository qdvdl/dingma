<template>
  <div class="form-box">
    <CreateForm ref="myForm" labelWidth="100px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="提交" :formData="formData" :formListItem="formListItem()"/>
  </div>
</template>

<script>
  import CreateForm from "@/components/form";
  export default {
    components:{CreateForm},
    name:"addForm",
    data(){
      return{
          formData:this.setFormData(),
          rules:this.verification(),
          type:'',
      }
    },
    methods:{
        showFormData(data,type){
           if(type==="edit"){
             let {id,name,price,priceSum,imgurl}=data.row;
             let d={
               name:name,
               price:price,
               priceSum:priceSum,
               img:imgurl,
               imageUrl:[imgurl],
               id:id
             }
             this.formData=d;
           }else{
             this.formData=this.setFormData();
           }
        },
        onSubmit({data}){
          //数据验证通过
          this.$emit('evnetPost',data);
        },
        setFormData(){
          //配置数据
          return {
            name:"",
            price:"",
            priceSum:"",
            img:"",
            imageUrl:[]
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
          //验证数据
          var v=[
             {field:"img",validator:vimg,type:{required:"请上传图片！"}},
             {field:"name",type:{required:"请输入礼品名称！"},textCount:[2,25]},
             {field:"price",type:{required:"请输入对应价值金额！",amount:"请输入正确金额格式，保留两位小数！"},textCount:[0,20]},
             {field:"priceSum",type:{required:"请输成交数量！",number:"请输入正确整数！"},textCount:[0,20]},
          ];
          v=this.$verification(v);
          return v;
        },
        formListItem(){
          //配置表单
          let form=[
            {prop:"img", label:'礼品图片：',type:'imgUpload',placeholder:'图片建议尺寸：200*200;',
               croppParamePoster:{
                 croppersW:"800px",//裁剪显示区域大小（像素）
                 croppersH:"400px",//裁剪显示区域大小（像素）
                 autoCropWidth:"200", //裁剪框的宽度（无）
                 autoCropHeight:"200", //裁剪框的高度（无）
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
            {prop:"name", maxlength:25,placeholder:"请输入礼品名称",label:'礼品名称：',type:'text'},
            {prop:"price", maxlength:255,placeholder:"请输入对应价值金额",label:'对应价值：',type:'text'},
            {prop:"priceSum", maxlength:25,placeholder:"请输成交数量",label:'获取要求：',type:'text'},
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
</style>
