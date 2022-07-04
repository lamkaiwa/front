import Vue from 'vue'
import { formatDate } from 'element-ui/src/utils/date-util'
import { url } from '../api/ajax'
//自定义时间过滤器 'yyyy-MM-dd HH:mm:ss'
Vue.filter('dateFormat', value => formatDate(value, 'yyyy-MM-dd'))
Vue.filter('fullDateFormat', value => formatDate(value, 'yyyy-MM-dd HH:mm'))
Vue.filter('urlFormat', value => url + '/video/imageController/getVideoImage/' + value)
Vue.filter('urlFormat2', value => url + '/user/imageController/getAvatar/' + value)
Vue.filter('livePushFormat', value => 'rtmp://localhost' + value)
Vue.filter('sexFormat', value => {
  switch (value) {
    case 0:
      return '男'
    case 1:
      return '女'
  }
})
Vue.filter('videoTypeFormat', value => {
  switch (value) {
    case 1:
      return '游戏'
    case 2:
      return '新闻'
    case 3:
      return '生活'
    case 4:
      return '校园'
    case 5:
      return '教育'
    case 6:
      return '动物'
    case 7:
      return '其他'
  }
})
