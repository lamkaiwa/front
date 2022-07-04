<template>
  <div class="videoForm">
    <el-form :model="videoForm" label-width="80px" :rules="rules" label-position="top" ref="videoForm">
      <el-form-item label="网站地址:目前支持youtube和优酷 tip:将你要上传的视频链接地址填在空格中，然后检验是否有效" prop="url">
        <el-input v-model="videoForm.url"></el-input>
        <el-button class="checkurl" :plain="true" @click="checkurl">查看链接是否有效</el-button>
      </el-form-item>
      <el-form-item label="请选择视频版本" v-if="visible">
        <el-radio-group v-model="videoForm.version">
          <div v-for="version in versionList" :key="version.formatCode">
            <div>
              <el-radio :label="version"
                >版本：{{ version.formatCode }} 格式: {{ version.extension }} 视频宽高: {{ version.resolution }} 视频大小: {{ version.note }}</el-radio
              >
            </div>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频标题" prop="title">
        <el-input v-model="videoForm.title"></el-input>
      </el-form-item>
      <el-form-item label="视频类型" prop="type">
        <el-select v-model="videoForm.type" placeholder="请选择视频类型">
          <el-option v-for="(type, index) in types" :label="type" :value="index + 1" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简介">
        <el-input type="textarea" v-model="videoForm.desc" rows="5"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">立即提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getAlltype } from '../../api/type'
import { getYoutubeDLsByUrl, downLoadVideoByYoutubeDl } from '../../api/video'
export default {
  data() {
    return {
      visible: false,
      versionList: [],
      // 视频分类
      types: ['生活', '科技', '游戏', '校园', '教育', '动物', '其他'],
      imgUrl: '',
      rules: {
        url: [{ type: 'url', message: '请输入正确的网址,然后点击检查是否有相关资源', trigger: 'blur' }],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 90, message: '长度不超过30个字符', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      },
      videoForm: {
        title: '',
        type: '',
        desc: '',
        url: '',
        version: ''
      },
      img: '',
      video: '',
      process: 0
    }
  },
  methods: {
    async checkurl() {
      if (this.videoForm.url != '') {
        let loading = this.$loading({
          text: '正在检查url是否可用',
          fullscreen: true,
          lock: true,
          background: 'rgba(255,255,255,.7)'
        })
        let urlRes = await getYoutubeDLsByUrl(this.videoForm.url, this.$store.state.user.token)
        loading.close()
        if (urlRes.code == 200) {
          this.visible = true
          this.versionList = urlRes.data
          if (this.versionList.length == 0) {
            this.visible = false
            this.versionList = []
            this.videoForm = {}
            this.$message.error('该视频没有资源请选择其他链接')
          } else {
            this.$message.success('网址正确，请选择下面所要下载的版本')
          }
        }
      } else {
        this.visible = false
        this.$message.error('请填写正确的网站地址,不能为空')
      }
    },
    imgRemove() {
      this.imgUrl = ''
      this.img = ''
    },
    videoRemove() {
      this.video = ''
    },
    //文件个数超出回调
    videoExceed() {
      this.$message.error('视频只能上传一个')
    },
    imgExceed() {
      this.$message.error('图片只能上传一个')
    },
    async submit() {
      if (this.videoForm.version == '' || this.videoForm.desc == '') {
        this.$message('视频版本和视频吗描述不能为空')
      } else {
        let loading = this.$loading({
          text: '正在上传视频，请稍等',
          fullscreen: true,
          lock: true,
          background: 'rgba(255,255,255,.7)'
        })
        let res = await downLoadVideoByYoutubeDl(
          {
            url: this.videoForm.url,
            title: this.videoForm.title,
            desc: this.videoForm.desc,
            type: this.videoForm.type,
            code: this.videoForm.version.formatCode,
            author: this.$store.state.user.id,
            email: this.$store.state.user.email
          },
          this.$store.state.user.token
        )
        if (res.code == 200) {
          this.$message.success('视频正在上传,当上传成功后系统会发信息给你')
        } else {
          this.$message.error('视频上传失败')
        }
        this.videoForm = {}
        this.visible = false
        loading.close()
      }
    },
    async init() {
      if (this.$store.state.user == null) {
        this.$message.error('先登录')
        this.$router.push('/login/loginForm')
      }
      let typeRes = await getAlltype(this.$store.state.user.token)
      if (typeRes.code == 200) {
        this.types = typeRes.data
      }
    }
  },
  computed: {
    ...mapState(['userId'])
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/*表单*/
.videoForm {
  width: 80rem;
  margin: 2rem auto;
  .video {
    text-align: center;
  }
}
/* 封面*/
.titlePic {
  width: 322px;
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    color: #606266;
    &:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      line-height: 18rem;
    }
    .avatar {
      width: 32rem;
      height: 18rem;
      display: block;
    }
  }
}
.el-progress {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
