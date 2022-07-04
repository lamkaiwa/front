import ajax from './ajax'
// 获取系统通知
export const getNotices = userToken => ajax('/user/message/notice/getNotices', {}, 'get', { headers: { Authorization: userToken } })
