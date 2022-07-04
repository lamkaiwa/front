<template>
  <div>
    <el-form :model="userLogin" status-icon :rules="rules" ref="userLogin">
      <el-form-item prop="email">
        <el-input v-model="userLogin.email" placeholder="输入邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="userLogin.password" autocomplete="off" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 28rem;">
        <el-button style="width:45%" type="primary" @click="login">登录</el-button>
        <!-- 注册 -->
        <router-link to="/login/signIn" replace>
          <el-button style="width:45% ;margin-left:10%">注册</el-button>
        </router-link>
      </el-form-item>
      <el-form-item style="text-align: right">
        <router-link to="/login/reSet" style="color: #00A1D6" replace>忘记密码？</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from '../../../api/user'
export default {
  data() {
    return {
      userLogin: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.userLogin.validate(async valid => {
        if (valid) {
          let result = await login(this.userLogin)
          if (result.code == 200) {
            this.$message.success('登入成功')
            this.$store.commit('setUser', result.data)
            console.log(this.$store.state.user)
            await this.$router.replace('/home')
          } else {
            this.$message.error(result.message)
          }
        } else {
          this.$message.error('请按规格填写账号密码')
          return false
        }
      })
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.el-form {
  width: 28rem;
}
</style>
