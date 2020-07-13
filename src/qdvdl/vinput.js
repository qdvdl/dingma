//表单验证，强制输入
export function vinput(e,type){
    let value="";
    if(type==="number"){
      value= e.target.value.replace(/[^\d]/g, ''); //只能是数字
    }else if(type==="number_str"){
      value= e.target.value.replace(/[\W]/g, '');  //只能是字母数字
    }else if(type==="float"){
      value = (e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null  //金额保留2位
    }else if(type==="integer"){ //只能是正整数
      value=e.target.value;
      if(value.length==1){
        value=e.target.value.replace(/[^1-9]/g,'');
      }else{
        value=e.target.value.replace(/\D/g,'')
      }
    }else if(type==="chinese"){//中文
      value=e.target.value.replace(/[^\u4E00-\u9FA5]/g,'');
    }else if(type==="floats"){
      value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null //保留1位小数字
    }
    return value;
}
