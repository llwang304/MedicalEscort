<template>
  <div>
    <h1 >用户登录</h1>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="form.userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="form.passWord"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
  import {useRouter} from 'vue-router'
  import {reactive,getCurrentInstance} from 'vue'

  
  //获取当前vue实例
  const {proxy} =getCurrentInstance()

  //获取路由对象
  const router=useRouter()
  //表单数据
  const form=reactive({
    userName:'',
    passWord:'',

  })
  //表单提交
  const onSubmit=async()=>{
    /* proxy.$api.login(form).then((data)=>{//这次不用这个了
    }) */
    const {data}=await proxy.$api.login(form)//{}把data解构出来
    //console.log('res',data)
    if(data.code===10000){
      localStorage.setItem('h5_token',data.data.token)
      localStorage.setItem('h5_userInfo',JSON.stringify(data.data.userInfo))//为什么要json.stringify?因为此时的后端发过来的数据中的userinfo是个object,而localstorage中智能存储字符串
      router.push('/home')
    }else{

    }
  }

</script>

<style lang="less" scoped>
  h1{
    text-align: center;
  }
</style>