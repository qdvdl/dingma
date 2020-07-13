import Vue from 'vue';
import App from './App';
import router from './router';
//自定义图标

import '../static/icon/iconfont.css';
//状态管理
// import store from './store';
Vue.config.productionTip = false
//基础配置
import config from './qdvdl/config';
Vue.prototype.$base=config.base; //base地址
Vue.prototype.$authOff=config.authOff; //base地址
Vue.prototype.$http=config.base_url; //动态地址
Vue.prototype.$authorityMsg=config.authorityMsg; //权限操作提示

let store=config.store;//状态管理
let web=config.siteinfo;

Vue.prototype.$web=web;//网站信息
Vue.prototype.$user=config.userSID;//网站信息

//管理员操作验证
Vue.prototype.$handleVerify=config.handleVerify;
//全局接口配置
import Api from './qdvdl/api';
Vue.prototype.$api=Api;

// Vue.prototype.$http="http://vue.admin.com:8888/";
//请求数据
import {request} from './qdvdl/axios-qdvdl';//请求数据
Vue.prototype.$request = request;

/* eslint-disable no-new */
//自定义ul表单验证
import {verification} from './qdvdl/verification';//表单验证
Vue.prototype.$verification = verification;

//网站服务器域名(可作为图片显示处理)
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/reset.css';//增加重置样式文件
Vue.use(ElementUI);

//console.log(this.$store.getters.getData);

//判断是否登录
router.beforeEach((to, from, next) => {
  if(to.meta.title) {
    console.log(web)
    if(typeof web.title ==='undefined'){
      document.title =to.meta.title;
    }else{
       document.title = web.title+"_"+to.meta.title;
    }
  }
  let login=to.meta.type;
  if(login){
    if(store.getters.getData.login){
      next()
    }else{
      next('/login')
    }
  }else{
    if(store.getters.getData.login){
        next("/");
    }else{
      next();
    }
  }
})


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
