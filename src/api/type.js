import ajax from './ajax'
// 获取系统通知
export const getAlltype = userToken => ajax('/video/home/getAllType', {}, 'get', { headers: { Authorization: userToken } })
