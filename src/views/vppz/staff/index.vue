<template>
  <div>
    <panel-head :route="route"/>
    <div class="btns">
      <el-button type="primary" :icon="Plus" @click="open(null)" size="small">新增</el-button>
      <!-- <el-button type="primary" :icon="Delete" @click="editForm(null)" size="small" color="red">删除</el-button> -->
      <el-popconfirm
        confirm-button-text="是"
        cancel-button-text="否"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否确认删除?"
        @confirm="confirmEvent"
        
      >
        <template #reference>
          <el-button type="danger" :icon="Delete" size="small" >Delete</el-button>
        </template>
      <el-button type="danger" size="small">删除</el-button>
      </el-popconfirm>
    </div>
    <el-table :data="tableData.list" style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" /><!-- :selectable="selectable"  -->
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-image 
          :src="scope.row.avatar"
          style="width:50px;height:50px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" >
        <template #default="scope">
          {{(scope.row.sex==="1")?"男":"女"}}
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
            <el-icon><Clock/></el-icon>
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
      title="陪护师添加"
      width="500">
      <el-form 
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
      >
        <el-form-item  v-show="false" label="id"  prop="id">
            <el-input v-model="form.id" ></el-input>
        </el-form-item>
        <el-form-item  label="昵称"  prop="name">
            <el-input v-model="form.name" placeholder="请输入昵称" ></el-input>
        </el-form-item>
        <el-form-item label="头像"  prop="avatar">
            <el-button  v-if="!form.avatar" type="primary" @click="dialogImageVisible=true">点击上传</el-button>
            <el-image 
              v-else
              :src="form.avatar"
              style="width:100px;height:100px;"
            />
        </el-form-item>
        <el-form-item label="性别"  prop="sex">
            <el-select v-model="form.sex" placeholder="请选择性别">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
        </el-form-item>
        <el-form-item label="年龄"  prop="age">
            <el-input-number v-model="form.age" :min="18" :max="50"  />
        </el-form-item>
        
        <el-form-item label="手机号"  prop="mobile">
            <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="是否生效"  prop="active">
          <el-radio-group v-model="form.active">
            <el-radio :value="0">失效</el-radio>  <!-- 错因"value="1"" -->
            <el-radio :value="1">生效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirm(formRef)">
            Confirm
          </el-button>
          <el-button @click="dialogFormVisible=false" >Cancel</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog 
      v-model="dialogImageVisible"  
      :before-close="beforeClose"
      title="选择图片"
      width="680">
    >
    <div class="image-list">
      <div v-for="(item,index) in fileList" :key="item.name" class="img-box" @click="selectIndex=index">
        <div v-if="index===selectIndex" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image 
          style="width:148px;height:148px" :src="item.url"/>
      </div>
    </div>
    <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmImage">
            Confirm
          </el-button>
          <el-button @click="dialogImageVisible=false" >Cancel</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- <el-dialog 
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
    </el-dialog> -->
  </div>
   
  
</template>

<script setup>
  import {photoList,companion,companionList,deleteCompanion} from '../../../api'
  import {reactive,ref,onMounted,nextTick} from 'vue'
  import {Clock,Plus,Delete} from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import {useRoute} from 'vue-router' //（用于显示panelhead）
import { ElMessage } from 'element-plus'
  const route=useRoute()//路由实例（用于显示panelhead）

  /*--------------------页面表格显示-------------------*/
  const tableData=reactive({
    list:[],
    total:0,
  })

  //更新表格(不仅onmounted里面要用，每次关闭dialog之后也要更新)
  const getListData=()=>{
    companionList(paginationData).then(({data})=>{
      //获取接口数据
      console.log(data,'companionList')
      const {list,total}=data.data   //当前页，总页数

      list.forEach(item => {
        item.create_time=dayjs(item.create_time).format('YYYY-MM-DD')
        //item.sex=(item.sex===1)?"男":"女"
      });
      tableData.list=list
      tableData.total=total
      console.log("tableData.list",tableData.list)
      })
  } 

  

  /*----------------------删除功能------------------------*/
  const selectTableData=ref([])
  const handleSelectionChange=(val)=>{//传入的是什么？
    //selectTableData=val
    selectTableData.value=val.map(item => ({id:item.id}))
  }

  const confirmEvent=()=>{
    //没有选择数据
    if(!selectTableData.value){
      return ElMessage.warning('请选择至少一项')
    }else{
      /* deleteCompanion(selectTableData).then(()=>{
      }) */
      deleteCompanion({id:selectTableData.value}).then(({data})=>{
        if(data.code===10000){
          getListData()
        }
      })
    }
  }

  /*----------------------"陪护师添加/编辑"对话框------------------------*/
  //控制对话框的显示隐藏
  const  dialogFormVisible=ref(false)//弹窗的显示隐藏0表示隐藏，1表示显示
  //用ref拿到form ref实例
  const formRef=ref()
  //用reactive创建表单数据
  const form=reactive({
    id:'',
    mobile:'',
    active:1,//1代表生效，0代表无效
    age:28,
    avatar:'',
    name:'',
    sex:'',
  })

  const rules=reactive({//实现必选和红色提示语
    name: [{required:true,trigger:'blur',message:'请输入昵称'}],//当表单失去焦点时触发
    avatar:[{required:true,trigger:'blur',message:'请选择图像'}],
    sex:[{required:true,trigger:'blur',message:'请选择性别'}],
    mobile:[{required:true,trigger:'blur',message:'请输入电话'}],
    
  } )

  const open=(rowData={})=>{
    dialogFormVisible.value=true
    nextTick().then(() => {
      //如果是编辑
      if(rowData){
        Object.assign(form,rowData)
      }else{

      }
    });
  }

  
  
  //关闭弹窗的回调
  const beforeClose=()=>{
    //dialogFormVisible=false
    dialogFormVisible.value=false
    //重置表单
    formRef.value.resetFields()
    
  }

  //表单提交
  const confirm=async(formEl)=>{
    if (!formEl) return
    //手动触发表单校验
    await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(form,'submit!')
      companion(form).then(({data})=>{//post方法，发给后端
        if(data.code===10000){
          ElMessage.success(data.message)
          getListData()//更新tableData
          beforeClose()//关闭窗口
          
          console.log("已更新tableData",tableData)
        }else{
          ElMessage.error(data.message)
        }
        
        
        
      })
      //关闭窗口
      
    } else {
      console.log('error submit!', fields)
    }
    })
  }

  /*----------------------"上传照片"对话框------------------------*/
  //控制对话框的显示隐藏
  const  dialogImageVisible=ref(false)//弹窗的显示隐藏0表示隐藏，1表示显示
  const fileList=ref([])
  const selectIndex=ref(0)

  const confirmImage=()=>{
    form.avatar=fileList.value[selectIndex.value].url
    dialogImageVisible.value=false
  }
  /*-----------------------分页功能--------------------*/
  const paginationData=reactive({
    pageNum:1,//页码
    pageSize:10,//每页多少条
  })

  //分页效果
const handleSizeChange=(val)=>{
    paginationData.pageSize=val
  }

  const handleCurrentChange=(val)=>{
    paginationData.pageNum=val
    getListData()
  }

  /*按钮功能，打开删除*/
  const editForm=(rowData={})=>{

  }



/*-----------------------生命周期--------------------*/

onMounted(()=>{
  photoList().then(({data})=>{
    if(data.code===10000){
      fileList.value=data.data
    }
  })
  getListData()
})
</script>

<style lang="less" scoped>
  .flex-box{
        display:flex;
        align-items:center;
        height:100%;
    }
    .btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>