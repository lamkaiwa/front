//视频相关
import ajax from './ajax'
//  上传视频
export const uploadVideo = (data, userToken) => ajax('/video/upload/uploadVideo', data, 'post', { headers: { Authorization: userToken } })
//轮播图推荐
export const recommend = userToken => ajax('/video/home/getLunBoPic', {}, 'get', { headers: { Authorization: userToken } })
//分页查询
export const getVideoPage = (page = 1, type = '', userToken) =>
  ajax('/video/home/getVideoPage', { page, type }, 'get', { headers: { Authorization: userToken } })
//根据_id查询
export const getVideoById = _id => ajax(`/video/byId`, { _id })
//获取弹幕 限制最多
export const getDanmu = player => ajax('/danmu', { player })
//发送弹幕
export const sendDanmu = data => ajax('/danmu', data, 'post')
//播放次数++
export const setPlayCount = _id => ajax('/video/play', { _id })
//排行榜
export const top = userToken => ajax('/video/top/getTopVideo', {}, 'get', { headers: { Authorization: userToken } })
//赞
export const zan = data => ajax('/video/zan', data, 'post')
//收藏
export const collect = data => ajax('/video/collect', data, 'post')
//搜索
export const search = (words, page, sortBy, userToken) =>
  ajax('/video/search/searchVideos', { words, page, sortBy }, 'get', { headers: { Authorization: userToken } })

//搜寻的总和
export const searchCount = (words, userToken) => ajax('/video/search/searchCount', { words }, 'get', { headers: { Authorization: userToken } })

//获取用户上传的视频
export const getVideoPageByUser = (data, userToken) => ajax('/video/mine/video/getVideoPageByUser', data, 'get', { headers: { Authorization: userToken } })
//删除视频
export const deleteVideoById = (videoId, userToken) => ajax('/video/mine/video/deleteVideoById', { videoId }, 'get', { headers: { Authorization: userToken } })

//获取用户基本信息
export const getUserById = (id, userToken) => ajax('/user/userController/getUserById', { id }, 'get', { headers: { Authorization: userToken } })

//获取视频总数根据类别
export const getvideoCountByType = (type, userToken) => ajax('/video/home/getTotalVideoByType', { type }, 'get', { headers: { Authorization: userToken } })

export const searchCountMine = (words, userId, userToken) =>
  ajax('/video/mine/video/searchCount', { words, userId }, 'get', { headers: { Authorization: userToken } })
//获取用户收藏的视频
export const getCollectionVideoListByUserId = (userId, page, userToken) =>
  ajax('/video/mine/collection/getCollectionVideoListByUserId', { userId, page }, 'get', { headers: { Authorization: userToken } })
//获取用户收藏视频的总数
export const getAttentionCountByUserId = (userId, userToken) =>
  ajax('/video/mine/collection/getAttentionCountByUserId', { userId }, 'get', { headers: { Authorization: userToken } })
//取消收藏
export const deleteCollectionListByVideoIdAndUserId = (data, userToken) =>
  ajax('/video/mine/collection/deleteCollectionListByVideoIdAndUserId', data, 'post', { headers: { Authorization: userToken } })

//获取视频总数根据类别
export const getVideoByVideoId = (id, userToken) => ajax('/video/detail/getVideoByVideoId', { videoId: id }, 'get', { headers: { Authorization: userToken } })

//获取推荐视频视频总数
export const getRecommendVideoByWord = (title, desc, userToken) =>
  ajax('/video/detail/getRecommendVideoByWord', { title, desc }, 'get', { headers: { Authorization: userToken } })

//播放量加一
export const updateVideoPlayCount = (videoId, userToken) =>
  ajax('/video/detail/updateVideoPlayCount', { videoId }, 'get', { headers: { Authorization: userToken } })

export const readVideoBlock = (data, userToken) =>
  ajax('/video/detail/getVideoBlock', { type: data.type, block: data.block, videoName: data.videoName }, 'get', {
    headers: { Authorization: userToken },
    responseType: 'arraybuffer'
  })

export const getVideoInfo = (type, fileName, userToken) =>
  ajax('/video/detail/getVideoInfo', { type, fileName }, 'get', {
    headers: { Authorization: userToken }
  })
export const getImageBytesOnSpecifiedTime = (type, fileName, time, userToken) =>
  ajax('/video/detail/getImageBytesOnSpecifiedTime', { type: type, videoName: fileName, time: time }, 'get', {
    headers: { Authorization: userToken },
    responseType: 'blob'
  })

export const isZan = (data, userToken) => ajax('/video/detail/isZan', data, 'post', { headers: { Authorization: userToken } })
export const isCollectionList = (data, userToken) => ajax('/video/detail/isCollectionList', data, 'post', { headers: { Authorization: userToken } })
export const addZan = (data, userToken) => ajax('/video/detail/addZan', data, 'post', { headers: { Authorization: userToken } })
export const addCollection = (data, userToken) => ajax('/video/detail/addCollection', data, 'post', { headers: { Authorization: userToken } })
export const deleteZan = (data, userToken) => ajax('/video/detail/deleteZan', data, 'post', { headers: { Authorization: userToken } })
export const deleteCollection = (data, userToken) => ajax('/video/detail/deleteCollection', data, 'post', { headers: { Authorization: userToken } })
export const getYoutubeDLsByUrl = (url, userToken) =>
  ajax('/video/webUpload/getYoutubeDLsByUrl', { url: url }, 'get', { headers: { Authorization: userToken } })
export const downLoadVideoByYoutubeDl = (data, userToken) =>
  ajax('/video/webUpload/downLoadVideoByYoutubeDl', data, 'post', { headers: { Authorization: userToken } })
export const editVideo = (data, userToken) => ajax('/video/admin/video/editVideo', data, 'post', { headers: { Authorization: userToken } })
export const getType = userToken => ajax('/video/admin/video/getType', {}, 'get', { headers: { Authorization: userToken } })
