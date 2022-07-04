<!-- 顶部导航-->
<template>
  <el-menu :default-active="'/' + $route.path.split('/', 2)[1]" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" router>
    <el-row :align="'middle'" type="flex">
      <el-col :span="2">
        <el-menu-item index="/home">主页</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/top">排行榜</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/upload">上传视频</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/webupload">web上传视频</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/admin">管理页面</el-menu-item>
      </el-col>
      <el-col :span="6" :offset="2">
        <el-input v-model="keyWord" placeholder="输入关键字搜索"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="danger" size="medium" @click="search">搜索</el-button>
      </el-col>
      <el-col :span="2" :offset="2" v-if="this.$store.state.user == null">
        <el-menu-item index="/login">
          <span>登录</span>
        </el-menu-item>
      </el-col>
      <el-col :span="3" :offset="1" v-else>
        <el-row type="flex" align="middle" style="line-height: 100%">
          <el-col :span="10">
            <el-avatar :src="$store.state.user.headUrl" icon="el-icon-user-solid" :size="48"></el-avatar>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-menu-item @click="logout">
              <span>退出</span>
            </el-menu-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/message">消息中心</el-menu-item>
      </el-col>
      <el-col :span="2">
        <el-menu-item index="/mine">个人中心</el-menu-item>
      </el-col>
    </el-row>
  </el-menu>
</template>
<script>
import { isLogin } from '../api/user'
export default {
  data() {
    return {
      keyWord: ''
    }
  },
  methods: {
    async logout() {
      this.$store.commit('setUser', null)
      this.$message.success('登出成功')
      await this.$router.replace('/login/loginForm')
    },
    search() {
      if (this.keyWord.trim() !== '') {
        this.$router.push({
          path: '/search',
          query: {
            keyWord: this.keyWord
          }
        })
      } else {
        this.keyWord = ''
        this.$message.error('请输入内容！')
      }
    },
    async init() {
      try {
        let result = await isLogin()
        if (result.err !== 0) {
          this.setUserId('')
        }
      } catch (e) {
        this.setUserId('')
      }
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped>
.el-menu {
  text-align: center;
  .el-row {
    margin: 0 3rem;
  }
}
</style>
