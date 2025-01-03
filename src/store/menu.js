const state={
    //菜单的展开和收起
    isCollapse:false,
    //tag的数据
    selectMenu:[],
    //menu在对应的项目中的真实路径
    routerList:[],
}
const mutations={
    //mutation会默认接收一个state
    //折叠菜单
    collapseMenu(state){
        state.isCollapse=!state.isCollapse
    },
    //打开页面，添加顶栏Menu
    addMenu(state,payload){//payload是什么？
        //对数据进行去重
        if(state.selectMenu.findIndex(item=>item.path===payload.path)===-1){
            state.selectMenu.push(payload)
        }
    },
    //关闭Menu
    closeMenu(state,payload){
        //找到点击数据的索引
        const index=state.selectMenu.findIndex(val=>val.name===payload.name)
        //通过索引删除数组指定元素
        state.selectMenu.splice(index,1)//开始位置-个数
    },

    //store.commit("dynamicMenu",data.data)，payload(data.data)是api（menuPermissions）中get到的数据，可以在网络监视器（permissions）中看到
    dynamicMenu(state,payload){
      console.log('dynamicMenu调试,payload=',payload)
      //通过glob导入文件，啥文件（vue页面文件），为啥要导入文件？
      const modules = import.meta.glob('../views/**/**/*.vue')//文件通配符知识
      console.log('modules=',modules)
      //通过权限拼接成router.js中写死的路由路径

      //以下一个嵌入的函数
      function routerSet(router){//router这里是指一个还是所有的？答：所有的,此外这里的router是一个形参，要对应到实参payload上去
        router.forEach(route => {
          //判断如果没有子菜单(判断是否有children属性，可以通过查看网络监视器中的permissions或console.log中的payload可知)，拼接
          if(!route.children){
            console.log('如果没有孩子')
            const url=`../views${route.meta.path}/index.vue`
            //拿到获取的vue组件
            //route.component=modules[url]
            // 检查路径是否存在
            if (modules[url]) {
              route.component = modules[url];
          } else {
              console.warn(`组件 ${url} 没有找到`);
          }
          }else{//如果有子菜单，需要递归
            console.log('如果有孩子')
              routerSet(route.children)     
          }
        });
      }
      //拿到完整的路由数据
      routerSet(payload)
      state.routerList=payload



    },

    
}


export default{
    state,mutations    //这里是es6的简写
}