<template>
  <div class="list">
    <el-row>
      <el-col :span="4">综合排序</el-col>
      <el-col :span="4" ref="col1" @click.native="sort('playCount', $event)">最多播放</el-col>
      <el-col :span="4" ref="col2" @click.native="sort('uploadTime', $event)">最新上传</el-col>
    </el-row>
    <div style="height: 1px ;border-bottom: 2px solid #E5E9EF;margin: 2rem 0"></div>
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
</template>
<script>
import VideoList from '../../components/videoList'
import { search, searchCount } from '../../api/video'
export default {
  name: 'search',
  components: { VideoList },
  data() {
    return {
      keyWord: '',
      page: 1,
      videos: [],
      count: 0,
      sortBy: '',
      pageSize: 10
    }
  },
  methods: {
    //分页变化时
    handleCurrent(page) {
      this.page = page
      this.init(page, this.sortBy)
    },
    sort(key, eve) {
      // 重置样式
      this.$refs.col1.$el.className = 'el-col el-col-4'
      this.$refs.col2.$el.className = 'el-col el-col-4'
      eve.target.className += ' active'
      //根据关键字排序
      this.sortBy = key
      this.init(1, key)
      this.page = 1
    },
    async init(page = 1, sortBy = '') {
      let result = await search(this.keyWord, page, sortBy, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      }
      let res = await searchCount(this.keyWord, this.$store.state.user.token)
      if (res.code == 200) {
        this.count = res.data
      }
    }
  },
  created() {
    let { keyWord } = this.$route.query
    this.keyWord = keyWord
    this.init()
  },
  beforeRouteUpdate(to, from, next) {
    let { keyWord } = to.query
    this.keyWord = keyWord
    this.$refs.col1.$el.className = 'el-col el-col-4'
    this.$refs.col2.$el.className = 'el-col el-col-4'
    this.page = 1
    this.sortBy = ''
    this.init()
    next()
  }
}
</script>
<style lang="scss" scoped>
.list {
  margin-top: 3rem;
}
.el-row {
  width: 50rem;
  height: 3rem;
  text-align: center;
  line-height: 3rem;
  margin-bottom: 1rem;
  .el-col:first-child {
    background-color: #00a1d6;
    color: white;
    border-radius: 1rem;
  }
  .el-col:not(:first-child) {
    cursor: pointer;
  }
}
.active {
  color: #00a1d6;
}
</style>
