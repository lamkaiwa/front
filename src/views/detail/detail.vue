/* eslint-disable no-undef */
<template>
  <div style="margin-bottom: 8rem">
    <!--    video顶部信息-->
    <el-row style="padding: 2rem 0">
      <el-col :span="18">
        <div class="videoTop">
          <h2>{{ video.title }}</h2>
          <p>
            <span>{{ video.type | videoTypeFormat }}</span>
            <span style="padding-left: 1rem">{{ video.uploadTime | fullDateFormat }}</span>
          </p>
          <p>{{ video.playCount }} 播放 ·</p>
        </div>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" align="middle" class="userInfo">
          <el-col :span="4">
            <router-link :to="`/user/${video.author.id}`">
              <el-avatar icon="el-icon-user-solid" :size="64" :src="video.author.headUrl | urlFormat2" :key="video.author.headUrl"></el-avatar>
            </router-link>
          </el-col>
          <el-col :span="18" :offset="2">
            <router-link :to="`/user/${video.author.id}`">{{ video.author.nick }}</router-link>
            <p class="sign" :title="video.author.sign">{{ video.author.sign }}</p>
            <el-button v-if="$store.state.user == null" type="warning" size="small" disabled title="登录可关注">未关注</el-button>
            <el-button v-else-if="$store.state.user.id != video.author.id" size="small" :type="isAttention ? 'success' : 'danger'" @click="togAtt">
              {{ isAttention ? '已关注' : '关注' }}
            </el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!--   视频 -->
    <el-row>
      <el-col :span="17">
        <!--        播放器-->
        <div class="player">
          <video id="video" class="video-js vjs-default-skin vjs-big-play-centered" controls preload="none"></video>
        </div>
        <!--      点赞收藏  -->
        <div class="zan">
          <span :class="isZan == true ? 'color-true' : 'color-false'" title="点赞" @click="support">
            <i class="el-icon-circle-check">{{ zanListLength }}</i>
          </span>
          <span :class="isCollect == true ? 'color-true' : 'color-false'" title="收藏" @click="collect">
            <i class="el-icon-star-off">{{ collectionListLength }}</i>
          </span>
        </div>
        <!--      详情  -->
        <div class="info">
          <div ref="infoDiv">
            {{ video.desc }}
          </div>
          <div class="more" @click="toggle">{{ more ? '展开更多' : '收起' }}</div>
        </div>
        <!--     写评论   -->
        <div disabled>
          <el-row type="flex" align="middle">
            <el-col :span="2">
              <el-avatar icon="el-icon-user-solid" :size="48" :src="$store.state.user.headUrl" :key="$store.state.user.headUrl"></el-avatar>
            </el-col>
            <el-col :span="18">
              <el-input type="textarea" v-model="content" rows="3" placeholder="在这里写点什么吧！"></el-input>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button @click="send" type="primary" :disabled="!$store.state.user">
                {{ $store.state.user ? '发表评论' : '未登录' }}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22" :push="2" style="margin: 1.5rem 0;border-top: 1px solid #E5E9EF;"></el-col>
          </el-row>
        </div>
        <!--     评论列表   -->
        <div>
          <!--      一条评论    -->
          <el-row class="comment" v-for="(comment, index) in commentList" :key="comment.id">
            <el-col :span="2">
              <router-link :to="`/user/${comment.author.id}`">
                <el-avatar icon="el-icon-user-solid" :size="48" :src="comment.author.headUrl | urlFormat2" :key="comment.author.headUrl"></el-avatar>
              </router-link>
            </el-col>
            <el-col :span="22" class="item" style="border-bottom: 1px solid #E5E9EF;padding-bottom: 1rem;margin-bottom: 1rem">
              <router-link :to="`/user/${comment.author.id}`">
                <b>{{ comment.author.nick }}</b>
              </router-link>
              <div>{{ comment.content }}</div>
              <p>
                <span>{{ comment.date | fullDateFormat }}</span>
                <span v-show="$store.state.user != null">
                  <span v-if="comment.author.id !== $store.state.user.id" @click="showArea(comment.author, index, comment.content)" class="replySpan">
                    回复
                  </span>
                  <span v-else @click="deleteContent(comment.id)" class="replySpan">删除</span>
                </span>
              </p>
              <!--          一条回复    -->
              <el-row v-for="item in showAllReply[index] ? comment.replyList : comment.replyList.slice(0, 3)" :key="item.id" style="margin: 0;">
                <el-col :span="1">
                  <router-link :to="`/user/${item.from.id}`">
                    <el-avatar icon="el-icon-user-solid" :size="24" :src="item.from.headUrl | urlFormat2" :key="item.from.headUrl"></el-avatar>
                  </router-link>
                </el-col>
                <el-col :span="23">
                  <router-link :to="`/user/${item.from.id}`">
                    <b>{{ item.from.nick }}</b>
                  </router-link>
                  <span style="font-size: 1.2rem;margin: 0 0.4rem">回复</span>
                  <router-link :to="`/user/${item.to.id}`">
                    <b>@{{ item.to.nick }}</b>
                  </router-link>
                  <span style="margin-left: 1rem">{{ item.content }}</span>
                  <p>
                    <span>{{ item.date | fullDateFormat }}</span>
                    <span v-show="$store.state.user != null">
                      <span v-if="item.from.id !== $store.state.user.id" @click="showArea(item.from, index, item.content)" class="replySpan">
                        回复
                      </span>
                      <span v-else @click="deleteContent(comment.id, item.id)" class="replySpan">删除</span>
                    </span>
                  </p>
                </el-col>
              </el-row>
              <p class="toggle" v-if="comment.replyList.length > 3">
                共
                <b>{{ comment.replyList.length }}</b>
                条回复,
                <span style="margin-left: 0.8rem;color: #00A1D6" @click="showReply(index, $event)" class="replySpan">
                  点击查看
                </span>
              </p>
              <!--             动态显示回复框 -->
              <div v-if="isReply[index]">
                <el-row type="flex" align="middle">
                  <el-col :span="2" :pull="2">
                    <el-avatar :size="48" icon="el-icon-user-solid" :src="$store.state.user.headUrl"></el-avatar>
                  </el-col>
                  <el-col :span="20" :pull="2">
                    <el-input type="textarea" v-model="replyContent" rows="3" :placeholder="`回复@${who.nick}`"></el-input>
                  </el-col>
                  <el-col :span="2" :pull="1">
                    <el-button type="primary" :disabled="$store.state.user == null" @click="sendReply(comment.id)">
                      {{ $store.state.user != null ? '回复' : '未登录' }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-row></el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6" :offset="1">
        <h3 style="padding-bottom: 2rem">推荐</h3>
        <VideoList :videos="recommendvideos" :showAuthor="true" />
      </el-col>
    </el-row>
    <!-- 图片缩图 -->
    <div class="demo-image" ref="image">
      <div class="block" v-for="fit in fits" :key="fit">
        <el-image style="width: 200px; height: 200px" :src="smallPic" :fit="fit"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import VideoList from '../../components/videoList'
import {
  getVideoByVideoId,
  updateVideoPlayCount,
  getVideoInfo,
  readVideoBlock,
  getImageBytesOnSpecifiedTime,
  isZan,
  isCollectionList,
  addZan,
  addCollection,
  deleteZan,
  deleteCollection,
  getRecommendVideoByWord
} from '../../api/video'
import { isAttention, addAttention, cancelAttention, getVideoComments, sendComment, getCommentCount, addReply, deleteCommentAndReply } from '../../api/user'
export default {
  components: {
    VideoList
  },
  watch: {
    // 监听路由是否变化
    $route(to, from) {
      if (to.params.id != from.params.id) {
        this.init(to.params.id) // 重新调用加载数据方法
        location.reload()
      }
    }
  },
  data() {
    return {
      commentCount: 0,
      replyContent: '',
      who: {},
      heSay: '',
      isReply: [],
      showAllReply: [],
      content: '',
      recommendvideos: [],
      collectionListLength: 10,
      zanListLength: 10,
      isZan: true,
      isCollect: true,
      //videojs
      myPlayer: null,
      //video blob src
      videoSrc: null,
      //缩图的url
      smallPic: null,
      //缩图的格式
      fits: ['fill'],
      //弹幕视频配置
      options: {
        video: {
          url: './leolam.mp4'
        },
        playbackSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
        hotkey: true,
        theme: '#00A1D6',
        lang: 'zh-cn',
        screenshot: true
      },
      page: 1,
      commentList: [],
      video: {
        author: {
          id: 1
        }
      },
      more: true,
      player: null,
      isAttention: false
    }
  },
  methods: {
    async sendReply(commentId) {
      if (!this.replyContent.trim()) {
        this.replyContent = ''
        return this.$message.error('请输入内容')
      }
      let addReplyRes = await addReply(
        { comment: commentId, user: this.who.id, you: this.$store.state.user.id, youSay: this.replyContent, content: this.heSay },
        this.$store.state.user.token
      )
      if (addReplyRes.code == 200) {
        let videoCommentRes = await getVideoComments(this.video.id, this.$store.state.user.token)
        if (videoCommentRes.code == 200) {
          this.commentList = videoCommentRes.data
        }
        let getCommentCountRes = await getCommentCount(this.video.id, this.$store.state.user.token)
        if (getCommentCountRes.code == 200) {
          this.commentCount = getCommentCountRes.data
        }
        this.isReply = new Array(this.commentList.length).fill(false)
        this.replyContent = ''
        this.$message.success('回复信息成功')
      } else {
        this.$message.error('回复信息失败')
      }
    },
    //显示所有回复
    showReply(index, event) {
      event.path[1].style.display = 'none'
      this.$set(this.showAllReply, index, true)
    },
    //  显示回复文本域
    showArea(who, tag, heSay) {
      for (let i = 0; i < this.isReply.length; i++) {
        this.$set(this.isReply, i, false)
      }
      this.isReply[tag] = true
      this.who = who
      this.heSay = heSay
    },
    //删除评论
    async deleteContent(contentId, replyId) {
      if (replyId == undefined) replyId = ''
      let deleteCommentAndReplyRes = await deleteCommentAndReply(contentId, replyId, this.$store.state.user.token)
      if (deleteCommentAndReplyRes.code == 200) {
        let videoCommentRes = await getVideoComments(this.video.id, this.$store.state.user.token)
        if (videoCommentRes.code == 200) {
          this.commentList = videoCommentRes.data
        }
        let getCommentCountRes = await getCommentCount(this.video.id, this.$store.state.user.token)
        if (getCommentCountRes.code == 200) {
          this.commentCount = getCommentCountRes.data
        }
        this.isReply = new Array(this.commentList.length).fill(false)
        this.$message.success('评论删除成功')
      } else {
        this.$message.error('评论删除失败')
      }
    },
    async init(id) {
      //获取视频信息
      let videoRes = await getVideoByVideoId(id, this.$store.state.user.token)
      if (videoRes.code == 200) {
        this.video = videoRes.data
        this.zanListLength = this.video.zanCount
        this.collectionListLength = this.video.collectCount
      }
      //获取推荐视频
      let recommendvideosRes = await getRecommendVideoByWord(this.video.title, this.video.desc, this.$store.state.user.token)
      if (recommendvideosRes.code == 200) {
        this.recommendvideos = recommendvideosRes.data
      }
      //增加播放量
      await updateVideoPlayCount(this.video.id, this.$store.state.user.token)
      //视频初始化
      this.createVideo()
      let isZanRes = await isZan({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
      if (isZanRes.code == 200) this.isZan = isZanRes.data
      let isCollectionListRes = await isCollectionList({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
      if (isCollectionListRes.code == 200) this.isCollect = isCollectionListRes.data
      //是不是关注了
      let result = await isAttention({ userId: this.video.author.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
      if (result.code == 200) {
        this.isAttention = result.data
      }
      let videoCommentRes = await getVideoComments(this.video.id, this.$store.state.user.token)
      if (videoCommentRes.code == 200) {
        this.commentList = videoCommentRes.data
      }
      let getCommentCountRes = await getCommentCount(this.video.id, this.$store.state.user.token)
      if (getCommentCountRes.code == 200) {
        this.commentCount = getCommentCountRes.data
      }
      this.isReply = new Array(this.commentList.length).fill(false)
      this.showAllReply = new Array(this.commentList.length).fill(false)
    },
    async togAtt() {
      //取消关注
      if (this.isAttention == true) {
        let result = await cancelAttention({ userId: this.video.author.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
        if (result.code == 200) {
          this.isAttention = false
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      } else {
        //添加关注
        let result = await addAttention({ userId: this.video.author.id, fans: this.$store.state.user.id }, this.$store.state.user.token)
        if (result.code == 200) {
          this.isAttention = true
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      }
    },
    //发表评论
    async send() {
      if (!this.content.trim()) {
        this.content = ''
        return this.$message.error('请输入内容')
      }
      let result = await sendComment({ videoId: this.video.id, author: this.$store.state.user.id, content: this.content }, this.$store.state.user.token)
      if (result.code == 200) {
        this.$message.success('发送评论成功')
        let videoCommentRes = await getVideoComments(this.video.id, this.$store.state.user.token)
        if (videoCommentRes.code == 200) {
          this.commentList = videoCommentRes.data
        }
        let getCommentCountRes = await getCommentCount(this.video.id, this.$store.state.user.token)
        if (getCommentCountRes.code == 200) {
          this.commentCount = getCommentCountRes.data
        }
        this.content = ''
      } else {
        this.$message.error('发送评论失败,请刷新再试')
      }
    },
    toggle() {
      //展开更多
      if (this.more) {
        this.$refs.infoDiv.style.height = 'auto'
      }
      //收起
      else {
        this.$refs.infoDiv.style.height = '2rem'
      }
      this.more = !this.more
    },
    //点赞
    async support() {
      if (this.isZan) {
        //取消点赞
        let deleteZanRes = await deleteZan({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
        if (deleteZanRes.code == 200) {
          this.zanListLength = this.zanListLength - 1
          this.$message.success('取消点赞成功')
        }
      } else {
        let addZanRes = await addZan({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
        if (addZanRes.code == 200) {
          this.zanListLength = this.zanListLength + 1
          this.$message.success('点赞成功')
        }
        //点赞
      }
      this.isZan = !this.isZan
    },
    //收藏
    async collect() {
      if (this.isCollect) {
        //取消收藏
        let deleteCollectionRes = await deleteCollection({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
        if (deleteCollectionRes.code == 200) {
          this.collectionListLength = this.collectionListLength - 1
          this.$message.success('取消收藏成功')
        }
      } else {
        //添加收藏
        let addCollectionRes = await addCollection({ videoId: this.video.id, userId: this.$store.state.user.id }, this.$store.state.user.token)
        if (addCollectionRes.code == 200) {
          this.collectionListLength = this.collectionListLength + 1
          this.$message.success('收藏成功')
        }
      }
      this.isCollect = !this.isCollect
    },
    async createVideo() {
      let that = this
      let videoInfoRes = await getVideoInfo(this.video.type, this.video.videoName, this.$store.state.user.token)
      // eslint-disable-next-line no-unused-vars
      let videoInfo = null
      if (videoInfoRes.code == 200) {
        videoInfo = videoInfoRes.data
      }
      //播放器
      let ms = new MediaSource()
      this.videoSrc = URL.createObjectURL(ms)
      //视频解码信息
      let encode = videoInfo.mimeType + '; ' + 'codecs=' + videoInfo.codes
      //播放器流
      let buffer = null
      let canAdd = true
      //buffer存储队列
      let bufferList = []
      //提前多少秒获取数据
      let readSize = 60
      this.myPlayer = this.$videojs(
        'video',
        {
          //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
          controls: true,
          //自动播放属性,muted:静音播放
          muted: false,
          autoplay: true,
          //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
          preload: 'auto',
          //设置视频播放器的显示宽度（以像素为单位）
          width: '100%',
          //设置视频播放器的显示高度（以像素为单位）
          height: '100%',
          // url
          poster: this.videoImg, // 封面图片
          sources: [
            {
              src: this.videoSrc,
              type: 'video/mp4'
            }
          ],
          playbackRates: [0.5, 1, 1.5, 2, 3] //倍速播放∂
        },
        function onPlayerReady() {
          // eslint-disable-next-line no-unused-vars
          var player = this
          //获取video对象
          let video = document.getElementById('video_html5_api')
          //显示缩图
          displaySmallPic()
          video.onkeydown = function(e) {
            if (e.keyCode == 39) {
              let time = video.currentTime + 5
              if (time >= videoInfo.videoTime) video.currentTime = videoInfo.videoTime - 1
              else video.currentTime = time
            }
            if (e.keyCode == 37) {
              let time = video.currentTime - 5
              if (time < 0) video.currentTime = 0
              else video.currentTime = time
            }
          }

          ms.addEventListener('sourceopen', async function() {
            //buffer流
            buffer = ms.addSourceBuffer(encode)
            //buffer添加完毕的监听函数

            //buffer添加完成执行
            buffer.onupdateend = function() {
              if (bufferList.length == 0) {
                canAdd = true
              } else addNextBuffer()
            }
            //添加首段buffer
            await addBuffer(that.video.type, that.video.videoName, 0, buffer)
            await addBuffer(that.video.type, that.video.videoName, 1, buffer)
          })
          function displaySmallPic() {
            // progress control bar element
            var controlBar = $('.vjs-progress-control')[0]
            let TIME = -1
            let timer = null
            //监听control bar
            controlBar.addEventListener('mousemove', async function(e) {
              //controlbar上的文字
              var timeBar = $(this).find('.vjs-mouse-display .vjs-time-tooltip')
              let time = timeBar.text()
              if (time == TIME || time == '') return
              TIME = time
              let image = that.$refs.image
              image.style.display = 'none'
              clearTimeout(timer)
              timer = setTimeout(function() {
                let time1 = setTimeFormality(time)
                let type = that.video.type
                let videoName = that.video.videoName
                getImage(type, videoName, true, that, time1)
                moveSmallPic(that, e)
              }, 100)

              controlBar.addEventListener('mouseleave', function() {
                let image = that.$refs.image
                image.style.display = 'none'
              })
            })
          }
          this.on('seeking', async function() {
            let time = video.currentTime
            let curBlock = false
            let videoBuffer = video.buffered
            for (let i = 0; i < videoBuffer.length; i++) {
              let start = videoBuffer.start(i)
              let end = videoBuffer.end(i)
              //  console.log("进度条事件：" + time + "block:" + i + "blockStart:" + start + " " + "blockEnd:" + end + "blockLength:" + videoBuffer.length);
              if (time >= start && time <= end) {
                curBlock = true
              }
            }
            if (!curBlock) {
              await addBuffer(that.video.type, that.video.videoName, Math.floor(time / readSize) + 1, buffer)
            }
          })
          //时间更变事件
          this.on('timeupdate', async function() {
            //播放完毕后回到0
            let time = video.currentTime
            if (time > videoInfo.videoTime) {
              video.currentTime = 0
              this.pause()
              return
            }
            let nextBlock = false
            let videoBuffer = video.buffered
            // eslint-disable-next-line no-unused-vars
            let start = 0
            let end = 0
            for (let i = 0; i < videoBuffer.length; i++) {
              start = videoBuffer.start(i)
              end = videoBuffer.end(i)
              if (time <= end - readSize) {
                nextBlock = true
              }
            }
            if (!nextBlock) {
              if (time + readSize <= videoInfo.videoTime) {
                await addBuffer(that.video.type, that.video.videoName, Math.ceil((time + readSize) / readSize), buffer)
              }
            }
          })
        }
      )

      function moveSmallPic(vue) {
        //image element
        //image element
        let image = vue.$refs.image

        var timeBar = $('.vjs-mouse-display .vjs-time-tooltip')
        var offset = timeBar.offset()
        // // modify image possition
        image.style.top = offset.top - 200 + 'px'
        image.style.left = offset.left - 80 + 'px'
        image.style.display = 'block'
      }

      function setTimeFormality(time) {
        //09:08:20 to xxx
        var temp = null
        // format: 09
        if (/^\d+$/.test(time)) {
          // re-format to: 0:0:09
          time = '0:0:' + time
        }
        // format: 1:09
        else if (/^\d+:\d+$/.test(time)) {
          // re-format to: 0:1:09
          time = '0:' + time
        }
        temp = time.split(':')
        // calculating to get seconds
        time = +temp[0] * 60 * 60 + +temp[1] * 60 + +temp[2] + ''
        if (time == 'NaN') time = '0'
        return time
      }
      //添加下一个buffer
      function addNextBuffer() {
        buffer.appendBuffer(bufferList.shift())
      }
      async function getImage(dir, videoFileName, canSend, that, time) {
        if (canSend) {
          let blobData = await getImageBytesOnSpecifiedTime(dir, videoFileName, time, that.$store.state.user.token)
          console.log(blobData)
          that.smallPic = URL.createObjectURL(blobData)
        }
      }
      //添加buffer入口
      async function addBuffer(dir, videoName, block, buffer) {
        //发送请求获取视频byte
        let data = await readBlock(dir, videoName, block)
        //判断队列是否为空，空直接添加，不为空添加到队列中
        if (canAdd) {
          canAdd = false
          buffer.appendBuffer(data)
        } else {
          bufferList.push(data)
        }
      }
      //发送请求
      async function readBlock(dir, videoName, block) {
        let data = await readVideoBlock({ type: dir, videoName: videoName, block: block }, that.$store.state.user.token)
        return data
      }
    }
  },
  async created() {
    let { id } = this.$route.params
    if (id) this.init(id)
  },
  destroyed() {
    //销毁videojs
    this.myPlayer.dispose()
  }
}
</script>

<style lang="scss" scoped>
.videoTop {
  height: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  p {
    color: #999999;
    font-size: 1.2rem;
  }
}
.userInfo {
  height: 10rem;
  p {
    margin: 0.4rem 0;
    color: #999999;
    font-size: 1.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-button {
    width: 10rem;
  }
}
.player {
  height: 60rem;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  .dplayer /deep/ {
    width: 96rem;
    height: 54rem;
    .dplayer-danmaku-item {
      font-size: 2.5rem;
      font-weight: bold;
    }
  }
}
.zan {
  padding: 2rem 0;
  width: 100%;
  i:before {
    font-size: 2.5rem;
    vertical-align: sub;
    margin-right: 0.2rem;
  }
  .color-true {
    color: #00a1d6;
  }
  .color-false {
    color: #333;
  }
  span {
    margin-right: 2rem;
    cursor: pointer;
    display: inline-block;
    &:hover {
      color: #00a1d6;
    }
  }
}
#video {
  width: 100%;
  height: 100%;
}
.info {
  border-top: 1px solid #e5e9ef;
  border-bottom: 1px solid #e5e9ef;
  margin-bottom: 2rem;
  padding: 1.5rem 0;
  :first-child {
    height: 2rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  :last-child {
    cursor: pointer;
    color: #00a1d6;
  }
}
.comment {
  .item {
    b {
      color: #6d757a;
      font-size: 1.2rem;
      &:hover {
        color: #00a1d6;
      }
    }
    div {
      margin: 1rem 0 0.5rem;
    }
    p {
      margin: 0.8rem 0;
      color: #99a2aa;
      font-size: 1.2rem;
    }
    .replySpan {
      margin-left: 1.5rem;
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 4px;
      &:hover {
        color: #00a1d6;
        background-color: #e5e9ef;
      }
    }
    .toggle {
      color: #6d757a;
    }
  }
}
.demo-image {
  width: 200px;
  height: 200px;
  position: absolute;
  display: none;
  z-index: 2147483647;
}
</style>
