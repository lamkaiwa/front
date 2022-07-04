<template>
  <div>
    <!-- 顶部 -->
    <div class="topBg">
      <el-row type="flex" align="middle">
        <el-col :span="2" style="text-align: center">
          <el-avatar :size="64" :src="user.headUrl | urlFormat2" :key="user.id"></el-avatar>
        </el-col>
        <el-col :span="8">
          <span style="font-size: 1.6rem">{{ user.nick }}</span>
          &nbsp;
          <!--    性别图标 -->
          <i class="el-icon-female el-icon" style="color:#FF758F" v-if="user.sex"></i>
          <i class="el-icon-male el-icon" style="color:#5FD4F2;" v-else></i>
          <div class="sign">
            <p style="color: #D6DEE4" title="个性签名">{{ user.sign }}</p>
          </div>
        </el-col>
        <el-col :span="2" :offset="11" v-if="$store.state.user != null">
          <el-button :type="isAttention ? 'success' : 'danger'" @click="togAtt">
            {{ isAttention ? '已关注' : '关注' }}
          </el-button>
        </el-col>
        <el-col :span="2" :offset="11" v-else>
          <el-button v-if="$store.state.user == null" type="primary" disabled>未登录</el-button>
        </el-col>
      </el-row>
    </div>
    <!--  中间文字  -->
    <div class="middle">
      <el-row>
        <el-col :span="2">
          <i class="el-icon-video-camera" style="color: #00C091;margin: 4px"></i>
          他的视频
        </el-col>
        <el-col :span="3" :offset="18" style="line-height: 200%;font-size: 1.4rem">
          <p>粉丝数</p>
          <span>{{ user.fansCount }}</span>
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 2rem">
      <el-row class="topMenu" v-show="true">
        <!--    搜索框    -->
        <el-col :span="3" :offset="15">
          <el-input size="small" placeholder="搜索视频" prefix-icon="el-icon-search" v-model="keyWord" @keyup.enter.native="search"></el-input>
        </el-col>
        <el-col :span="1" :offset="1" ref="col1" @click.native="sort('uploadTime', $event)">
          最新上传
        </el-col>
        <el-col :span="1" :offset="1" ref="col2" @click.native="sort('playCount', $event)">
          最多播放
        </el-col>
      </el-row>
      <div>
        <VideoList :videos="videos">
          <template v-slot:pagination>
            <el-pagination
              background
              :current-page="page"
              layout="prev, pager, next,total"
              :total="count"
              :page-size="10"
              @current-change="handleCurrent"
              hide-on-single-page
            ></el-pagination>
          </template>
        </VideoList>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserById, isAttention, addAttention, cancelAttention, getVideoPageByUser, searchCount } from '../../api/user'
import VideoList from '../../components/videoList'
import { mapState } from 'vuex'
export default {
  components: { VideoList },
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      id: '',
      user: {},
      page: 1,
      sortBy: '',
      //搜索内容
      keyWord: '',
      videos: [],
      count: 0,
      attentionList: [],
      isAttention: true
    }
  },
  methods: {
    //切换 关注
    async togAtt() {
      //取消关注
      if (this.isAttention == true) {
        let result = await cancelAttention({ userId: this.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
        console.log(result)
        if (result.code == 200) {
          this.isAttention = false
          this.user.fansCount = this.user.fansCount - 1
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      } else {
        //添加关注
        let result = await addAttention({ userId: this.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
        if (result.code == 200) {
          this.isAttention = true
          this.user.fansCount = this.user.fansCount + 1
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      }
    },
    handleCurrent(page) {
      this.page = page
      this.init(page, this.keyWord, this.sortBy)
    },
    search() {
      // 重置样式
      this.$refs.col1.$el.className = 'el-col el-col-1 el-col-offset-1'
      this.$refs.col2.$el.className = 'el-col el-col-1 el-col-offset-1'
      if (!this.keyWord.trim()) {
        this.keyWord = ''
      }
      this.init(1, this.keyWord)
      this.page = 1
      this.sortBy = ''
    },
    sort(key, eve) {
      // 重置样式
      this.$refs.col1.$el.className = 'el-col el-col-1 el-col-offset-1'
      this.$refs.col2.$el.className = 'el-col el-col-1 el-col-offset-1'
      eve.target.className += ' active'
      this.sortBy = key
      this.init(1, this.keyWord, key)
      this.page = 1
    },
    async init(page = 1, keyWord = '', sortBy = '') {
      this.id = this.$route.params.id
      //获取当前用户的信息
      let result = await getUserById(this.id, this.$store.state.user.token)
      this.user = result.data
      if (this.$store.state.user != null) {
        //是不是关注了
        result = await isAttention({ userId: this.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
        if (result.code == 200) {
          this.isAttention = result.data
        }
      }
      //获取该用户上传了的video
      result = await getVideoPageByUser({ userId: this.user.id, page, words: keyWord, sortBy }, this.$store.state.user.token)
      this.videos = result.data
      let countResult = await searchCount({ userId: this.user.id, words: keyWord }, this.$store.state.user.token)
      this.count = countResult.data
    }
  },
  created() {
    if (this.$route.params.id == this.$store.state.user.id) {
      this.$router.replace('/mine')
    }
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
}
/*点击后显示的样式*/
.active {
  color: #00a1d6;
  border-bottom: 1px solid #00a1d6;
}
.topMenu {
  margin-bottom: 2rem;
  text-align: center;
  line-height: 42px;
  .el-col:not(:first-child) {
    cursor: pointer;
  }
}
.el-icon-delete {
  margin-top: 0.8rem;
  cursor: pointer;
  &:hover {
    color: #00a1d6;
  }
  &:before {
    margin-right: 4px;
  }
}
</style>
