import ajax from './ajax'
// 获取消息通知
export const getMsg = (id, userToken) => ajax('/user/message/reply/getMessages', { userId: id }, 'get', { headers: { Authorization: userToken } })
// 删除消息通知
export const deleteMsg = (id, userToken) => ajax('/user/message/reply/deleteMessage', { id: id }, 'get', { headers: { Authorization: userToken } })
