import Fly from 'flyio'
import { baseUrlApi } from './index'

const request = new Fly()

request.interceptors.request.use((req) => {
  uni.showNavigationBarLoading()
  return req
})

request.interceptors.response.use(
  async (res, promise) => {
    let ret = null
    if (res.data.status === 2) {
      // cookie expired, redo login
      await request.get('/h5_auth', null, {
        baseURL: baseUrlApi
      }).then(async _res => {
        await request.get(res.request.url, res.request.body, {
          baseURL: res.request.baseURL
        }).then(_res => {
          ret = _res
        })
      })
    } else if (res.data.status === 1) {
      uni.showModal({
        title: '出错了',
        content: res.data.msg
      })
    } else {
      ret = res.data.data
    }
    uni.hideNavigationBarLoading()
    return promise.resolve(ret)
  },
  (err, promise) => {
    uni.hideNavigationBarLoading()
    uni.showToast({
      title: '网络异常：' + err.message,
      icon: '/static/assets/error.png',
      duration: 2000
    })
    return promise.resolve()
  }
)

export default request
