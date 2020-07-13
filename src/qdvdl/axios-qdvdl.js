// www.qdvdl.com

import axios from 'axios';
import qs from 'qs';

//基础库
import config from './config';

const apiUrl=config.site_url; //API地址
const userSID=config.userSID;//当前登录的

// console.log(config);
// console.log(config);
let auth={
  username:config.user_name,
  password:config.user_pass,
};


const setHeader={
	'Content-Type': 'application/x-www-form-urlencoded'
}

//设置配置
const instance=axios.create({
  auth: auth,
	baseURL:apiUrl,
	withCredentials: true, //跨域
	responseType:"json",
	headers:setHeader,
	transformRequest: [function (data) {
    //console.log(data)
		if(data){
			data=qs.stringify(data)
		}
		return data;
	}]
})


function get(url,params,success,error){
	instance.get(url,{
		params:params
	}).then((res)=>{
		if(res.status===200){
      if(res.data.code===40004){
        outLogin();
        error(res.data.msg)
      }else{
        success(res.data)
      }

		}else{
			error('请求发生错误,请检查接口异常!')
		}
	}).catch((err)=>{
		error('当前环境网络较差!');
	})
}

function post(url,params,success,error){
	instance.post(url,params).then((res)=>{
		if(res.status===200){
			if(res.data.code===40004){
         outLogin();
			  error(res.data.msg)
			}else{
			  success(res.data)
			}
		}else{
			error('请求发生错误,请检查接口异常!');
		}
	}).catch((err)=>{
	//	console.log(err)
		error('当前环境网络较差!');
	})
}
//文件分片上传
let arraxios=[];
function uploadFile(url,params,success,error){
    //console.log(params);
    let arrForm=params.arrForm;
    let info=params.info;
    info.hash= info.hash+"_tmp"+userSID+"_";
    //上传进度
    let arrProgress=[];
    for(var i=0;i<arrForm.length;i++){
      let formdata=arrForm[i];
      formdata.append('isMesh','binary');
      formdata.append('hash',info.hash);
      formdata.append('userSID',userSID);
      let c = {
        withCredentials: false, //跨域
        baseURL:apiUrl,
        auth: auth,
        //添加请求头
        headers: { "Content-Type": "multipart/form-data" },
        //添加上传进度监听事件
        onUploadProgress: e => {
          var completeProgress = ((e.loaded / e.total * 100) | 0);
          if(completeProgress==100){
            arrProgress.push(completeProgress);
          }
          e.hash=info.hash;
          //上传文件数量监听进度
          params.uploading(e,arrProgress.length,info.chunks);
        }
      };
      arraxios.push(axios.post(url, formdata, c));
    }

    axios.all(arraxios).then(axios.spread((resarr0)=>{
       console.log(resarr0);
      if(resarr0.data.code===40004){
         //outLogin();
         error(res.data.msg);
         return false;
      }
       //全部上传结束
       if(typeof params.uploaden==='function'){
          params.uploadend();
       }

        info.isMesh="mesh";
        info.userSID=userSID;
        instance.post(url,info).then((res)=>{
          if(res.status===200){
           if(res.data.code===40004){
             //outLogin();
             error(res.data.msg);
           }else{
             success(res.data)
           }
          }else{
            error('请求发生错误,请检查接口异常!');
          }
        }).catch((err)=>{
          error('当前环境网络较差!');
        })
    }))

}

//设置信息
function outLogin(){
  //强制推出
  config.store.dispatch('setlogins',{
    userinfo:"",
    login:false
  });
  if(config.login){
     location.href=config.base;
  }
}


//对外接口
export function request({type, url, data,success,error}){
    // let userSID=sessionStorage.getItem('userSID');
    if(type!="file"&&userSID){
      data=Object.assign({},data,{userSID:userSID });
    }
    if(type === 'get'){
        return get(url,data,success,error);
    }else if(type === 'post'){
        return post(url,data,success,error);
    }else if(type === 'file'){
      return uploadFile(url,data,success,error);
    }
}
