export default{
    // 管理员基本必须接口(请勿删除)
    login:"api/login",  //登录接口
    code:"main/getCode",  //验证码接口
    addAdmin:"api/addAdmin", //添加管理员
    editAdmin:"api/editAdmin", //编辑管理员
    delAdmin:"api/delAdmin", //删除管理员
    admin:"api/admin", //管理员列表
    role:"api/role"    ,//角色列表
    addRole:"api/addRole" ,//添加角色
    editRole:"api/editRole" ,//编辑角色
    delRole:"api/delRole" ,//删除角色
    getLog:"api/getLog",    //获取首页信息接口
    upload:"main/upload_file" ,//统一上传接口
    log:"api/log",     //后台操作日志接口
    dellog:"api/dellog" ,//删除操作日志
    setAdmin:"api/setAdmin", //网站基本信息
    //开发接口(自定义开发接口)
    reward:"apiAll/reward", //奖励列表
    addReward:"apiAll/addReward", //设置奖励|添加|编辑|删除
    imgtext:"apiAll/imgtext",  //获取基本信息
    setBasics:"apiAll/setBasics",  //获取基本信息
    banner:"apiAll/banner",  //获取基本信息
    addBanner:"apiAll/addBanner",  //添加
    editBanner:"apiAll/editBanner",  //编辑
    delBanner:"apiAll/delBanner",  //删除
    // 用户信息
    userList:"apiAll/userList",    //用户列表
    userDetails:"apiAll/userDetails", //用户详情
    receiveGifts:"apiAll/receiveGifts", //领取礼品
    // 品牌信息
    brandList:"apiAll/brandList",//品牌数据列表
    addBrand:"apiAll/addBrand", //添加品牌
    editBrand:"apiAll/editBrand", //编辑品牌
    delBrand:"apiAll/delBrand",//删除品牌
    //车辆管理
    vdlautoList:"apiAll/vdlautoList", //获取车辆
    addVehicle:"apiAll/addVehicle",  //添加车辆
    editVehicle:"apiAll/editVehicle", //编辑车辆
    delVehicle:"apiAll/delVehicle",  //删除车辆
    seeVehicle:"apiAll/seeVehicle", //查看车辆
    homeVehicle:"apiAll/homeVehicle", //推荐首页显示
    headVehicle:"apiAll/headVehicle"  ,//设置一成首付
    // 客户管理
    importClient:"apiAll/importClient", //客户导入
    exportClient:"apiAll/exportClient", //客户导出
    downTempClient:"index/downTempClient",//模版下载
    clientList:"apiAll/clientList", //客户列表
    addClient:"apiAll/addClient", //添加客户
    editClient:"apiAll/editClient", //编辑客户
    turClient:"apiAll/turClient",   //成交
    oteamClient:"apiAll/oteamClient", //分配管理员
    //订单管理
    orderList:"apiAll/orderList",
    addOrder:"apiAll/addOrder",  //添加订单
    editOrder:"apiAll/editOrder", //编辑订单
    importOrder:"apiAll/importOrder", //客户导入
    exportOrder:"apiAll/exportOrder",//客户导出
    downTempOrder:"index/downTempOrder",//模版下载
    //评价列表
    commentList:"apiAll/commentList",   //获取评价
    delComment:"apiAll/delComment",   //删除评价
    replyComment:"apiAll/replyComment",   //回复评价
    seeComment:"apiAll/seeComment",   //评价详情
}
