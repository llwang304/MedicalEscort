<template>
  <div>
    <panel-head :route="route"/>
    <div class="btns">
      <el-button type="primary" :icon="Plus" @click="editForm(null)" size="small">打开</el-button>
    </div>
    
    <div>
      <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="昵称" width="180" />
        <el-table-column prop="permissionName" label="菜单权限" />
        <el-table-column label="操作">
          <!-- 用于定义具名插槽（named slots）。具名插槽允许你在父组件中为子组件提供不同的内容，并将其插入到子组件的特定位置 -->
          <template #default="scope">
            <el-button type="primary" @click="editForm(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-info">
        <el-pagination
          v-model="paginationData.pageNum"
          :page-size="paginationData.pageSize"
          :background="false"
          size="small"

          layout="total, prev, pager, next"
          :total="tableData.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog 
      v-model="dialogFormVisible"  
      :before-close="beforeClose"
      title="添加权限"
      width="500">
      <el-form 
      ref="formRef"
      label-width="100px"
      label-position="left"
      :model="form"
      :rules="rules"
      >
      <el-form-item prop="id" v-show="false">
        <el-input v-model="form.id"/>
      </el-form-item>
      <el-form-item label="名称"
        prop="name">
          <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限"
        prop="permissions">
        <!-- 设置选中节点。 获取和设置各有两种方式：通过 node 或通过 key。 如果需要通过 key 来获取或设置，则必须设置 node-key。 -->
          <el-tree
            ref="treeRef"
            :data="permissionData"
            show-checkbox
            style="max-width:600px;"
            node-key="id"
            :default-checked-keys="defaultKeys"
            :default-expanded-keys="[2]">

          </el-tree>
      </el-form-item>
      </el-form>
      <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">
          Confirm
        </el-button>
        <el-button @click="dialogFormVisible.value=false" >Cancel</el-button>
      </div>
    </template>

    </el-dialog>
  </div>
</template>

<script setup>
  import {ref,reactive,onMounted, nextTick} from 'vue'
  import { userGetMenu, userSetMenu,menuList } from '../../../api'
  import {Plus} from '@element-plus/icons-vue'
  import {useRoute} from 'vue-router' //（用于显示panelhead）
  const route=useRoute()//路由实例（用于显示panelhead）




  const  dialogFormVisible=ref(false)//弹窗的显示隐藏0表示隐藏，1表示显示
  const form=reactive({
    name:'',
    permissions:'',
    id:'',//仅修改时需要，新增时不需要
  })
  /*---------列表数据------*/
  /* 注意，menulist的调用时机，放在Onmounted中是否合适。这个逻辑是否只在挂载时调一次,是单独写/在onmouted里面？*/
  //分页设置
   const paginationData=reactive({
        pageNum:1,//页码
        pageSize:10,//每页多少条
    })
    //列表数据这里可以看一下接口的文档
  const tableData=reactive({
    list:[],
    total:0,
  })
  const getListData=()=>{
    menuList(paginationData).then(({data})=>{
      console.log(data,'menuList')
      const {list,total} =data.data
      //reactive数据要分开赋值
      tableData.list=list
      tableData.total=total
    })
  }
  

  const handleSizeChange=(val)=>{
    paginationData.pageSize=val
  }

  const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
  }
  /*---------------权限树相关----------------*/
  //权限菜单树形结构
  const permissionData=ref([])
  //选中权限
  const defaultKeys=[4,5]
  //el-tree实例
  const treeRef=ref()
  /*权限树形结构相关函数*/
  onMounted(()=>{
    //获取菜单数据
    userGetMenu().then(({data})=>{
      console.log(data.data,'userGetMenu')
      permissionData.value=data.data//注意是permission.value,而不是permission本身
    })
    getListData()
  })

  
  /*-----------弹窗相关-------*/
  const formRef=ref()
  const rules=reactive({//实现必选和红色提示语
    name: [{required:true,trigger:'blur',message:'请输入权限名称'}],//当表单失去焦点时触发
  } )

 

  //关闭弹窗的回调
  const beforeClose=()=>{
    //dialogFormVisible=false
    dialogFormVisible.value=false
    //重置表单
    formRef.value.resetFields()
    //重置treeref
    treeRef.value.setCheckedKeys(defaultKeys)
  }

  //表单提交
  const confirm=async(formEl)=>{
    if (!formEl) return
    //手动触发表单校验
    await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(form,'submit!')
      //获取选择的全部数据
      console.log(treeRef.value.getCheckedKeys(), 'checked keys')
      const permissions=JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({name:form.name,permissions,id:form.id}).then(({data})=>{
        console.log(data,'userSetmenu')
      })
      //关闭窗口
      beforeClose()
      getListData()
    } else {
      console.log('error submit!', fields)
    }
    })
  }

  //打开弹窗
  //如果说是新增，则不需要传达数据
  const editForm=(rowData={})=>{
    dialogFormVisible.value=true;
    //弹窗打开和form生成是异步的：生成之后在打开？？？
    nextTick(()=>{
      //如果rowdata存在的话，手动赋值
      if(rowData){
        //由于响应式reactive数据不能整体赋值（会造成响应丢失），因此需要用Object.assign方法
        Object.assign(form,{id:rowData.id,name:rowData.name})
        treeRef.value.setCheckedKeys(rowData.permission)
      }
    })

  }



</script>

<style lang="less" scoped>
  .btns{
    padding:10px 0 10px 10px;
    background-color: #fff;
  }
</style>