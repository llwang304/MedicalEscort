<template>
  <el-row class=login-container justify="center" :align="'middle'">
    <el-card style="max-width:480px">
      <!-- 具名插槽 -->
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">{{formType?'返回登录':'注册账号'}}</el-link>
      </div>
      <el-form 
      :model="loginForm" 
       style="max-width: 600px" class="demo-ruleForm"
      :rules="rules"
      ref="loginFormRef">
        
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" type="password" placeholder="密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="validCode" v-if="formType">
          <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock">
            <template #append>
              <span @click="countDownChange">{{countDown.validText}}</span>
              <!-- <el-button :icon="Search" /> -->
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{width:'100%'}" @click=submitForm(loginFormRef)>{{formType?'注册账号':'登陆账号'}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>


</template>

<script setup>
  import { ElMessage } from 'element-plus'
  import {ref,reactive,computed,toRaw} from 'vue'
  import {getCode, userAuthentication,login, menuPermissions} from '../../api/index.js'
  import {useRouter} from 'vue-router'
  import { useStore } from 'vuex'
  const store=useStore()//取得store的实例
  const routerList=computed(()=>store.state.menu.routerList)

  const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href


  //表单数据,与template中v-model对应
  const loginForm=reactive({
    userName:'',
    passWord:'',
    validCode:'',
  })

  //表单校验
  //userName校验规则
  const validateUser=(rule,value,callback)=>{//规则，输入值，回调
    //不能为空
    if(value===''){
      callback(new Error('请输入账号'))
    }else{
      //格式
      const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      phoneReg.test(value)?callback():callback(new Error('手机号格式不对，请输入正确手机号'))
    }
  }
  //passWord校验规则
  const validatePass=(rule,value,callback)=>{//规则，输入值，回调
    //不能为空
    if(value===''){
      callback(new Error('请输入密码'))
    }else{
      const PassReg=/^[a-zA-Z0-9_-]{4,16}$/
      PassReg.test(value)?callback():callback(new Error('密码格式不对,需要4-16位字符,请确认格式'))
    }
  }

  const rules=reactive({
    userName: [{validator:validateUser,trigger:'blur'}],//当表单失去焦点时触发
    passWord: [{validator:validatePass,trigger:'blur'}],

  } )
  

  //点击切换登录和注册
  //创建切换表单（0登录，1注册）
  const formType=ref(0)
  const handleChange=()=>{
    formType.value=!formType.value
    
  }



  //验证码倒计时逻辑
  let flag=false //默认false,用于限制用户在倒计时中反复点击创建多个计时器(注意，这个不等同于发验证码键只允许按一次的click.once)
  const countDown=reactive({
    validText:'获取验证码',
    time:60,
  })
  //点击倒计时读秒变化
  const countDownChange=()=>{
    if(flag)return
    //判断手机号是否符合格式,如果错误，返回warning信息
    const phoneReg=/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!loginForm.userName||!phoneReg.test(loginForm.userName)){
      return ElMessage({
          message: '请检查手机号是否正确',
          type: 'warning',
          plain: true,
        })

    }
    //如果手机号符合格式，开启定时器
    const clock=setInterval(()=>{
      if(countDown.time>0){
        countDown.time-=1
        countDown.validText=`剩余${countDown.time}s`
      }else{
        //停止计时器
        countDown.time=60
        countDown.validText='获取验证码'
        flag=false
        clearInterval(clock)
      }
      
    },1000)
    flag=true
    getCode({tel:loginForm.userName}).then(({data})=>{
      console.log(data,'data')
      if(data.code===10000){
        ElMessage.success('发送成功')
      }
    })
  }

  const router=useRouter()
  const loginFormRef=ref()

  //提交表单
  const submitForm=async(formEl)=>{

    if (!formEl) return
    //手动触发表单校验
    await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(loginForm,'submit!')
      //注册
      if(formType.value){//注意要用formType.value,不能用formType对象本身，因其总是true
        userAuthentication(loginForm).then(({data})=>{
          if(data.code===10000){
            ElMessage.success('注册成功，请登录')
            formType.value=0
          }
        })
      }else{
        //登录
        login(loginForm).then(({data})=>{
          if(data.code===10000){
            ElMessage.success('登录成功！')
            console.log(data)
            //将token和用户信息缓存到浏览器中
            localStorage.setItem('pz_token',data.data.token)//从服务器发回的数据中取出token,以便后续请求时加入请求头使用
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            console.log(data.data.token,'token')
            console.log(data.data.userInfo,'userinfo')
            //2025.1.2添加
            menuPermissions().then(({data})=>{//data是从后端get得到的数据
              store.commit("dynamicMenu",data.data)
              console.log("更新后的routerList",routerList)
              //响应式数据转为普通对象数据
              toRaw(routerList.value).forEach(item=>{
                router.addRoute('main',item)
              })
              router.push('/')//跳转到根路径
            })
            
          }
        })

      }
    } else {
      console.log('error submit!', fields)
    }
  })
  }
</script>

<style lang="less" scoped>
  :deep(.el-card__header){
    padding:0;
  }
  .login-container{
    height:100%;
    .card-header{
      background-color: #899fe1;
      img{
        width:430px;

      }
    }
    .jump-link{
      text-align:right;
      margin-bottom: 10px;
    }
  }
</style>