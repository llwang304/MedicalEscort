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
  },
  //订单详情
  h5Companion(){
    return request.get('/h5/companion')
  },
  //提交订单
  createOrder(data){
    return request.post('/createOrder',data)
  },
  //订单列表
  orderList(params){
    return request.get('/order/list',{params})//get的参数需要用对象来传递
  }
}