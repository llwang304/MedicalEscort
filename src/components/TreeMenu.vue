<template>
  <div v-for="(item,index) in props.menuData" >
    <el-menu-item 
      @click="handleClick(item,`${props.index}-${item.meta.id}`)"
      v-if="!item.children || item.children.length==0" 
      :index="`${props.index}-${item.meta.id}`" 
      :key="`${props.index}-${item.meta.id}`"
    >
      <el-icon size="20">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{item.meta.name}}</span>
    </el-menu-item>
    <el-sub-menu v-else 
    :index="`${props.index}-${item.meta.id}`" 
    :key="`${props.index}-${item.meta.id}`">
      <template #title>
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span>{{item.meta.name}}</span>
      </template>
      <tree-menu :index="`${props.index}-${item.meta.id}`" 
      :menuData="item.children"/>
    </el-sub-menu>
  </div>
        
</template>

<script setup>
import { useRouter } from "vue-router"
const props=defineProps(['menuData','index'])
import { useStore } from 'vuex'


console.log(props,'menuData')//一个proxy对象
const router=useRouter()//创建router实例
const store=useStore()//取得store的实例



//点击菜单   (2025.1.3更新，你看我现在才发现之前就曾经传了一个active参数过来，这个active是从哪来的？)
const handleClick = (item,active) => {
  console.log(item,'item')
  router.push(item.meta.path)
  store.commit('addMenu',item.meta)
  store.commit('updateMenuActive',active)

}
/* function handleClick(item,active){

} */
</script>

<style scoped>

</style>