<template>
  <div>
    <!--    背景-->
    <div class="bgPic"></div>
    <!--    左侧菜单-->
    <el-menu :default-active="$route.path" active-text-color="#ff4757" class="menu" router>
      <el-menu-item index="/message/notice">
        <i class="el-icon-setting"></i>
        <span slot="title">系统通知</span>
      </el-menu-item>
      <el-menu-item index="/message/reply">
        <i class="el-icon-chat-dot-round"></i>
        <span slot="title">回复我的</span>
      </el-menu-item>
    </el-menu>
    <!--    右侧组件  -->
    <div class="right">
      <div class="rightBg"></div>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
.bgPic {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  background: url(msgBG.jpg) center/cover no-repeat fixed;
}
.menu {
  padding: 20px 0;
  position: fixed;
  height: 100%;
  text-align: center;
  opacity: 0.9;
}
.right {
  position: fixed;
  height: 93%;
  left: 16%;
  width: 1300px;
  overflow: auto;
  .rightBg {
    position: fixed;
    width: 1300px;
    height: 100%;
    background-color: #bddef8;
    opacity: 0.5;
    z-index: -1;
  }
  div:nth-child(2) {
    margin: 30px;
    border-radius: 8px;
  }
}
</style>
