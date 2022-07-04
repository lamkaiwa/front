import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import './assets/style/base.css'
import Video from 'video.js'
//element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'video.js/dist/video-js.css'
// 过滤器
import './utils/filter'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$videojs = Video

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
