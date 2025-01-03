<template>
    <div class="header-container">
        <div class="header-left flex-box">
        <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
        <ul class="flex-box">
            <li 
                v-for="(item,index) in selectMenu" 
                :key="item.path" 
                :class="{selected:route.path===item.path}" 
                class="tab flex-box">
                <el-icon size="12" >
                    <component :is="item.icon"></component>
                </el-icon>
                <!-- 为什么放在这?   to="item.path"这种写法是错误的，要写成一个对象-->
                <router-link class="text flex-box" :to="{path:item.path}">
                    {{item.name}}
                </router-link>
                <el-icon class="close" size="12"  @click="closeTab(item,index)"><Close /></el-icon>

                </li>
        </ul>
    </div>
    <div class="header-right flex-box">
        <el-dropdown @command="handleClick">
            <div class="el-dropdown-link flex-box">
                <el-avatar
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <p class="user-name">admin</p>
            </div>
        <!-- <span class="el-dropdown-link">
        Dropdown List
        <el-icon class="el-icon--right">
            <arrow-down />
        </el-icon>
        </span> -->
        <template #dropdown>
        <el-dropdown-menu>
            <el-dropdown-item command="cancel">退出</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
        </el-dropdown-menu>
    </template>
  </el-dropdown>
    </div>
  </div>
  
</template>

<script setup>
    import { useStore } from 'vuex'
    import {computed} from 'vue'
    import {useRoute} from 'vue-router'//返回当前激活的路由信息。它提供了对当前路由路径、参数、查询参数等的访问
    import {useRouter} from 'vue-router'
    const store=useStore()//取得store的实例
    const selectMenu=computed(()=>store.state.menu.selectMenu)
    const route=useRoute()
    const router=useRouter()

    //点击关闭tag
    const closeTab=(item,index)=>{
        store.commit('closeMenu',item)
        //删除非当前页tag
        if(route.path!==item.path){
            return
        }
        
        const selectMenuData=selectMenu.value//与计算属性selectMenu有关
        //删除最右一页
        if(index === selectMenuData.length){
            //如果tag只有一个元素则跳转到根路径
            //如果有多个,则索引值减一
            if(!selectMenuData.length){
                router.push('/')
            }else{
                router.push({
                    path:selectMenuData[index-1].path
                })
            }
        }else{//删除非最右一页
            router.push({
                path:selectMenuData[index].path
            })
        }
    }

    const handleClick=(command)=>{//调用@command=handleClick的时候，我好像没看见传参
      if(command==="cancel"){
        //清除缓存中保存的token
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        //将当前页面的完整 URL 设置为当前页面的协议、域名和端口号部分。
        //简单来说，它会让浏览器重新加载当前网站的根目录（如果有默认的首页文件，如index.html，就会加载这个文件）
        window.location.href=window.location.origin
      }

    }

    



</script>

<style lang="less" scoped>
    .flex-box{
        display:flex;
        align-items:center;
        height:100%;
    }
    .header-container{
        display:flex;
        justify-content: space-between;//沿着主轴对齐，中间的子项 会在主轴方向上 均匀分布，彼此之间有相等的间距。
        align-items: center;
        height:100%;
        background-color: white;
        padding-right: 25px;
        
        .header-left{
            height:100%;
            .icon{
                width: 45px;
                height:100%;
            }
            .icon:hover{
                background-color: gray;
                cursor:pointer;
            }
            .tab{
                padding: 0 10px;
                height:100%;
                .text{
                    margin:0 5px;
                    height:100%;
                }
                .close{//默认情况下 不显示
                    visibility:hidden;
                }
                &.selected{//与tab同级
                    a{//<router-link> 实际上会渲染为一个 <a> 标签。因此当前页的tag的文字图标会变蓝
                        color:#409eff;
                    }
                    i{
                        color:#409eff;
                    }
                    background-color: #f5f5f5;
                }
            }
            .tab:hover{
                background-color: #f5f5f5;
                .close{
                    visibility:inherit;
                    cursor:pointer;
                    color:#333;
                }
            }
        }
        .header-right{
            .user-name{
                margin-left:10px;
            }
        }
        a{
            height:100%;
            color:#333;
            font-size:15px;
        }
    }

</style>