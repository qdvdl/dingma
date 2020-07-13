//自定义验证规则
function getRules(){
  //输入中文
  var validateName = (rule, value, callback) => {
      let regExp =/[^\u4E00-\u9FA5]/g;
      if(regExp.test(value)){
        callback(new Error(rule.message));
      }else{
        callback();
      }
  };
  //输入英文
  var validateAZ=(rule, value, callback)=>{
    let regExp =/^[a-zA-Z]+$/;
    if(!regExp.test(value)){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };
  //手机号验证
  var validateTel=(rule, value, callback)=>{

    let regExp =/^1[3456789]\d{9}$/;
    if(!regExp.test(value)){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };
  //座机号码
  var validatePhone=(rule, value, callback)=>{
    var phone = /^0\d{2,3}-?\d{7,8}$/,phone1=/^4\d{2,3}-?\d{7,8}$/,phone2=/^8\d{2,3}-?\d{7,8}$/;
    var offphone=phone.test(value)|| phone1.test(value)|| phone2.test(value);
    if(value!==''&&!offphone){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };
  //手机号或者座机号
  var validatePhoneTel=(rule, value, callback)=>{

    var mobile = /^1[3456789]\d{9}$/,phone = /^0\d{2,3}-?\d{7,8}$/,phone1=/^4\d{2,3}-?\d{7,8}$/,phone2=/^8\d{2,3}-?\d{7,8}$/;
    var offphone=mobile.test(value)|| phone.test(value)|| phone1.test(value)|| phone2.test(value);
    if(value!==''&&!offphone){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };
  //必须是数字
  var validateNumber=(rule, value, callback)=>{
    let regExp =/[^\d]/g;

    if(regExp.test(value)){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };

  //验证金额格式(无长度限制)
  var validateAmount=(rule, value, callback)=>{
    let regExp =/^\d+(\.\d{1,2})?$/;
    if(!regExp.test(value)){
      callback(new Error(rule.message));
    }else{
      callback();
    }
  };
  //金额类型有长度限制
  var validatePrice=(rule, value, callback)=>{
   // console.log(rule)
    let regExp =/[^\d]/g;
    let jine =/^\d+(\.\d{1,2})?$/;
    if(value!=""){

    if(!jine.test(value)){
      callback(new Error(rule.message));
    }else{
      let arr=value.split('.');
      console.log(arr[0].length)
      //callback(new Error('小数点前面最大输入9位'));
       if(arr[0].length<=9){
          callback();
       }else{
         callback(new Error(rule.message));
       }
    }
    }else{
       callback();
    }
  };


  return {
    length:{ min:0, max:100, message: '长度在2到6个字符', trigger: 'blur' },//长度限制
    required:{ required: true, message: '', trigger: 'blur' },    //必填项
    chinese:{ validator: validateName, trigger: 'blur',message: ''}, //必须中文
    strAZaz:{ validator: validateAZ, trigger: 'blur',message: ''}, //必须是英文字母|不区分大小写
    tel:{ validator: validateTel, trigger: 'blur' ,message: ''}, //手机号吗
    phone:{ validator: validatePhone, trigger: 'blur' ,message: ''}, //座机号码
    phoneTel:{ validator: validatePhoneTel, trigger: 'blur' ,message: ''}, //座机号码
    number:{ validator: validateNumber, trigger: 'blur' ,message: ''}, //必须是数字
    custom:{validator:null, trigger: 'blur' ,message: ''}, //自定义
    amount:{validator: validateAmount, trigger: 'blur',message: ''} ,//验证是不是金额
    price:{validator: validatePrice, trigger: 'blur',message: ''} //验证是不是金额(有长度限制)
  };
}

function setData(validate){
  let o={};//验证规则对象
  validate.map((item,index)=>{
      let r=getRules();//获取验证规则
      o[item.field]=[];
      if(item.type){
        for(let key in item.type){
          let d=r[key];
          d.message=item.type[key];
          o[item.field].push(d);
        }
      }

      //判断是否自定义方法
      let validator=item.validator;
      if(typeof validator=="function"){
        r.custom.validator=validator;
        if(item.trigger==="change"){
          r.custom.trigger="change";
        }
        o[item.field].push(r.custom);
      }

      //判断是否有限制字数文字提示
     let textCount=item.textCount;
     let lengthText=item.lengthText;
     if(textCount){
        if(textCount.length==1){
            r.length.min=textCount[0];
        }
        if(textCount.length==2){
          r.length.min=textCount[0];
          r.length.max=textCount[1];
        }

      if(lengthText){
        r.length.message=lengthText;
      }else{
        if(r.length.min){
          lengthText="至少输入"+r.length.min+"个字符"
        }
        if(r.length.max){
          if(lengthText){
            lengthText+=",最大输入"+r.length.max+"个字符";
          }else{
            lengthText="最大输入"+r.length.max+"个字符";
          }
        }
        r.length.message=lengthText;
      }
       o[item.field].push(r.length);
    }
    //console.log(o[item.field])
  })
  return o;
}
export function verification(validate){
   return setData(validate)
};
