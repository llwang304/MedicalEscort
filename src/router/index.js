import { createWebHashHistory , createRouter } from 'vue-router'
import Layout from '../views/Main.vue'
import Login from '../views/login/index.vue'
/* import Admin from '../views/auth/admin/index.vue'
import Group from '../views/auth/group/index.vue'
import Order from '../views/vppz/order/index.vue'
import Staff from '../views/vppz/staff/index.vue'
import Dashboard from '../views/dashboard/index.vue' */


//获取动态路由数据
const localData=localStorage.getItem('pz_v3pz')

/* const routes=[
    {
        path:'/',
        name:'main',
        component:Layout,
        children:[
            {
                path:'dashboard',
                component: Dashboard,
                meta:{
                    id: '1',
                    name: '控制台', 
                    icon: 'Platform', //通常用于指定一个图标
                    path: '/dashboard', 
                    describe: '用于展示当前系统中的统计数据、统计报表及重要实时数据'
                    //在界面上为用户提供更多的信息
                }
            },
            {
                path: 'auth',
                meta: { id: '2' ,name: '权限管理', icon: 'Grid' },
                children: [
                  {
                    path: '',
                    alias: ['admin'],//用于为路由设置别名，允许同一个路由通过不同的路径访问
                    meta: { id: '1', name: '账号管理', icon: 'Avatar', path: '/auth/admin', describe: '管理员可以进行编辑，权限修改后需要登出才会生效' },
                    component: Admin
                  },
                  {
                    path: 'group',
                    meta: { id: '2', name: '菜单管理', icon: 'Menu', path: '/auth/group', describe: '菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取' },
                    component: Group
                  }
                ]
              },
              {
                path: 'vppz',
                meta: { id: '3', name: 'DIDI陪诊', icon: 'BellFilled' },
                children: [
                  {
                    path: '',
                    alias: ['staff'],
                    meta: { id: '1', name: '陪护管理', icon: 'Checked', path: '/vppz/staff', describe: '陪护师可以进行创建和修改，设置对应生效状态控制C端选择' },
                    component: Staff
                  },
                  {
                    path: 'order',
                    meta: { id: '2', name: '订单管理', icon: 'List', path: '/vppz/order', describe: 'C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改' },
                    component: Order
                  }
                ]
              }
        ]
    },
    {
        path:'/login',
        component:Login
    }
] */

const routes=[
  {
      path:'/',
      name:'main',
      component:Layout,
      redirect:to=>{
        //实现重定向功能。需要结合动态路由数据
        if(localData){
          //取子菜单中的第一个
          const child =JSON.parse(localData).menu.routerList[0].children
          if(child){
            return child[0].meta.path
          }else{
            return JSON.parse(localData).menu.routerList[0].meta.path
          }
        }else{
          //return '/'//这里有问题，too much recursion
          return '/auth/admin' 
        }
      },
      children:[],
  },
  {
      path:'/login',
      component:Login
  }
]

const router=createRouter({
    history:createWebHashHistory (),
    routes,
})

export default router