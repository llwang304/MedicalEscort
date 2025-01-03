import { createStore } from 'vuex'
import menu from './menu'
import { createPersistedState}from 'veux-persistedstate'
// 创建一个新的 store 实例
//定义模块
//模块里定义state,mutations(要唤醒一个 mutation 处理函数，你需要以相应的 type 调用 store.commit 方法：)
export default createStore({
    modules:{
        menu,
    }
})
