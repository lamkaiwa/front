//直播相关
import ajax from './ajax'
//查询是否有直播间
export const getLive = user => ajax('/live/getLive', { user })
//开启直播间
export const addLive = user => ajax('/live/add', { user })
//关闭直播间
export const deleteLive = user => ajax('/live/delete', { user })
//修改直播间
export const updateLive = data => ajax('/live/update', data, 'post')
//查询正在直播
export const getOnLive = (page = 1) => ajax('/live/onLive', { page })
//根据ID查询
export const getLiveById = _id => ajax('/live/_id', { _id })
