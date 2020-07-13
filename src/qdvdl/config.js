import store from '../store';

let {userInfo,operation,siteinfo,login}=store.getters.getData;
// console.log(operation);
let Verification=(name)=>{

  // console.log(name);
  //验证操作按钮
  let off=operation.some((item)=>{
     return item.name===name;
  })
  return off;
}


export default{
    siteinfo:siteinfo,
    authorityMsg:"暂无操作权限，请联系管理员！",//操作权限提示
    // 本地测试
    // base:"/", //本地
    // base_url:"http://vue.dingma.com:8888/", //本地
    // site_url:"http://vue.dingma.com:8888/", //本地
    // 网络启动
    base:"/admin",
    base_url:"http://www.tfxyc.com/", //网络
    site_url:"http://www.tfxyc.com/", //网络
    userSID:userInfo.id,
    user_name:"webvdl",
    user_pass:"webvdl.@1818",
    handleVerify:Verification,
    store:store,
    authOff:'auth', //是否开启开发模式下启动栏目操作正式上线版本可关闭
    login:login

}
