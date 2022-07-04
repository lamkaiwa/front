<template>
  <div>
    <div v-if="!live" class="live">
      <el-button type="primary" @click="open">开启直播功能</el-button>
    </div>
    <div v-else class="live-form">
      <el-form label-width="80px">
        <el-form-item label="推流地址">
          <p>{{ live.publishUrl | livePushFormat }}</p>
        </el-form-item>
        <el-form-item label="封面">
          <el-upload
            name="img"
            :action="'/upload/avatar' | urlFormat"
            :show-file-list="false"
            :on-success="success"
            :before-upload="beforeUpload"
            accept=".jpg,.jpeg,.png"
          >
            <img class="upload-img" :src="live.imgUrl | urlFormat" title="点击可上传" />
          </el-upload>
        </el-form-item>
        <el-form-item label="房间名">
          <el-input show-word-limit :maxlength="20" v-model="live.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">保存</el-button>
          <el-button type="danger" @click="closeLive">关闭直播功能</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getLive, addLive, deleteLive, updateLive } from '../../../api/live'
import { mapState } from 'vuex'
export default {
  name: 'live',
  computed: {
    ...mapState(['userId']),
  },
  data() {
    return {
      live: null,
      imgUrl: '',
    }
  },
  methods: {
    //上传前判断文件是否合法
    beforeUpload(file) {
      const isType = file.type === ('image/jpeg' || 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isType) {
        this.$message.error('格式只能是jpg/jpeg/png格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
      return true
    },
    success(res) {
      this.live.imgUrl = res.data
      this.imgUrl = res.data
    },
    async submit() {
      if (this.live.title.trim()) {
        await updateLive({ _id: this.live._id, title: this.live.title, imgUrl: this.imgUrl })
        this.$message.success('已保存')
        location.reload()
      }
    },
    async open() {
      this.live = (await addLive(this.userId)).data
    },
    closeLive() {
      this.$confirm('是否关闭直播功能')
        .then(async () => {
          this.live = (await deleteLive(this.userId)).data
        })
        .catch(() => {
          return false
        })
    },
    async init() {
      this.live = (await getLive(this.userId)).data
    },
  },
  created() {
    this.init()
  },
}
</script>
<style lang="scss" scoped>
.live {
  padding: 20rem 60rem;
}
.live-form {
  width: 70rem;
  margin: 3rem 30rem 0;
  padding: 4rem 15rem 4rem 2rem;
  border: 1px solid #d7dae2;
  border-radius: 8px;
}
.upload-img {
  object-fit: cover;
  display: block;
  width: 32rem;
  height: 18rem;
}
</style>
