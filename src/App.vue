<template>
  <div id="app">
    <el-container v-if="login">
      <el-aside  v-bind:style="{width:collapse ? 64+'px' : 230+'px'}">
        <div class="logo">
         <span v-show="!collapse">{{websiteName}}</span>
        </div>
        <SideMenu :collapse="collapse" @eventTo="breadcrumb" :menu="menu" />
      </el-aside>
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="20">
              <div class="grid-content spread">

                <i class="el-icon-s-fold" title="收缩" @click="eventColl" v-show="!collapse"></i>
                <i class="el-icon-s-unfold" title="展开" @click="eventColl" v-show="collapse"></i>
                <el-tooltip class="item" effect="dark" content="刷新数据" placement="bottom-start">
                  <i class="app-el-icon-refresh el-icon-refresh" title="刷新" @click="refreshData"></i>
               </el-tooltip>

              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content spreads">
                <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                    <div class="user_header">
                        {{userInfo.name}}
                        <el-image :src="http+userInfo.headimg">
                          <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                          </div>
                        </el-image>
                    </div>
                  </span>
                  <el-dropdown-menu slot="dropdown" >
                    <!-- <el-dropdown-item command="msg">我的消息</el-dropdown-item> -->
                    <el-dropdown-item command="img">修改头像</el-dropdown-item>
                    <el-dropdown-item command="set">修改密码</el-dropdown-item>
                    <el-dropdown-item divided  command="out">退出</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
            <el-breadcrumb separator="/" >
              <el-breadcrumb-item v-if="breadcrumbItem.length>1" :to="{path:'/'}">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-else></el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,index) in breadcrumbItem" :key="index">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
                <router-view ref="myRouter" @viewon="eventPublic" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view ref="myRouter" @viewon="eventPublic" v-if="!$route.meta.keepAlive"> </router-view>
            <SetUserInfo :visible="visible" :vtype="type" @visibleClose="visibleClose" />
        </el-main>
        <el-footer style="height: 40px;line-height: 40px;">{{record}}</el-footer>
      </el-container>
    </el-container>
    <router-view v-if="!login"> </router-view>

  </div>
</template>

<script>
import SideMenu from '@/components/sideMenu';
import SetUserInfo from '@/page/component/app/setUserInfo';
export default {
  components:{SideMenu,SetUserInfo},
  name: 'App',
  data(){
    return{
      collapse:false,
      websiteName:"",
      record:"",
     // breadcrumbItem:[],
      login:this.$store.getters.getData.login,
      userInfo:this.$store.getters.getData.userInfo,
      menu:[],
      visible:false,
      type:"",
      http:this.$http
    }
  },
  watch:{
    $route(to,from){
      //console.log(to.name)
      if(to.name=="home"){
        this.menu=this.getData();
        //设置面包屑
        this.$store.dispatch('setBreadcrumbs',{
          Breadcrumb:[],
          active:"0"
        });

      }
    }
  },
  created(){
    this.getData();
  },
  computed:{
    breadcrumbItem(){
      return this.$store.getters.getData.Breadcrumb;
    }
  },
  methods:{
    refreshData(){
      //刷新页面数据
      if(this.$refs.myRouter.refreshData){
        this.$refs.myRouter.refreshData();
      }
    },
    eventPublic({siteinfo}){
      //共方法来替换网站信息||也可以用作其他操作
      //console.log('我执行了',d);
      this.websiteName=siteinfo.name; //网站名称
      this.record=siteinfo.record; //网站备案信息

      //设置面包屑
      this.$store.dispatch('setDataKeys',{
        key:'siteinfo',
        data:siteinfo
      });


    },
    //设置信息
    outLogin(){
      //退出登录
      this.$store.dispatch('setlogins',{
        userinfo:"",
        login:false
      });
      location.href=this.$base;
    },
    handleCommand(command){
      if(command==="out"){
        this.outLogin()
      }else if(command==='set'){
        this.visible=true
        this.type="set";
      }else if(command==='img'){
        this.visible=true;
        this.type="img";
      }
    },
    visibleClose(d){
      //修改成功后进行操作
      this.visible=false;
      if(d==='ok'){
        this.outLogin()
      }
    },
    eventColl(){
     this.collapse=!this.collapse
    },
    breadcrumb({index,meta}){
      //设置面包屑
      this.$store.dispatch('setBreadcrumbs',{
        Breadcrumb:meta.title.split('-'),
        active:index
      });
    },
    getData(){
      // let store=this.$store.getters.getData;

      if(!this.userInfo.id) return false;
      // this.menu=store.menu;

      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$request({
        type:"get",
        url:"index.php/api/authList",
        data:{userSID:this.userInfo.id},
        success:(res)=>{
          loading.close();
          if(res.code==200){
            this.menu=res.data.auth_list;
            this.websiteName=res.data.siteinfo.name; //网站名称
            this.record=res.data.siteinfo.record; //网站备案信息

            this.$store.dispatch('setDataKeys',{
              key:'operation',
              data:res.data.operation
            });
          }else{
            this.$message({
              showClose: true,
              message: '数据加载失败',
              type: 'error'
            });
          }

        },error:(err)=>{
          this.$message.error(err);
        }
      });
    }

  }
}
</script>

<style>
@import url("assets/css/app.css");
.app-el-icon-refresh{
  margin-left: 20px;
}
.user_header .el-image{
  overflow: inherit;
}
.drawer-box{
  padding-top: 15px;
  padding-right: 15px;
  padding-left: 15px;
}
.record-text{
  text-align: center;
  position:fixed;
  z-index: 9;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 40px;
  line-height: 40px;
  color: #fff7f7;
  font-size: 15px;
}
</style>
