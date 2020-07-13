import Vue from 'vue'
import Router from 'vue-router'
//首页
import Home from '@/page/index';
//登录
import Login from '@/page/login';
//基础路由(必须)
import Admin from '@/page/admin/operation/admin';//管理员
import Role from '@/page/admin/operation/role';//角色
import SetAdmin from '@/page/admin/operation/setAdmin';//设置
import Auth from '@/page/admin/operation/auth';//权限栏目
import Log from '@/page/admin/operation/log';//操作日志
//项目开发
/* 基础设置 */
import SetBasics from '@/page/admin/basics/setBasics';//设置
import SetImgtext from '@/page/admin/basics/imgtext';//图文设置
import SetReward from '@/page/admin/basics/reward';//推荐奖励设置
 /* 用户管理 */
import User from '@/page/admin/user';//用户管理
 /* 品牌列表 */
import Brand from '@/page/admin/brand';//品牌管理
/* 车辆管理 */
import Vehicle from '@/page/admin/vehicle';//车辆管理
/* 订单管理 */
import Order from '@/page/admin/order';//订单管理
/* 客户管理 */
import Client from '@/page/admin/client';//客户管理
/* 评价管理 */
import Comment from '@/page/admin/comment';//评价管理
/* 轮播图 */
import Banner from '@/page/admin/banner';//轮播图设置

Vue.use(Router);

export default new Router({
  mode: "history",
  base:"/admin",
  routes: [
    //基础路由(必须)
    {path: '/',name: 'home',component: Home,meta: {title: "首页",type: "login", keepAlive:false}}, //keepAlive：开启缓存俩判断
    {path: '/admin',name: 'admin',component: Admin,meta: {title: "系统管理-管理员",type: "login", keepAlive:false}},
    {path: '/role',name: 'role',component: Role,meta: {title: "系统管理-角色管理",type: "login", keepAlive:false}},
    {path: '/setAdmin',name: 'setAdmin',component: SetAdmin,meta: {title: "系统管理-系统设置",type: "login", keepAlive:false}},
    {path: '/auth',name: 'auth',component: Auth,meta: {title: "系统管理-栏目管理",type: "login", keepAlive:false}},
    {path: '/log',name: 'log',component: Log,meta: {title: "系统管理-操作日志",type: "login", keepAlive:false}},
    //登录
    {path: '/login',name: 'login',component: Login,meta: {title: "登录页面",type:"", keepAlive:false}},
    //项目路由(开发)
    /* 基础设置*/
    {path: '/setBasics',name:'setBasics',component: SetBasics,meta: {title: "基础设置-设置",type:"login", keepAlive:false}},
    {path: '/imgtext',name:'imgtext',component: SetImgtext,meta: {title: "基础设置-图文设置",type:"login", keepAlive:false}},
    {path: '/reward',name:'reward',component: SetReward,meta: {title: "基础设置-推荐奖励设置",type:"login", keepAlive:false}},
    /* 轮播图 */
    {path: '/banner',name:'banner',component: Banner,meta: {title: "基础设置-轮播图",type:"login", keepAlive:false}},
    /* 用户管理*/
    {path: '/userList',name:'userList',component: User,meta: {title: "用户管理-用户列表",type:"login", keepAlive:false}},
    /* 品牌列表 */
    {path: '/brandList',name:'brandList',component: Brand,meta: {title: "车辆品牌-品牌列表",type:"login", keepAlive:false}},
    /* 车辆管理 */
    {path: '/vdlautoList',name:'vdlautoList',component: Vehicle,meta: {title: "车辆管理-车辆列表",type:"login", keepAlive:false}},
    /* 订单管理 */
    {path: '/orderList',name:'orderList',component: Order,meta: {title: "订单管理-订单列表",type:"login", keepAlive:false}},
    /* 客户管理 */
    {path: '/clientList',name:'clientList',component: Client,meta: {title: "客户管理-客户列表",type:"login", keepAlive:false}},
    /* 评价管理 */
    {path: '/commentList',name:'commentList',component: Comment,meta: {title: "客户管理-客户列表",type:"login", keepAlive:false}},

  ]
})
