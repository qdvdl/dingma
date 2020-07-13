import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//定义全局访问状态
let state={
  data:{
    login:false,
    active:"0",
    Breadcrumb:[],
    userInfo:{},
    operation:[],
    menu:[],
    siteinfo:{}
  }
}


//判断数据是否在
if(sessionStorage.getItem("state-vuex")){
  state=JSON.parse(sessionStorage.getItem("state-vuex"));
}
//时时监听状态变化||获取值：this.$store.getters.getlist
const getters={
  getData(state){
    return state.data;
  },
  getKeyData(key){
    return state.data[key];
  }
}
//改变值
const mutations = {
    setData(state,data){
      state.data=data;
      setLocalStorage(state);
    },
    setBreadcrumb(state,data){
      state.data.Breadcrumb=data.Breadcrumb;
      state.data.active=data.active;
      setLocalStorage(state);
    },
    setlogin(state,data){
      state.data.login=data.login;
      state.data.userInfo=data.userinfo;
      setLocalStorage(state);
    },
    setUserinfo(state,data){
      state.data.userInfo[data.key]=data.data;
      setLocalStorage(state);
    },
    setDataKey(state,data){
      state.data[data.key]=data.data;
      setLocalStorage(state);
    }
};
//异步改变||改变值： this.$store.dispatch('setList',this.list);
const actions = {
    setDatas(context,data){
      //处理所有数据
      context.commit('setData',data)
    },
    setBreadcrumbs(context,data){
      //处理面包屑
      context.commit('setBreadcrumb',data)
    },
    setlogins(context,data){
      //更新登录状态
      context.commit('setlogin',data)
    },
    setUserinfos(context,data){
      //更新用户信息字段
      context.commit('setUserinfo',data)
    },
    setDataKeys(context,data){
      //设置指定key
      context.commit('setDataKey',data)
    },

};
//记录数据||防止刷新后数据丢失
function setLocalStorage(state){
  window.sessionStorage.setItem("state-vuex",JSON.stringify(state));
}

const store=new Vuex.Store({
 state,
 getters,
 mutations,
 actions
});

export default store;
