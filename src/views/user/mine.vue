<template>
  <div>
    <!-- 顶部 -->
    <div class="topBg">
      <el-row type="flex" align="middle">
        <el-col :span="2" style="text-align: center">
          <el-avatar icon="el-icon-user-solid" :size="64" :src="$store.state.user.headUrl"></el-avatar>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 1.6rem">{{ $store.state.user.nick }}</span>
          &nbsp;
          <!--    性别图标 -->
          <i class="el-icon-female el-icon" style="color:#FF758F" v-if="$store.state.user.sex"></i>
          <i class="el-icon-male el-icon" style="color:#5FD4F2;" v-else></i>
          <div class="sign">
            <p style="color: #D6DEE4" contenteditable="true" ref="sign" @blur="updateSign(user.sign)" title="个性签名,点击可编辑">
              {{ $store.state.user.sign }}
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--  中间文字  -->
    <div class="middle">
      <el-row>
        <router-link to="/mine/video">
          <el-col :span="2">
            <i class="el-icon-video-camera" style="color: #00C091;margin: 4px"></i>
            视频
          </el-col>
        </router-link>
        <!--     若为他人则不显示以下内容   -->
        <div>
          <router-link to="/mine/collection">
            <el-col :span="2">
              <i class="el-icon-collection" style="color: #FB7299;margin: 4px"></i>
              收藏
            </el-col>
          </router-link>
          <router-link to="/mine/attention">
            <el-col :span="2">
              <i class="el-icon-collection-tag" style="color: #F3A034;margin: 4px"></i>
              关注
            </el-col>
          </router-link>
          <router-link to="/mine/setting">
            <el-col :span="2">
              <i class="el-icon-setting" style="color: #23C9ED;margin: 4px"></i>
              个人资料
            </el-col>
          </router-link>
          <router-link to="/mine/setPassword">
            <el-col :span="2">
              <i class="el-icon-warning-outline" style="color: #FB7299;margin: 4px"></i>
              密码修改
            </el-col>
          </router-link>
          <!-- <router-link to="/mine/live">
            <el-col :span="2">
              <i class="el-icon-service" style="color: #F3A034;margin: 4px"></i>
              直播
            </el-col>
          </router-link> -->
        </div>
        <el-col :span="2" :offset="8" style="line-height: 200%;font-size: 1.4rem">
          <p>粉丝数</p>
          <span>{{ user.fansCount }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { updateUser } from '../../api/user'
export default {
  data() {
    return {
      leo: 'dsadsa',
      user: {}
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  methods: {
    async updateSign(oldValue) {
      let newValue = this.$refs.sign.innerText.trim()
      if (oldValue === newValue) return (this.$refs.sign.innerText = oldValue)
      if (newValue.length > 40 || newValue.length < 2) {
        this.$refs.sign.innerText = oldValue
        return this.$message.error('不能为空且长度2-40')
      }
      let result = await updateUser({ id: this.user.id, sign: newValue }, this.user.token)
      if (result.code == 200) {
        this.user.sign = newValue
        this.$store.commit('setSign', newValue)
        this.$message.success(result.message)
      } else {
        this.$message.error(result.message)
      }
    },
    async init() {
      if (this.$store.state.user == null) {
        this.$message.error('先登录')
        return await this.$router.push('/login')
      }
      this.user = this.$store.state.user
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/*顶部 */
.topBg {
  height: 200px;
  background: url('./bgImg.webp') no-repeat;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: white;
  .el-row {
    background-image: linear-gradient(rgba(1, 1, 1, 0.1) 30%, rgba(1, 1, 1, 0.5));
    padding: 8px;
  }
  .el-icon {
    font-size: 1.5em;
    font-weight: bold;
  }
  .sign {
    font-size: 1.2rem;
    height: 20px;
    margin-top: 0.8rem;
  }
}
/*  中间*/
.middle {
  border: 1px solid #ebebeb;
  border-radius: 0 0 10px 10px;
  text-align: center;
  font-size: 16px;
  height: 64px;
  line-height: 60px;
  .router-link-active {
    .el-col {
      border-bottom: #00a1d6 solid 2px;
    }
  }
  a .el-col {
    margin-left: 10px;
    &:hover {
      border-bottom: #00a1d6 solid 2px;
      color: #00a1d6;
    }
  }
}
</style>
