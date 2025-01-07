import request from '../utils/request'

/*login页面*/
//获取验证码

/* export const getCode=(data)=>{
    return request.post('/get/code',data)
} */
//为啥写成这样？
export default{
  login(data){
    return request.post('/login',data)
  }
}