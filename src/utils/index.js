function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export const platform = process.env.UNI_PLATFORM

export const baseUrlApi = '/api'

export function formatTime (date) {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function isVaildAddressForm (addressForm) {
  let errMsg = null
  if (!addressForm.name || !addressForm.phone || !addressForm.province || !addressForm.city || !addressForm.area || !addressForm.detail) {
    errMsg = '条目均不能为空'
  } else if (!(/^1[34578]\d{9}$/.test(addressForm.phone))) {
    errMsg = '手机号码不合法'
  }
  if (errMsg) {
    uni.showToast({
      title: errMsg,
      icon: '',
      image: '/static/assets/error.png',
      duration: 2000
    })
    return false
  }
  return true
}

export function cartCount () {
  let cartKeys = uni.getStorageSync('cart_keys')
  if (cartKeys) {
    cartKeys = JSON.parse(cartKeys)
    return cartKeys.length
  }
  return 0
}

export function cartAdd (key, count) {
  key = Number(key)
  count = Number(count)
  let cartKeys = uni.getStorageSync('cart_keys')
  if (cartKeys) {
    cartKeys = JSON.parse(cartKeys)
  } else {
    cartKeys = []
  }
  if (cartKeys.indexOf(key) === -1) {
    cartKeys.push(key)
  }
  uni.setStorageSync('cart_' + key, count)
  uni.setStorageSync('cart_keys', JSON.stringify(cartKeys))
}

export function cartRemove (key, count) {
  key = Number(key)
  count = Number(count)
  let cartKeys = uni.getStorageSync('cart_keys')
  if (cartKeys) {
    cartKeys = JSON.parse(cartKeys)
  } else {
    cartKeys = []
  }
  let idx = cartKeys.indexOf(key)
  if (idx > -1) {
    cartKeys.splice(idx, 1)
  }
  uni.removeStorageSync('cart_' + key)
  uni.setStorageSync('cart_keys', JSON.stringify(cartKeys))
}

export function setCartTabBarBadge () {
  let cartC = cartCount()
  if (cartC && cartC > 0) {
    wx.setTabBarBadge({
      index: 1,
      text: cartC + ''
    })
  }
}
