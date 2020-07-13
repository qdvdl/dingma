<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="评价昵称:">
              <el-input v-model="extra.client_name" placeholder="客户名称"></el-input>
            </el-form-item>
            <el-form-item label="评价手机号:">
              <el-input v-model="extra.client_tel" placeholder="客户电话"></el-input>
            </el-form-item>
            <el-form-item label="评价时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.submit_time" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>

      <div class="user main">
      <TbaleList minHeight="500" :unfold="true" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
      <PageBott ref="pageBott" :pageMeter="pageMeter" @currChange="currChange"></PageBott>
      <!-- 添加编辑 -->
       <el-drawer
         size='50%'
         :wrapperClosable='false'
         :show-close="false"
         :visible.sync="visible"
         direction="rtl"
         custom-class="drawer-box" >
         <div slot="title" class="drawer-title"><el-page-header @back="handleClose" :content="title"></el-page-header></div>
         <div class="drawerContent">
           <AddBrand :vehicle="vehicle" ref="addBrand" @evnetPost="submit"></AddBrand>
         </div>
       </el-drawer>
       <!-- 详情-->
        <el-drawer
          size='60%'
          :wrapperClosable='true'
          :show-close="false"
          :visible.sync="isSeeShow"
          direction="rtl"
          custom-class="drawer-box" >
          <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="详情"></el-page-header></div>
          <div class="drawerContent">
            <ClientInfo :data="info"></ClientInfo>
          </div>
        </el-drawer>

    </div>
  </div>
</template>

<script>
  import TbaleList from '@/components/table';//表格展示数据
  import PageBott from '@/components/pageBott';//分页组件
  import AddBrand from "./add";  //添加数据
  import ClientInfo from "./see";  //查看详情
  export default {
    components:{TbaleList,PageBott,AddBrand,ClientInfo},
    data(){
      return{
        dealc_sum:0,
        dealv_sum:0,
        info:{},//详情
        isSeeShow:false,//详情展示
        admin_id:"",
        // 导出导出
        action:this.$api.importOrder,//导入文件接口
        templateUrl:this.$api.downTempOrder ,//下载文件模版地址
        exportUrl:this.$api.exportOrder   ,//导出数据地址
        isImport:this.$handleVerify('importOrder'),   //是否显示导入
        isExport:this.$handleVerify('exportOrder'),    //是否显示导出
        isDown:this.$handleVerify('downTempOrder'),      //是否显示下载
        // 其他字段
          title:"添加品牌",
          visible:false, //添加||编辑
          type:"",
          //分页配置
          pageMeter:{
            limit:10,
            page:1,
            total:0
          },
          vehicle:[],
          tableData:[],
          userdata:{},
          column:this.columns(),
          extra:{
             client_name:"",
             client_tel:"",
             deal_time:"",
             submit_time:"",
             deal_state:"",
             brand_id:"",
             vehicle:""
          },
          operation:{
            add:"addClient",      //添加客户
            edit:"editClient",   //编辑客户
            deal:"turClient", //成交客户
            see:"seeClient", //查看详情
            oteam:"oteamClient" //分配管理员
          },
          //成交信息
          titles:'成交信息',
          formVisible:false,
          formDeal:{
            id:"",
            client_name:"",
            deal_price:"",
            deal_time:""
          },
          //管理员
          admin:[]
      }
    },
    mounted(){
      this.loadTable();
    },
    methods:{
      successLoad(){
        // 导入成功
        this.loadTable(true);
      },
      //成交信息
      dealPrice(v){
        this.formDeal.deal_price=(v.match(/^\d*(\.?\d{0,2})/g)[0]) || null; //保留2位小数字
      },
       //刷新数据
      refreshData(){
        this.loadTable(true);
      },
      //关闭弹窗
      handleClose(t){
        if(t=='load'){
          this.loadTable(this.type=='add',this.type=='del');
        }
        this.formVisible=false;
        this.visible=false;
        this.isSeeShow=false;
      },
      //搜索数据
      select_chg(v){
        this.loadTable(true);
      },
      search_btn(off){
        if(!off){
          //清空搜索数据
          this.extra={
            client_name:"",
            client_tel:"",
            deal_time:"",
            submit_time:"",
            deal_state:"",
            brand_id:"",
            vehicle:""
          }
        }
        this.loadTable(true);
      },
      //触发操作按钮
      eventOperation({data,type}){
        //验证是否有操作权限
        if(!this.$handleVerify(this.operation[type])){
          this.$message({
            showClose: true,
            message:this.$authorityMsg,
            type: 'error'
          });
          return false;
        }
        //如果是添加
        this.type=type;
        if(type=='edit'){
          this.title="回复评价";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addBrand.showFormData(data,type);
          },30)
        }else if(type=='see'){
          // console.log(data.row);
          this.info=data.row;
          this.isSeeShow=true;//详情展示
        }
      },
      //保存数据
      submit(data){
        //添加数据
        if(this.type==='edit'){
          this.postData(data,this.$api.replyComment);
        }

      },
      //提交数据后台
      postData(data,url){
        const loading = this.$loading({
          lock: true,
          text: '操作中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$request({
         type:"post",
         data:data,
         url:url,
         success:(res)=>{
            loading.close();
            if(res.code==200){
               this.$message.success(res.msg);
               this.handleClose('load');
            }else{
               this.$message.error(res.msg);
            }
         },error:(err)=>{
           this.$message.error(err);
         }
        });
      },
      // 表格数据相关
      columns(){
        let c=[
          //配置列表显示数据
          {prop:"u_img",name:"头像",minWidth:170,isShowType:"img",isbase:true},
          {prop:"nickname",name:"评价昵称",minWidth:170,isShowType:"default"},
          {prop:"u_tel",name:"评价手机号",minWidth:170,isShowType:"default"},
          {prop:"b_name",name:"车辆品牌",minWidth:170,isShowType:"default"},
          {prop:"v_version",name:"车辆型号",minWidth:170,isShowType:"default"},
          {prop:"star",name:"评价星级",minWidth:170,isShowType:"default"},
          {prop:"datetime",name:"评价时间",minWidth:170,isShowType:"default"},
          {prop:"text",name:"评价内容",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"reply",name:"回复内容",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:[
            {size:"mini",type:"primary",plain:true,name:"详情",field:'edit'}
            // {size:"mini",type:"info",plain:true,name:"详情",field:'see'}
            // {size:"mini",type:"danger",plain:true,name:"成交",field:'deal',state:"1",fieldName:"deal_state"},
            // {size:"mini",type:"danger",plain:true,name:"操作员分组",field:'oteam'}
          ]}
        ]
        return c;
      },

      currChange({limit,page}){
        this.pageMeter.limit=limit;
        this.pageMeter.page=page;
        //分页开始
        this.loadTable();
      },
      loadTable(isReset,isResetCount){
        //isReset是否重置从第一页开始
        //isResetCounts 重新计算分页
        if(isReset){
          this.pageMeter.page=1;
        }

        if(isResetCount){
          if(this.tableData.length<=1&&this.pageMeter.page>1){
            this.pageMeter.page=this.pageMeter.page-1;
          }
        }

        let data=Object.assign({},this.extra,{
          limit:this.pageMeter.limit,
          page:this.pageMeter.page
        });

        this.getData(data);
      },
      getData(data){
       const loading = this.$loading({
         lock: true,
         text: '加载中',
         spinner: 'el-icon-loading',
         background: 'rgba(0, 0, 0, 0.7)'
       });
       this.$request({
        type:"get",
        data:data,
        url:this.$api.commentList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
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
   @import url("../../../assets/css/main.css");
   .footerText{
     height:32px;
     line-height:32px;
     text-align: left;
     margin-bottom: 10px;
   }
   .footerText strong{
     padding-left: 15px;
     margin-right: 5px;
     font-weight: 500;
   }
   .footerText span{
     margin-right: 40px;
     font-size: 18px;
     font-weight: 500;
     color: red;
   }
</style>
