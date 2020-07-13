<template>
  <div class="setadmin-index">
    <CreateForm :inline="inline" labelWidth="100px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="保存" :formData="formData" :formListItem="formListItem()"/>
  </div>
</template>

<script>
  import CreateForm from "@/components/form";
  export default {
    components:{CreateForm},
    data(){
      return{
         inline:false,
         formData:{
            title:"", //网站title名称
            name:"",   //网站名称
            record:"",       //网站备案号
            phoneTel:""      //网站客服电话|手机号
          },
         rules:this.verification(),

      }
    },
    mounted(){
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$request({
      	type:"get",
      	url:this.$api.setAdmin,
      	success:(res)=>{
          loading.close();
          if(res.code===200){
            let d=res.data;
            this.formData={
              title:d.title, //网站title名称
              name:d.name,   //网站名称
              record:d.record,       //网站备案号
              phoneTel:d.phoneTel      //网站客服电话|手机号
            }
          }else{
           this.$message.error(res.msg);
          }
      	},error:(err)=>{
      		this.$message.error(err);
      	}
      });


    },
    methods:{
      // ###表单配置||验证###
      verification(){
        //自定义验证
        var v=[
           {field:"title",type:{required:"请输入网站标题！"},textCount:[2,15]},
           {field:"name",type:{required:"请输入网站名称！"},textCount:[2,10]},
           {field:"record",textCount:[5,100]},
           {field:"phoneTel",type:{required:"请输入手机|电话！",phoneTel:'必须格式：xxx-xxxxxxx或者11位手机号'},textCount:[10]},
        ];
        v=this.$verification(v);
        return v;
      },
      formListItem(){
        //表单字段配置
        let formitem=[
          {prop:"phoneTel", maxlength:12,placeholder:"请输座机号或者手机号",label:'座机/手机：',type:'text'},
          {prop:"title", maxlength:15,placeholder:"请输入网站标题",label:'网站标题：',type:'text'},//普通text
          {prop:"name", maxlength:10,placeholder:"请输入网站名称",label:'网站名称：',type:'text'},
          {prop:"record", maxlength:100,placeholder:"请输入网站备案信息",label:'网站备案：',type:'text'}

        ];
        return formitem;
      },

      onSubmit({data}){
        //验证是否有操作权限
        if(!this.$handleVerify('addAdmin')){
          this.$message({showClose: true, message:this.$authorityMsg,type: 'error' });
          return false;
        }

        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.$request({
        	type:"post",
        	url:this.$api.setAdmin,
          data:data,
        	success:(res)=>{
            loading.close();
            if(res.code===200){
              this.$message({message:'保存成功', type: 'success'});
              let d=res.data;
              this.formData={
                title:d.title, //网站title名称
                name:d.name,   //网站名称
                record:d.record,       //网站备案号
                phoneTel:d.phoneTel      //网站客服电话|手机号
              }
              this.$emit('viewon',{siteinfo:d});
            }else{
             this.$message.error(res.msg);
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
  .setadmin-index{
    padding-top: 25px;
    padding-right: 15px;
  }
</style>
