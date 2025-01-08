import request from '../utils/request'

/*login页面*/

/* export const getCode=(data)=>{
    return request.post('/get/code',data)
} */
//为啥写成这样？
export default{
  //用户登录
  login(data){
    return request.post('/login',data)
  },
  //首页数据
  index(){
    return request.get('/Index/index')
  }
  
}