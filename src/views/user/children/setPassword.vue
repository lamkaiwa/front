<template>
  <div class="pass">
    <el-form label-width="80px" :rules="rules" status-icon :model="user" ref="userForm">
      <el-form-item label="邮箱">
        <el-input v-model="email" disabled></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-col :span="14">
          <el-input v-model.number="user.code"></el-input>
        </el-col>
        <el-col :span="2" :offset="3">
          <el-button type="primary" @click="getCode" :disabled="isDisabled">{{ btnText }}</el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="user.checkPass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { sendEmail, updatePassWord } from '../../../api/user'
import { mapState } from 'vuex'
export default {
  name: 'setPassword',
  computed: {
    ...mapState(['userId'])
  },
  data() {
    let validateCheck = (rule, value, callback) => {
      if (this.user.password !== value) {
        callback(new Error('两次密码输入不一样！'))
      } else {
        callback()
      }
    }
    return {
      email: '',
      user: {
        code: '',
        password: '',
        checkPass: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { type: 'string', message: '请输入正确的4位验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '再次输入密码', trigger: 'blur' },
          { min: 6, max: 14, message: '长度在 6 到 14 个字符', trigger: 'blur' },
          { validator: validateCheck, trigger: 'blur' }
        ]
      },
      btnText: '点击获取',
      isDisabled: false
    }
  },
  methods: {
    async submit() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          let result = await updatePassWord(
            {
              id: this.$store.state.user.id,
              code: { code: this.user.code },
              email: this.email,
              password: this.user.password
            },
            this.$store.state.user.token
          )
          if (result.code == 200) {
            this.$message.success(result.message)
            this.$store.commit('logout')
            await this.$router.push('/login')
          } else this.$message.error(result.message)
        } else {
          this.$message.error('请修改错误项')
          return false
        }
      })
    },
    async getCode() {
      let result = await sendEmail(this.email)
      if (result.code == 200) {
        this.$message.success(result.message)
      } else this.$message.error(result.message)
      let count = 0
      this.isDisabled = true
      let tag = setInterval(() => {
        if (++count >= 60) {
          clearInterval(tag)
          this.isDisabled = false
          return (this.btnText = '点击获取')
        }
        this.btnText = `${60 - count}秒后获取`
      }, 1000)
    },
    async init() {
      this.email = this.$store.state.user.email
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.pass {
  width: 70rem;
  margin: 3rem 30rem 0;
  padding: 4rem 15rem 4rem 2rem;
  border: 1px solid #d7dae2;
  border-radius: 8px;
}
</style>
