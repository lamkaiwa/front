//用户相关
import ajax from './ajax'
//发送邮件
export const sendEmail = email => ajax('/user/login/reSet/getCode', { email }, 'post')
//login/signIn   注册
export const reg = data => ajax('/user/login/signIn/reg', data, 'post')
//login/loginform   登录
export const login = data => ajax('/user/login/loginForm/login', data, 'post')
//  判断是否登录
export const isLogin = () => ajax('/user/isLogin')
//  退出登录
export const logout = () => ajax('/user/logout')
//  获取用户头像
export const getUserHeadUrl = _id => ajax('/user/headUrl', { _id })
//获取用户基本信息
export const getUserById = (id, userToken) => ajax('/user/mine/setting/getUserById', { id }, 'get', { headers: { Authorization: userToken } })
// 修改用户信息
export const updateUser = (data, userToken) => ajax('/user/mine/setting/updateUserByUserId', data, 'post', { headers: { Authorization: userToken } })
//获取用户收藏
export const getCollection = (_id, page) => ajax('/user/collection', { _id, page })
// 获取用户邮箱
export const getEmail = _id => ajax('/user/email', { _id })
//修改密码
export const updatePass = data => ajax('/user/mine/setPassWord', data, 'post')
//修改密码有token
export const updatePassWord = (data, userToken) => ajax('/user/mine/setPassWord/updatePassWord', data, 'post', { headers: { Authorization: userToken } })
//获取关注列表
export const getAttentionList = _id => ajax('/user/attentionList', { _id })
//获取关注列表用户信息
export const getAttentionUser = (data, userToken) => ajax('/user/mine/attention/getAttentionUser', data, 'post', { headers: { Authorization: userToken } })
//切换关注
export const toggleAtt = (data, userToken) => ajax('/user/mine/attention/toggleAtt', data, 'post', { headers: { Authorization: userToken } })
//上传图片
export const uploadAvatar = (data, userToken) =>
  ajax('/user/mine/setting/uploadAvatar', data, 'post', { headers: { Authorization: userToken, 'Content-Type': 'multipart/form-data' } })
//修改密码有token
export const updatePassToken = (data, userToken) => ajax('/user/userController/updatePass', data, 'post', { headers: { Authorization: userToken } })
//是否有关注
export const isAttention = (data, userToken) => ajax('/user/user/isAttention', data, 'post', { headers: { Authorization: userToken } })

//取消关注
export const addAttention = (data, userToken) => ajax('/user/user/addAttention', data, 'post', { headers: { Authorization: userToken } })

//添加关注
export const cancelAttention = (data, userToken) => ajax('/user/user/cancelAttention', data, 'post', { headers: { Authorization: userToken } })
//获取用户上传的视频
export const getVideoPageByUser = (data, userToken) => ajax('/user/user/getVideoPageByUser', data, 'get', { headers: { Authorization: userToken } })
//search count number
export const searchCount = (data, userToken) => ajax('/user/user/searchCount', data, 'get', { headers: { Authorization: userToken } })
// 获取视频评论
export const getVideoComments = (videoId, userToken) =>
  ajax('/user/detail/getVideoComments', { videoId: videoId }, 'get', { headers: { Authorization: userToken } })
//发送评论
export const sendComment = (data, userToken) => ajax('/user/detail/sendComment', data, 'post', { headers: { Authorization: userToken } })
//获取视频评论的数目
export const getCommentCount = (videoId, userToken) =>
  ajax('/user/detail/getCommentCount', { videoId: videoId }, 'get', { headers: { Authorization: userToken } })
export const addReply = (data, userToken) => ajax('/user/detail/addReply', data, 'post', { headers: { Authorization: userToken } })
//删除评论和回复
export const deleteCommentAndReply = (commentId, replyId, userToken) =>
  ajax('/user/detail/deleteCommentAndReply', { commentId, replyId }, 'get', { headers: { Authorization: userToken } })
export const getUsers = (page, userToken) => ajax('/user/admin/user/getUsers', { page: page }, 'get', { headers: { Authorization: userToken } })
export const getUsersCount = userToken => ajax('/user/admin/user/getUsersCount', {}, 'get', { headers: { Authorization: userToken } })
export const insertUser = (data, userToken) => ajax('/user/admin/user/insertUser', data, 'post', { headers: { Authorization: userToken } })
export const deleteUser = (_id, userToken) => ajax('/user/admin/user/deleteUser', { userId: _id }, 'get', { headers: { Authorization: userToken } })
export const updateUserAdmin = (data, userToken) => ajax('/user/admin/user/updateUser', data, 'post', { headers: { Authorization: userToken } })
export const getVideosByPage = (page, userToken) => ajax('/user/admin/video/getVideosByPage', { page: page }, 'get', { headers: { Authorization: userToken } })
export const deleteVideo = (videoId, userToken) =>
  ajax('/video/admin/video/deleteVideo', { videoId: videoId }, 'get', { headers: { Authorization: userToken } })
export const getVideosCount = userToken => ajax('/user/admin/video/getVideosCount', {}, 'get', { headers: { Authorization: userToken } })
export const insertNotice = (data, userToken) => ajax('/user/admin/notice/insertNotice', data, 'post', { headers: { Authorization: userToken } })
export const getNoticeCount = userToken => ajax('/user/admin/notice/getNoticeCount', {}, 'get', { headers: { Authorization: userToken } })
export const deleteNotice = (id, userToken) => ajax('/user/admin/notice/deleteNotice', { id: id }, 'get', { headers: { Authorization: userToken } })
export const getNotices = (page, userToken) => ajax('/user/admin/notice/getNotices', { page: page }, 'get', { headers: { Authorization: userToken } })
export const updateNotice = (data, userToken) => ajax('/user/admin/notice/updateNotice', data, 'post', { headers: { Authorization: userToken } })
