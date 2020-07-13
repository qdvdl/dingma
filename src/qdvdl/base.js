//基础类

let toggleBody =(isPin)=>{
  //toggleBody(1)  //在跳出弹窗的时候
  // toggleBody(0)  //弹窗消失的时候
  if(isPin){
    document.body.style.height = '100vh'
    document.body.style['overflow-y'] = 'hidden'
  }
  else{
    document.body.style.height = 'unset'
    document.body.style['overflow-y'] = 'auto'
  }
}

let http=()=>{
  return "dsfsadfsdfsd";
}



export default{
    toggleBody,http
}
