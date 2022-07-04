<!-- 视频列表 -->
<template>
  <div>
    <div :class="`list ${lives.length % 4 === 0 ? '' : lives.length % 4 === 3 ? 'list1' : 'list2'} `">
      <el-col :span="6" v-for="live in lives" :key="live._id">
        <router-link target="_blank" :to="`/online/${live._id}`" class="videoLink">
          <img :src="live.imgUrl | urlFormat" />
        </router-link>
        <div class="rest">
          <div>
            <router-link target="_blank" :to="`/online/${live._id}`">{{ live.title }}</router-link>
          </div>
          <div>
            <router-link class="el-icon-user" :to="`/user/${live.user._id}`">{{ live.user.nick }}</router-link>
          </div>
        </div>
      </el-col>
    </div>
    <!-- 分页插槽 -->
    <slot name="pagination"></slot>
  </div>
</template>
<script>
export default {
  name: 'liveList',
  props: { lives: Array },
}
</script>
<style lang="scss" scoped>
.list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .el-col {
    width: 320px;
    margin-bottom: 3rem;
    img {
      width: 320px;
      height: 180px;
      object-fit: cover;
      &:hover {
        transition: 0.2s;
        transform: scale(1.1);
      }
    }
  }
}
.list1:after {
  display: block;
  width: 320px;
  content: '';
}
.list2:after {
  display: block;
  width: 693px;
  content: '';
}
.videoLink {
  display: block;
  line-height: 0;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.rest {
  padding: 1.2rem 0.8rem;
  border-color: #b8c0cc;
  border-style: solid;
  border-width: 0 1px 1px;
  border-radius: 0 0 8px 8px;
  p {
    margin: 0.6rem 0;
  }
  i {
    color: #999999;
    margin-right: 8px;
    font-size: 1.2rem;
    &:before {
      margin-right: 4px;
    }
  }
  .el-icon-user {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #999;
    &:hover {
      color: #00a1d6;
    }
  }
}
</style>
