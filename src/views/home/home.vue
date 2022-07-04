<template>
  <div>
    <!-- 轮播图 -->
    <div class="carousel">
      <el-carousel height="300px">
        <el-carousel-item
          v-for="item in lunbo"
          :key="item.id"
          :label="item.title"
          @click.native="goto(item.id)"
          :style="`background: url(${url}/video/imageController/getVideoImage/${item.type}/${item.imageName}) no-repeat center/100%;cursor: pointer;`"
        ></el-carousel-item>
      </el-carousel>
    </div>
    <!-- 顶部分类 -->
    <div>
      <el-row type="flex" justify="space-around">
        <el-col :span="2" v-for="(type, index) in types" :key="index">
          <el-button size="medium" @click="getPageByType(index)">{{ type.name }}</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 中间视频列表 -->
    <div class="middle">
      <!-- 标题 -->
      <div class="title">
        <span class="el-icon-video-camera-solid"></span>
        推荐
      </div>
      <!-- 视频列表 -->
      <VideoList :videos="videos" :showAuthor="true">
        <template v-slot:pagination>
          <el-pagination
            background
            :current-page="page"
            layout="prev, pager, next,total"
            :total="count"
            :page-size="pageSize"
            @current-change="handleCurrent"
            hide-on-single-page
          ></el-pagination>
        </template>
      </VideoList>
    </div>
    <!-- 末尾直播 -->
    <div v-show="livesCount">
      <div class="title">
        <span class="el-icon-time"></span>
        直播
      </div>
      <LiveList :lives="lives">
        <template v-slot:pagination>
          <el-pagination
            background
            :current-page="livePage"
            layout="prev, pager, next,total"
            :total="livesCount"
            :page-size="1"
            @current-change="handLivePage"
            hide-on-single-page
          ></el-pagination>
        </template>
      </LiveList>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import VideoList from '@/components/videoList'
import LiveList from '@/components/liveList'
import { getVideoPage, getvideoCountByType, recommend } from '../../api/video'
import { getAlltype } from '../../api/type'
import { getOnLive } from '../../api/live'
import { url } from '../../api/ajax'
export default {
  name: 'Home',
  components: { VideoList, LiveList },
  data() {
    return {
      url: url,
      livePage: 1,
      lives: [],
      livesCount: 0,
      type: '',
      pageSize: 10,
      types: [
        // 视频分类
        {
          name: '生活'
        },
        {
          name: '科技'
        },
        {
          name: '游戏'
        },
        {
          name: '校园'
        },
        {
          name: '教育'
        },
        {
          name: '动物'
        },
        {
          name: '其他'
        },
        {
          name: '重置'
        }
      ],
      lunbo: [],
      videos: [],
      page: 1,
      count: 0
    }
  },
  computed: {},
  methods: {
    async handLivePage(page) {
      this.livePage = page
      let result = await getOnLive(page)
      this.lives = result.data.lives
      this.livesCount = result.data.count
    },
    goto(id) {
      this.$router.push('/detail/' + id)
    },
    async getPageByType(type) {
      this.page = 1
      this.type = type + 1
      if (type == 7) {
        this.type = ''
      }
      let result = await getVideoPage(this.page, this.type, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      } else {
        this.$message.error(result.message)
      }
      let count = await getvideoCountByType(this.type, this.$store.state.user.token)
      this.count = count.data
    },
    async handleCurrent(page) {
      this.page = page
      let result = await getVideoPage(this.page, this.type, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      } else {
        this.$message.error(result.message)
      }
      let count = await getvideoCountByType(this.type, this.$store.state.user.token)
      this.count = count.data
    },
    async init() {
      if (this.$store.state.user == null) {
        this.$message.error('请先登入后在观看')
        await this.$router.push('/login')
        return
      }
      let lunBo = await recommend(this.$store.state.user.token)
      if (lunBo.code == 200) {
        this.lunbo = lunBo.data
      }
      let types = await getAlltype(this.$store.state.user.token)
      if (types.code == 200) {
        let length = types.data.length
        this.types = []
        for (let i = 0; i < length; i++) {
          this.types.push({ name: types.data[i] })
        }
        this.types.push({ name: '全部' })
      }
      let result = await getVideoPage(1, this.type, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      } else {
        this.$message.error(result.message)
      }
      let count = await getvideoCountByType(this.type, this.$store.state.user.token)
      if (count.code == 200) {
        this.count = count.data
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
// 轮播图
.carousel {
  margin-bottom: 20px;
}
.title {
  width: 300px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  line-height: 50px;
  span {
    margin-right: 10px;
  }
}
</style>
