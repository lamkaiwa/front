import { url } from './ajax'
const baseURL = url + '/user/imageController/getAvatar/'
function getUrl(url) {
  return baseURL + url
}

export const avatar = getUrl
