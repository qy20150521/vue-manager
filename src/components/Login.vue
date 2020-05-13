<template>
  <div class="login_container">
    <div class="login_box">
      <el-form ref="loginForm" :model="loginForm" :rules="rules" class="login_form">
        <el-form-item class="mt" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" show-password prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //  验证规则
        rules: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 重置表单
      resetLoginForm() {
        this.$refs.loginForm.resetFields()
      },
      //  登录
      login() {
        //  表单校验结果
        this.$refs.loginForm.validate(async valid => {
          if (!valid) return
          const { data: res } = await this.$http.post('login', this.loginForm)
          //  登录失败
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          //  登录成功之后的操作
          this.$message.success(res.meta.msg)
          //  保存token值
          window.sessionStorage.setItem('token', res.data.token)
          //  跳转到首页
          this.$router.push('/home')
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .login_container {
    background-color: #2b4b6b;
    height: 100%;

    .login_box {
      width: 450px;
      height: 300px;
      background: #fff;
      border-radius: 3px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .login_form {
        padding: 20px;
        .mt {
          margin-top: 80px;
        }

        .tr {
          text-align: right;
        }
      }
    }
  }
</style>
