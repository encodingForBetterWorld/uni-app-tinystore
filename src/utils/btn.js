import api from './api'
const delBtnWidth = 36
const btn = {
  touchStart (e) {
    this.startX = e.touches[0].clientX
    let currIdx = e.currentTarget.dataset['index']
    if (currIdx !== this.currIdx) {
      this.distX = 0
    } else if (this.deleteId) {
      this.startX += delBtnWidth
    }
    this.currIdx = currIdx
  },
  touchMove (e) {
    let touch = e.touches[0]
    let distX = this.startX - touch.clientX
    if (distX >= delBtnWidth) {
      this.deleteId = this.list[this.currIdx].id
    } else if (distX < 0) {
      if (this.list[this.currIdx].id === this.deleteId) {
        this.deleteId = null
      }
    }
    this.distX = Math.min(Math.max(distX, 0), delBtnWidth)
  },
  touchEnd (e) {
    let distX = this.startX - e.changedTouches[0].clientX
    if (distX < delBtnWidth) {
      if (this.list[this.currIdx].id === this.deleteId) {
        this.distX = delBtnWidth
      } else {
        this.distX = 0
        this.currIdx = null
      }
    }
  },
  turn (url) {
    uni.navigateTo({
      url: url
    })
  },
  singlePay: function (e) {
    let orderId = e.currentTarget.dataset.id
    let pageType = e.currentTarget.dataset.type
    if (pageType === 'list') {
      let { orders } = this.$props
      this.orders = orders
      this.orderIds = []
      this.checkedOrderIdxs = []
      this.$store.commit('totalPrice', 0)
      this.btnText = null
      uni.startPullDownRefresh()
    }
    this.togglePayModal({
      status: 'open',
      orderIds: [orderId]
    })
  },
  singleClose: function (e) {
    let orderId = e.currentTarget.dataset.id
    let idx = e.currentTarget.dataset.index
    let pageType = e.currentTarget.dataset.type
    let v = this
    wx.showModal({
      title: '提示',
      content: '即将关闭订单',
      async success (res) {
        if (res.confirm) {
          const data = await api.postOrders([orderId], 2)
          if (!data) return
          if (pageType === 'list') {
            let { orders } = v.$props
            orders.splice(idx, 1)
            v.$store.commit('totalPrice', 0)
            v.btnText = null
            v.orders = orders
            v.orderIds = []
            v.checkedOrderIdxs = []
            uni.startPullDownRefresh()
          } else if (pageType === 'detail') {
            v.order.status = 2
          }
          uni.showToast({
            title: '关闭订单成功',
            duration: 2000
          })
        }
      }
    })
  }
}
export default btn
