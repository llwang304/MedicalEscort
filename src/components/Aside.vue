<template>
      <el-menu
        :style="{width:!isCollapse?'230px':'64px'}"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isCollapse"
      >
      <p class="logo-lg">{{!isCollapse?'DIDI陪诊':'DIDI'}}</p>
      <TreeMenu  :index="1" :menuData="menuData"/>
      </el-menu>

</template>

<script setup>
import TreeMenu from '../components/TreeMenu.vue'
import {useRouter} from 'vue-router'//useRouter 返回整个路由器实例，允许你访问和使用所有的路由器方法
import {reactive} from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const isCollapse = computed(()=>store.state.menu.isCollapse)


const router=useRouter()
/* const menuData=reactive(router.options.routes[0].children)//这是写死的数据 */
const menuData=computed(()=>store.state.menu.routerList)
console.log(router,'router')
const handleOpen=()=>{

}
const handleClose=()=>{

}
</script>

<style  lang="less" scoped>
 .aside-container{
    height:100%;
    .logo-lg{
        font-size: 20px;
        text-align: center;
        height:50px;
        line-height:50px;
        color:#fff;
    }
 }
</style>