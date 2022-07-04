// 评论
import ajax from './ajax'
//发表
export const sendComment = data => ajax('/comment/send', data, 'post')
// 获取
export const getCommentPage = (_id, page = 1) => ajax('/comment/page', { _id, page })
//回复
export const sendCommentReply = data => ajax('/comment/reply', data, 'post')
//删除
export const deleteComment = data => ajax('/comment/delete', data, 'post')
