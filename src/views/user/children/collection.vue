<template>
  <div class="collect">
    <VideoList :videos="videos" :showAuthor="true">
      <template v-slot:option="video">
        <el-row>
          <el-col :span="6" :offset="17" class="el-icon-delete" style="font-size: 1.2rem" @click.native="cancel(video._id)">
            取消收藏
          </el-col>
        </el-row>
      </template>
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
</template>
<script>
import VideoList from '../../../components/videoList'
import { getCollectionVideoListByUserId, getAttentionCountByUserId, deleteCollectionListByVideoIdAndUserId } from '../../../api/video'
import { mapState } from 'vuex'
export default {
  name: 'myCollection',
  components: { VideoList },
  computed: {
    ...mapState(['userId'])
  },
  data() {
    return {
      page: 1,
      count: 0,
      videos: []
    }
  },
  methods: {
    cancel(_id) {
      this.$confirm('确定要取消吗?', '提示').then(async () => {
        let result = await deleteCollectionListByVideoIdAndUserId({ videoId: _id, userId: this.$store.state.user.id }, this.$store.state.user.token)
        if (result.code == 200) {
          this.init(this.page)
          this.$message.success(result.message)
        } else {
          this.$message.error(result.message)
        }
      })
    },
    //分页变化时
    handleCurrent(page) {
      this.page = page
      this.init(page)
    },
    async init(page = 1) {
      let result = await getCollectionVideoListByUserId(this.$store.state.user.id, page, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      }
      let countRes = await getAttentionCountByUserId(this.$store.state.user.id, this.$store.state.user.token)
      this.count = countRes.data
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
.collect {
  margin-top: 3rem;
  .el-row {
    margin-top: 0.8rem;
    font-size: 1.2rem;
    color: #999;
    .el-col:last-child {
      font-size: 1.4rem;
      color: #333;
      cursor: pointer;
      &:hover {
        color: #00a1d6;
      }
    }
    .el-icon-delete:before {
      margin-right: 4px;
    }
  }
}
</style>
