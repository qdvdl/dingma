<template>
  <div>
      <div class="search-box">
        <el-form :inline="true" :model="extra" class="demo-form-inline">
            <el-form-item label="客户姓名:">
              <el-input v-model="extra.client_name" placeholder="客户名称"></el-input>
            </el-form-item>
            <el-form-item label="客户电话:">
              <el-input v-model="extra.client_tel" placeholder="客户电话"></el-input>
            </el-form-item>
            <el-form-item label="成交时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.deal_time" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <div></div>
            <el-form-item label="提交时间:">
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable='false' v-model="extra.submit_time" type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="search_btn(true)">查询</el-button>
              <el-button type="primary" size="small" @click="search_btn(false)">重置</el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="footerText">
        <strong>成交客户数量:</strong><span>{{dealc_sum}} 人</span>
        <strong>未成交客户数量:</strong><span>{{dealv_sum}} 人</span>
      </div>
      <ImportExport :isImport="isImport" :isExport="isExport" :isDown="isDown" @successLoad='successLoad' :extra="extra" :exportUrl="exportUrl" :templateUrl="templateUrl" :action="action">
       <div slot="btnheader">
         <el-button type="primary" size="small" round  @click="eventOperation({data:{},type:'add'})">添加客户<i class="el-icon-plus el-icon--right"></i></el-button>
       </div>
      </ImportExport>
      <div class="user main">
      <TbaleList minHeight="430" :unfold="true" :tableData="tableData" @tabBtnOperation="eventOperation" :column="column"></TbaleList>
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
           <!-- <UserDetails ref="userdetails" :data="userdata" /> -->
           <AddBrand :vehicle="vehicle" ref="addBrand" @evnetPost="submit"></AddBrand>
         </div>
       </el-drawer>
       <!-- 成交||分配管理员 -->
       <el-dialog :title="titles" :close-on-click-modal='false' :visible.sync="formVisible">
           <div v-if="type==='deal'">
             <div style="margin-bottom: 22px;">
               <el-date-picker style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" v-model="formDeal.deal_time" :editable="false" type="datetime" placeholder="请选择成交时间"></el-date-picker>
             </div>
             <el-input @input="dealPrice" v-model="formDeal.deal_price" placeholder="请填写成交金额!" maxlength="11"></el-input>
           </div>
          <div v-if="type==='oteam'">
             <el-select v-model="admin_id" style="width: 100%;" placeholder="请选择">
                <el-option
                  v-for="item in admin"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
          </div>
          <div slot="footer" style="text-align: center;">
            <el-button @click="formVisible= false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </div>
        </el-dialog>

        <el-drawer
          size='60%'
          :wrapperClosable='true'
          :show-close="false"
          :visible.sync="isSeeShow"
          direction="rtl"
          custom-class="drawer-box" >
          <div slot="title" class="drawer-title"><el-page-header @back="handleClose" content="客户信息详情"></el-page-header></div>
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
  import ImportExport from '@/components/importExport';//导入导出
  import ClientInfo from "./see";  //查看详情
  export default {
    components:{TbaleList,PageBott,AddBrand,ImportExport,ClientInfo},
    data(){
      return{
        dealc_sum:0,
        dealv_sum:0,
        info:{},//详情
        isSeeShow:false,//详情展示
        admin_id:"",
        // 导出导出
        action:this.$api.importClient,//导入文件接口
        templateUrl:this.$api.downTempClient ,//下载文件模版地址
        exportUrl:this.$api.exportClient   ,//导出数据地址
        isImport:this.$handleVerify('importClient'),   //是否显示导入
        isExport:this.$handleVerify('exportClient'),    //是否显示导出
        isDown:this.$handleVerify('downTempClient'),      //是否显示下载
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
             submit_time:""
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
      search_btn(off){
        if(!off){
          //清空搜索数据
          this.extra={
            client_name:"",
            client_tel:"",
            deal_time:"",
            submit_time:""
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
        if(type=='add'){
          this.title="添加客户";
          this.visible=true;
          setTimeout(()=>{
           this.$refs.addBrand.showFormData();
          },30)
        }else if(type=='edit'){
          this.title="编辑客户";
          this.visible=true;
          setTimeout(()=>{
            this.$refs.addBrand.showFormData(data,type);
          },30)
        }else if(type=='deal'){
          //成交信息
          this.formDeal.id=data.row.id;
          this.formDeal.client_name=data.row.client_name;
          this.formDeal.deal_price="";
          this.formDeal.deal_time="";
          this.formVisible=true;
          this.titles='成交信息';
        }else if(type=='oteam'){
           let {id,client_name,admin_id}=data.row;

           this.admin_id=admin_id;
           this.formDeal.id=id;
           this.formDeal.client_name=client_name;
           this.titles='分配管理员';
           this.formVisible=true;
        }else if(type=='see'){
          // console.log(data.row);

          this.info=data.row;
          this.isSeeShow=true;//详情展示
        }
      },
      //保存数据
      submit(data){
        //添加数据
        if(this.type==='add'){
          this.postData(data,this.$api.addClient);
        }
         //编辑数据
        if(this.type==='edit'){
          this.postData(data,this.$api.editClient);
        }
        //成交

        if(this.type==='deal'){
          if(!this.formDeal.deal_price||!this.formDeal.deal_time){
            this.$message.warning('成交信息不能为空！');
            return false;
          }
         // console.log(this.formDeal);
          this.postData(this.formDeal,this.$api.turClient);
        }

        if(this.type==='oteam'){
           this.formDeal.admin_id=this.admin_id;
          if(!this.formDeal.admin_id){
            this.$message.warning('请选择管理员！');
            return false;
          }
          this.postData(this.formDeal,this.$api.oteamClient);
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
        console.log()
        let operation=[];
        if(this.$user=='1'){
          operation=[
            {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
            {size:"mini",type:"info",plain:true,name:"详情",field:'see'},
            {size:"mini",type:"danger",plain:true,name:"成交",field:'deal',state:"1",fieldName:"deal_state"},
            {size:"mini",type:"danger",plain:true,name:"操作员分组",field:'oteam'}
          ];
        }else{
          operation=[
            {size:"mini",type:"primary",plain:true,name:"编辑",field:'edit'},
            {size:"mini",type:"info",plain:true,name:"详情",field:'see'},
            {size:"mini",type:"danger",plain:true,name:"成交",field:'deal',state:"1",fieldName:"deal_state"}
          ];
        }
       
        let c=[
          //配置列表显示数据
          {prop:"client_name",name:"客户姓名",minWidth:170,isShowType:"default"},
          {prop:"client_tel",name:"客户电话",minWidth:170,isShowType:"default"},
          {prop:"b_name",name:"车辆品牌",minWidth:170,isShowType:"default"},
          {prop:"v_version",name:"车辆型号",minWidth:170,isShowType:"default"},
          {prop:"state_text",name:"是否成交",minWidth:170,isShowType:"default"},
          {prop:"deal_price",name:"成交价格(元)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"deal_time",name:"成交时间",minWidth:170,isShowType:"default"},
          {prop:"submit_time",name:"提交时间",minWidth:170,isShowType:"default"},
          {prop:"budget",name:"预算(万)",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"a_name",name:"所属操作员",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"business",name:"所属业务员",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {prop:"remark",name:"备注",minWidth:170,isShowType:"default",isUnfold:true,isShow:true},
          {name:"操作",minWidth:200,align:'center',fixed:"right",isShowType:"btn",btnArr:operation}
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
        url:this.$api.clientList,
        success:(res)=>{
           loading.close();
           if(res.code==200){
              this.pageMeter.total=res.data.count;
              this.tableData=res.data.data;
             // this.vehicle=res.data.vehicle;


              this.vehicle=res.data.vehicle.map((item)=>{
                item.text=item.name+' '+item.text
                return item;
              });

              this.admin=res.data.admin;
              this.dealc_sum=res.data.dealc_sum;
              this.dealv_sum=res.data.dealv_sum;
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
