<template>
  <div>
    <panel-head :route="route"/>
    <el-table :data="tableData.list" style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="permissions_id" label="所属组别" >
        <template #default="scope">
          {{permissionName(scope.row.permissions_id)}}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column  label="状态" >
        <template #default="scope">
        <el-tag :type="scope.row.active? 'success':'danger'">
          {{scope.row.active ? '正常':'失效'}}
        </el-tag>
        </template>
      </el-table-column> 
      <el-table-column  label="创建时间" >
        <template #default="scope">
          <div class="flex-box">
            <el-icon><Clock /></el-icon>
            <span style="margin-left:10px">{{scope.row.create_time}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="操作" >
        <template #default="scope">
          <el-button type="primary" @click="open(scope.row)">编辑</el-button>
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
      <!-- <el-form-item prop="id" v-show="false">
        <el-input v-model="form.id"/>
      </el-form-item> -->
      <!-- disabled的含义是为了使这两个框不可修改 -->
      <el-form-item label="手机号"  prop="mobile">
          <el-input v-model="form.mobile" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称"  prop="name">
          <el-input v-model="form.name" ></el-input>
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select v-model="permissions_id" placeholder="请选择菜单权限" clearable style="width:240px">
          <el-option v-for="item in options" :key=item.id :label="item.name" :value="item.id"/>
        </el-select>
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
  import {authAdmin,menuSelectList,updateUser} from '../../../api'
  import {reactive,ref,onMounted} from 'vue'
  import {Clock} from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import {useRoute} from 'vue-router' //（用于显示panelhead）
  const route=useRoute()//路由实例（用于显示panelhead）
  



  const paginationData=reactive({
    pageNum:1,//页码
    pageSize:10,//每页多少条
  })
  const tableData=reactive({
    list:[],
    total:0,
  })
  //接受来自后端的数据并做调整
  const options=ref([])
  //控制对话框的显示隐藏
  const  dialogFormVisible=ref(false)//弹窗的显示隐藏0表示隐藏，1表示显示
  //表单内容
  const form=reactive({
    name:'',
    permissions_id:'',
    id:'',//仅修改时需要，新增时不需要
    mobile:'',
  })
  //
  const formRef=ref()
  const rules=reactive({//实现必选和红色提示语
    name: [{required:true,trigger:'blur',message:'请输入昵称'}],//当表单失去焦点时触发
    permissions_id: [{required:true,trigger:'blur',message:'请选择菜单权限'}]
  } )
  onMounted(()=>{
    getListData()
     menuSelectList().then(({data})=>{
      
      options.value=data.data
      console.log("options.value=",options.value)
    })
  })

//请求列表数据封装(因为不仅onmounted里面要用，每次关闭dialog之后也要更新)
const getListData=()=>{
  authAdmin(paginationData).then(({data})=>{
    //获取接口数据
    console.log(data,'authAdmin')
    const {list,total}=data.data   //当前页，总页数

    list.forEach(item => {
      item.create_time=dayjs(item.create_time).format('YYYY-MM-DD')
    });
    tableData.list=list
    tableData.total=total
    console.log("tableData.list",tableData.list)
    })
}

//根据权限id匹配权限名称
const permissionName=(id)=>{
  const data=options.value.find(el=>el.id===id)
  console.log("id=",id)
  console.log("data",data)
  
  return data ? data.name:'超级管理员'
}


//--------为啥这里谣传rowdata啊？
const open=(rowData)=>{
  dialogFormVisible.value=true;
  //目的，对话框中的信息（form）要显示scope.row中的信息
  Object.assign(form,{name:rowData.name,permissions_id:rowData.permissions_id,mobile:rowData.mobile})
}

//分页效果
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
  }

  const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
  }
 

  //关闭弹窗的回调
  const beforeClose=()=>{
    //dialogFormVisible=false
    dialogFormVisible.value=false
    /* //重置表单
    formRef.value.resetFields()
    //重置treeref
    treeRef.value.setCheckedKeys(defaultKeys) */
  }

  //表单提交
  const confirm=async(formEl)=>{
    if (!formEl) return
    //手动触发表单校验
    await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(form,'submit!')
      const {name,permissions_id}=form
      updateUser({name,permissions_id}).then(()=>{
        if(data.code==10000){
          dialogFormVisible.value=false;
          getListData()
        }
      })

      //关闭窗口
      beforeClose()
    } else {
      console.log('error submit!', fields)
      }
    })
  }

  //编辑表单
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
  .flex-box{
        display:flex;
        align-items:center;
        height:100%;
    }
</style>