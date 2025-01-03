import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'//引入router
import store from './store'
import PanelHead from '../src/components/PanelHead.vue'


router.beforeEach((to,from)=>{
  const token=localStorage.getItem('pz_token')
  //非登陆页面token不存在，
  if(!token&&to.path!=='/login'){
    return '/login'
  }else if(token&&to.path==='/login'){
    return '/'
  }else{
    return true//true是什么？
  }
})
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('PanelHead',PanelHead)

//把router挂载在实例上
app.use(router)

//store挂载
app.use(store)
app.mount('#app');

//createApp(App).mount('#app')



