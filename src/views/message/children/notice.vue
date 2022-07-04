<template>
  <!--  通知-->
  <div>
    <div class="sysMsg" v-for="notice in notices" :key="notice._id">
      <div>
        <b>{{ notice.title }}</b>
        <span>{{ notice.date | fullDateFormat }}</span>
      </div>
      <p>
        {{ notice.content }}
        <span class="link" v-if="notice.url">
          <i class="el-icon-link"></i>
          <span @click="linkTo(notice.url)">网页链接</span>
        </span>
      </p>
    </div>
  </div>
</template>
<script>
import { getNotices } from '../../../api/notice'
export default {
  name: 'notice',
  data() {
    return {
      notices: []
    }
  },
  methods: {
    async init() {
      let result = await getNotices(this.$store.state.user.token)
      if (result.code == 200) {
        this.notices = result.data
      }
    },
    linkTo(url) {
      window.open(url, '_blank')
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss" scoped>
/*系统通知*/
.sysMsg {
  border-radius: 8px;
  background-color: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  div span {
    margin: 10px;
  }
  p {
    margin-top: 8px;
    color: #666666;
    word-break: break-all;
    word-wrap: break-word;
    span:first-child {
      margin-left: 8px;
      cursor: pointer;
      color: #1389bf;
      &:hover {
        color: #2faee3;
      }
    }
  }
}
</style>
