<template>
  <div>
    <div class="player-bg"></div>
    <el-row style="height: 90vh" type="flex" align="middle">
      <el-col class="player-col">
        <el-row class="live-info">
          <el-col :span="2">
            <router-link to="/">
              <el-avatar
                :src="live.user.headUrl | urlFormat"
                icon="el-icon-user-solid"
                :size="64"
                shape="square"
              ></el-avatar>
            </router-link>
          </el-col>
          <el-col :span="22">
            <h2>{{ live.title }}</h2>
            <div style="margin-top: 1rem">
              <router-link :to="`/user/${live.user._id}`">{{ live.user.nick }}</router-link>
            </div>
          </el-col>
        </el-row>
        <d-player class="player" :options="options" ref="player"></d-player>
      </el-col>
      <el-col class="danmu-col">
        <h3>弹幕列表</h3>
        <div class="danmu-box">
          <div class="danmu" ref="dan">
            <p v-for="msg in message" :key="msg._id">
              <span :style="`color: ${userId === msg.id ? '#FF5D23' : '#00A1D6'}`">{{ msg.nick }}:</span>
              {{ msg.msg }}
            </p>
          </div>
          <div class="text-area">
            <el-input
              type="textarea"
              placeholder="发送弹幕"
              @keyup.enter.native="sendDanMu"
              resize="none"
              rows="3"
              show-word-limit
              v-model="textarea"
              maxlength="20"
            ></el-input>
            <div style=" text-align: end">
              <el-button type="primary" :disabled="!userId" size="small" @click="sendDanMu">
                {{ userId ? '发送' : '未登录' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
import { getLiveById } from '../../api/live'
import { getUserHeadUrl } from '../../api/user'
import { mapState } from 'vuex'
export default {
  components: {
    'd-player': VueDPlayer,
  },
  computed: {
    ...mapState(['userId']),
  },
  name: 'online',
  data() {
    return {
      live: {},
      textarea: '',
      ws: {},
      options: {
        live: true,
        autoplay: true,
        danmaku: true,
        apiBackend: {
          read: function(endpoint, callback) {
            callback()
          },
        },
        video: {
          url: '',
          type: 'flv',
        },
      },
      nick: '',
      message: [],
    }
  },
  methods: {
    sendDanMu() {
      if (!this.userId) return this.$message.error('未登录')
      if (this.textarea.trim()) {
        this.ws.send(JSON.stringify({ id: this.userId, nick: this.nick, msg: this.textarea }))
      } else this.$message.error('请输入弹幕')
      this.textarea = ''
    },
    initWebSocket(wsUrl) {
      this.ws = new WebSocket(wsUrl)
      this.ws.onmessage = msg => {
        let result = JSON.parse(msg.data)
        this.message.push(result)
        this.$nextTick(() => {
          this.$refs.dan.scrollTop = this.$refs.dan.scrollHeight
        })
        this.$refs.player.dp.danmaku.draw({
          text: result.msg,
          color: result.id === this.userId ? '#00CCFF' : '#fff',
          type: 'right',
        })
      }
    },
    async init() {
      let { _id } = this.$route.params
      this.live = (await getLiveById(_id)).data
      this.options.video.url = 'http://localhost:8000' + this.live.playUrl
      let wsUrl = 'ws://localhost:8080?room=' + this.live.user._id
      this.initWebSocket(wsUrl)
      if (this.userId) {
        let result = await getUserHeadUrl(this.userId)
        this.nick = result.data.nick
      }
    },
  },
  created() {
    this.init()
  },
  //创建前设置样式
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'overflow: hidden;')
  },
  //销毁前清除
  beforeDestroy() {
    document.querySelector('body').removeAttribute('style')
  },
}
</script>
<style lang="scss" scoped>
.player-bg {
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  background: url('./onlineBg.jpg') no-repeat fixed left top/100% 100%;
}
.player-col {
  height: 70rem;
  width: 104rem;
  border-radius: 8px;
  .live-info {
    background-color: white;
    padding: 3rem 2rem 1rem;
    border-radius: 8px 8px 0 0;
  }
  /*在scoped的情况下使用/deep/ 修改封装好的样式*/
  .player /deep/ {
    width: 104rem;
    height: 58.5rem;
    .dplayer-comment {
      display: none;
    }
    .dplayer-danmaku-item {
      font-size: 2.5rem;
      font-weight: bold;
    }
  }
}
.danmu-col {
  height: 69rem;
  background-color: white;
  border-radius: 8px;
  margin-left: 2rem;
  h3 {
    margin: 1rem;
  }
  .danmu-box {
    border-top: 1px solid #e9eaec;
    background-color: #f8f8f8;
    height: 94%;
    border-radius: 0 0 8px 8px;
    .text-area {
      padding: 1rem;
      .el-button {
        margin-top: 1rem;
      }
    }
    .danmu {
      height: 50rem;
      overflow: auto;
      padding: 0 0 1rem 1rem;
      p {
        font-size: 1.2rem;
        line-height: 2em;
        color: #646c7a;
      }
    }
  }
}
</style>
