<template>
  <div class="form-box">
    <div class="formBoxS">
      <CreateForm ref="myForm" labelWidth="130px" :rules="rules" @eventSubmit="onSubmit" refNanme="sbmit" bntText="提交" :formData="formData" :formListItem="formListItem()">
        <div slot="selectinfo" class="selectInfo">
          <div style="margin-bottom: 22px;">
            <el-date-picker style="width: 100%;" :disabled="type=='edit'&&deal_state=='1'"  value-format="yyyy-MM-dd HH:mm:ss" v-model="formDeal.deal_time" :editable="false" type="datetime" placeholder="请选择成交时间"></el-date-picker>
          </div>
          <el-input @input="dealPrice"  :disabled="type=='edit'&&deal_state=='1'" v-model="formDeal.deal_price" placeholder="请填写成交金额!" maxlength="11"></el-input>
        </div>
      </CreateForm>
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
        formDeal:{
          deal_price:"",
          deal_time:""
        },
        formData:this.setFormData(),
        rules:this.verification(),
        type:'',
        deal_state:''
      }
    },
    props:{
      vehicle:Object|Array
    },
    methods:{
        dealPrice(v){
          this.formDeal.deal_price=(v.match(/^\d*(\.?\d{0,2})/g)[0]) || null; //保留2位小数字
        },
        showFormData(data,type){
           if(type==="edit"){
             //console.log(data.row);
            let {id,client_name,client_tel,vehicle_id,deal_state,business,remark,deal_price,deal_time}=data.row;
            let d={
               id:id,
               client_name:client_name,
               client_tel:client_tel,
               vehicle_id:vehicle_id,
               deal_state:deal_state,
               business:business,
               remark:remark
            }
            this.deal_state=deal_state;
            this.type='edit';
            this.formData=d;
            this.formDeal={deal_price:deal_price,deal_time:deal_time};
           }else{
            this.formData={
              deal_price:"",
              deal_time:""
            };
            this.type='';
            this.deal_state="";
            this.formData=this.setFormData();
           }
        },
        onSubmit({data}){
          if(data.deal_state==='1'){
              if(!this.formDeal.deal_price||!this.formDeal.deal_time){
                this.$message.warning('成交信息不能为空！');
                return false;
              }
            data.deal_price=this.formDeal.deal_price;
            data.deal_time=this.formDeal.deal_time;
          }
          // 提交内容
          this.$emit('evnetPost',data);
        },
        setFormData(){
          //配置数据
          return {
            client_name:"",
            client_tel:"",
            vehicle_id:"",
            deal_state:"",
            business:"",
            remark:""
          }
        },
        verification(){
          //验证数据
          var v=[
            {field:"client_name",type:{required:"请输入客户名称！"},textCount:[2,10]},
            {field:"client_tel",type:{required:"请输入客户电话！",tel:"手机格式错误！"},textCount:[11]},
            {field:"vehicle_id",type:{required:"请选择车辆品牌！"}},
            {field:"deal_state",type:{required:"请选择成交状态！"}},
            {field:"business",type:{required:"请输入业务员姓名！"},textCount:[2,10]},
            {field:"remark",type:{required:"请输入5-200备注内容！"},textCount:[5,200]},
          ];
          v=this.$verification(v);
          return v;
        },
        formListItem(){
          let deal_state=[
            {text:"是",value:"1"},
            {text:"否",value:"2"}
          ];
          if(this.deal_state=='1'){
            deal_state=[{text:"是",value:"1"}]
          }
          // let vehicle=this.vehicle.map((item)=>{
          //   item.text=item.name+' '+item.text
          //   return item;
          // })
          //配置表单
          let form=[
            {prop:"client_name", maxlength:20,placeholder:"请输入客户姓名",label:'客户姓名：',type:'text'},
            {prop:"client_tel", maxlength:11,placeholder:"请输入客户电话",label:'客户电话：',type:'text'},
            {prop:"vehicle_id",placeholder:"选择车辆信息",label:'车辆信息：',type:'select',select:this.vehicle},
            {prop:"deal_state",placeholder:"选择成交状态",label:'成交信息：',type:'select',select:deal_state,isSlot:true,state:'1'},
            {prop:"business", maxlength:13,placeholder:"请输入业务员姓名",label:'业务员姓名：',type:'text'},
            {prop:"remark", maxlength:200,placeholder:"请输入客户信息备注",label:'客户信息备注：',type:'textarea',height:"110px"}
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
  .selectInfo{
    padding-top: 22px;
  }
</style>
