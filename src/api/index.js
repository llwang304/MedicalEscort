import request from '../utils/request'
// 联调多个接口
// 发送验证码
export const getCode=(data)=>{
    return request.post('/get/code',data)//有baseurl,所以不需要完整的url
}

//注册用户
export const userAuthentication=(data)=>{
    return request.post('/user/authentication',data)
}

//登录用户
export const login=(data)=>{
    return request.post('/login',data)
}

//账号管理列表
export const authAdmin=(params)=>{
    return request.get('/auth/admin',{params})
}

//菜单权限数据
export const userGetMenu=()=>{
    return request.get('/user/getmenu')
}

//权限修改
export const userSetMenu=(data)=>{
    return request.post('/user/setmenu',data)
}

//菜单权限列表
export const menuList=(params)=>{
    return request.get('/menu/list',{params})
}

//菜单权限下拉
export const menuSelectList=()=>{
  return request.get('/menu/selectlist')
}


//用户信息修改
export const updateUser=(data)=>{
  return request.post('/update/user',data)
}

//用户菜单权限
export const menuPermissions=()=>{
  return request.get('/menu/permissions')
}

/*------------------staff页面------------------*/
//陪护师头像
export const photoList=()=>{
  return request.get('/photo/list')
}

//陪护师创建
export const companion=(data)=>{
  return request.post('/companion',data)
}

//陪护列表
export const companionList=(params)=>{
  return request.get('/companion/list',{params}) //pagenum,pagetotal
}

//陪护师删除post,传id array[string]
export const deleteCompanion=(data)=>{
  return request.post('/delete/companion',data)
}