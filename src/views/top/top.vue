<template>
  <div>
    <router-link :to="`/detail/${video.id}`" v-for="(video, index) in videos" :key="video.id" class="item">
      <el-row type="flex" align="middle">
        <el-col :span="2">
          <div class="num">{{ index + 1 }}</div>
        </el-col>
        <el-col :span="6"><img :src="(video.type + '/' + video.imageName) | urlFormat" width="240px" height="135px"/></el-col>
        <!-- 标题 -->
        <el-col :span="8" :offset="1">
          <h3 class="title">{{ video.title }}</h3>
          <p style="margin-top:15px;color:#99A2AA">
            <el-avatar icon="el-icon-user-solid" :size="48" :src="video.author.headUrl | urlFormat2"></el-avatar>
            <span style="line-height: 48px;vertical-align:text-bottom">&nbsp;{{ video.author.nick }}</span>
          </p>
        </el-col>
        <el-col :span="5" :offset="2">
          <div style="color:#00A1D6">{{ video.playCount }}次播放</div>
        </el-col>
      </el-row>
    </router-link>
  </div>
</template>
<script>
import { top } from '../../api/video'
export default {
  data() {
    return {
      videos: []
    }
  },
  methods: {
    async init() {
      let result = await top(this.$store.state.user.token)
      this.videos = result.data
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/* 排行项目 */
.item {
  display: block;
  margin: 20px 0;
  height: 160px;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  &:hover {
    transition: 0.2s;
    box-shadow: 5px 5px 5px #dadada;
  }
  img {
    border-radius: 0.4rem;
    &:hover {
      transition: 0.2s;
      transform: scale(1.1);
    }
  }
  .el-row {
    height: 100%;
    .num {
      color: #b8c0cc;
      font-size: 30px;
    }
    .title {
      font-weight: bold;
      /* 超出宽度不换行显示省略号*/
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
