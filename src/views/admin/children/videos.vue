<template>
  <div id="video">
    <main>
      <div class="table">
        <el-table :data="videos" style="width: 100%">
          <el-table-column sortable prop="id" label="id"></el-table-column>
          <el-table-column sortable prop="author.email" label="作者邮箱"></el-table-column>
          <el-table-column sortable prop="title" label="标题"></el-table-column>
          <el-table-column label="类型">
            <template slot-scope="scope">
              {{ scope.row.type | videoTypeFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="描述"></el-table-column>
          <el-table-column label="上传时间">
            <template slot-scope="scope">
              {{ scope.row.uploadTime | fullDateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="封面">
            <template slot-scope="scope">
              <el-image
                style="width: 100px;height: 75px"
                fit="cover"
                :src="`${url}/video/imageController/getVideoImage/${scope.row.type}/${scope.row.imageName}`"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="playCount" label="播放数"></el-table-column>
          <el-table-column prop="zanCount" label="点赞数"></el-table-column>
          <el-table-column prop="collectCount" label="收藏数"></el-table-column>
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button @click="editVideo(scope.$index, scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteVideo(scope.$index, scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--        分页-->
        <el-pagination
          style="text-align: center;margin: 8px 0"
          background
          :current-page="page"
          layout="prev, pager, next,total"
          :total="count"
          :page-size="pageSize"
          @current-change="handleCurrent"
          hide-on-single-page
        ></el-pagination>
      </div>
      <div>
        <el-dialog title="编辑" :visible.sync="dialogFormVisible">
          <el-form :model="newVideo" label-width="80px">
            <el-form-item label="标题">
              <el-input v-model="newVideo.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="newVideo.type" autocomplete="off">
                <el-option v-for="(type, index) in types" :label="type" :value="index + 1" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="newVideo.desc" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="时间">
              <div class="block">
                <el-date-picker v-model="newVideo.uploadTime" type="datetime" placeholder="选择日期"> </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="播放数">
              <el-input v-model="newVideo.playCount" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </main>
  </div>
</template>
<script>
import { url } from '../../../api/ajax'
import { getVideosByPage, deleteVideo, getVideosCount } from '../../../api/user'
import { editVideo, getType } from '../../../api/video'
export default {
  name: 'User',
  data() {
    return {
      url: url,
      page: 1,
      count: 0,
      pageSize: 10,
      keyWords: '',
      videos: [],
      dialogFormVisible: false,
      newVideo: {},
      // 视频分类
      types: ['生活', '科技', '游戏', '校园', '教育', '动物', '其他']
    }
  },
  methods: {
    async submit() {
      let uploadAt = this.newVideo.uploadTime
      this.newVideo.uploadTime = uploadAt.getTime ? uploadAt.getTime() : uploadAt
      let result = await editVideo(this.newVideo, this.$store.state.user.token)
      if (result.code == 200) {
        this.dialogFormVisible = false
        this.$message.success('修改成功')
        location.reload()
      }
    },
    editVideo(index, video) {
      this.dialogFormVisible = true
      this.newVideo = video
    },
    deleteVideo(index, id) {
      this.$confirm('是否删除?', { type: 'warning' }).then(async () => {
        let result = await deleteVideo(id, this.$store.state.user.token)
        if (result.code == 200) {
          this.$message.success('删除视频成功')
          this.page = 1
          this.init()
        }
      })
    },
    handleCurrent(index) {
      this.page = index
      this.init()
    },
    async init() {
      let result = await getVideosByPage(this.page, this.$store.state.user.token)
      if (result.code == 200) {
        this.videos = result.data
      }
      let typeRes = await getType(this.$store.state.user.token)
      if (typeRes.code == 200) {
        this.types = typeRes.data
      }
      let videoRes = await getVideosCount(this.$store.state.user.token)
      if (videoRes.code == 200) {
        this.count = videoRes.data
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
#video {
  main {
    margin: 2rem;
    border-radius: 4px;
    background-color: white;
    padding: 1rem;
  }
}
</style>
