<template lang="pug">
.container
  .section.btn-footer(v-if="list && list.length > 0")
    checkbox-group(@change="checkCartPay")
      cart-item(ref='pay-bn'
      v-for="(item, index) of list"
      :item="item"
      :index="index"
      :currIdx="currIdx"
      :distX="distX"
      :checked="item.checked"
      :deleteId="deleteId")
  no-content(v-else
  text='购物车空空如也')
  custom-btn(v-if="btnText"
  btnType='pay'
  :text="btnText"
  :checked="checkedAll"
  clickFunc='createOrder'
  checkFunc='checkAllCartPay')
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import cartItem from '@/components/cart-item'
import customBtn from '@/components/custom-btn'
import noContent from '@/components/nocontent'
import api from '@/utils/api'
import btn from '@/utils/btn'
import { cartAdd, cartRemove, cartCount, setCartTabBarBadge } from '@/utils'
export default {
  components: {
    cartItem,
    customBtn,
    noContent
  },
  props: {
    startX: null,
    deleteId: null,
    currIdx: null,
    distX: null,
    btnText: null,
    checkedAll: null,
    selectedList: {
      type: Array,
      default () {
        return []
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    ...mapState([
      'totalPrice',
      'showNocontentStatus'
    ])
  },
  onShow () {
    setCartTabBarBadge()
    uni.startPullDownRefresh()
  },
  async onPullDownRefresh () {
    this.$store.commit('showNocontentStatus', false)
    await this.initData()
    this.$store.commit('showNocontentStatus', true)
    uni.stopPullDownRefresh()
  },
  methods: {
    ...btn,
    async initData () {
      let v = this
      let cartKeys = wx.getStorageSync('cart_keys')
      v.$store.commit('totalPrice', 0)
      v.list = []
      v.selectedList = []
      v.btnText = null
      if (cartKeys) {
        let cartDatas = []
        cartKeys = JSON.parse(cartKeys)
        cartKeys.forEach(key => {
          cartDatas.push({
            id: key,
            count: wx.getStorageSync('cart_' + key)
          })
        })
        const data = await api.getCartList(JSON.stringify(cartDatas))
        if (!data) return
        v.list = data.cart_list
      }
    },
    createOrder: function (e) {
      // 跳转到确认订单页
      uni.navigateTo({
        url: '/pages/detail/order-confirm?goods_types=' + JSON.stringify(this.selectedList)
      })
    },
    cartCountEdit: function (e) {
      let v = this
      let type = e.currentTarget.dataset.type
      let idx = e.currentTarget.dataset.index
      let cartId = Number(e.currentTarget.dataset.id)
      let { list, selectedList } = v.$props
      let totalPrice = Number(v.totalPrice)
      let cartData = list[idx]
      let priceDiff = 0
      if (type === 'add' && cartData.select_count < cartData.count) {
        list[idx].select_count++
        priceDiff += Number(cartData.price)
      }
      if (type === 'sub' && cartData.select_count > 1) {
        list[idx].select_count--
        priceDiff -= Number(cartData.price)
      }
      let l = selectedList.length
      while (l--) {
        if (cartId === selectedList[l].id) {
          totalPrice += priceDiff
          selectedList[l].count = cartData.select_count
          break
        }
      }
      v.$store.commit('totalPrice', totalPrice)
      v.list = list
      v.selectedList = selectedList
      cartAdd(cartId, cartData.select_count)
    },
    cartItemRemove: function (e) {
      let v = this
      wx.showModal({
        title: '提示',
        content: '即将移除购物车中商品',
        success: res => {
          if (res.confirm) {
            let idx = Number(e.currentTarget.dataset.index)
            let cartId = Number(e.currentTarget.dataset.id)
            let { list, selectedList } = v.$props
            let totalPrice = v.totalPrice
            let cartData = list[idx]
            let priceDiff = (cartData.price * cartData.select_count)
            let l = selectedList.length
            while (l--) {
              if (cartId === selectedList[l].id) {
                totalPrice -= priceDiff
                selectedList.splice(l, 1)
                break
              }
            }
            list.splice(idx, 1)
            v.$store.commit('totalPrice', totalPrice)
            v.list = list
            v.selectedList = selectedList
            v.deleteId = null
            v.currIdx = null
            if (selectedList.length === 0) {
              v.btnText = null
            }
            cartRemove(cartId)
            let cartC = cartCount()
            if (cartC && cartC > 0) {
              wx.setTabBarBadge({
                index: 1,
                text: '' + cartC
              })
            } else {
              uni.removeTabBarBadge({
                index: 1
              })
            }
          }
        }
      })
    },
    checkCartPay (e) {
      let v = this
      let selectedList = []
      let totalPrice = 0
      v.list.forEach((item, idx) => {
        item['checked'] = false
        v.list[idx] = item
      })
      e.detail.value.forEach(idx => {
        idx = Number(idx)
        let cartData = v.list[idx]
        selectedList.push({
          id: cartData.id,
          count: cartData.select_count
        })
        v.list[idx]['checked'] = true
        totalPrice += cartData.price * cartData.select_count
      })
      v.$store.commit('totalPrice', 0)
      v.btnText = null
      v.selectedList = selectedList
      if (selectedList.length > 0) {
        v.$store.commit('totalPrice', totalPrice)
        v.btnText = '去结算'
      }
      this.checkedAll = selectedList.length === v.list.length
    },
    checkAllCartPay (e) {
      let v = this
      let totalPrice = 0
      let selectedList = []
      this.checkedAll = e.detail.value.length > 0
      v.list.forEach((item, idx) => {
        if (this.checkedAll) {
          totalPrice += item.price * item.select_count
          selectedList.push({
            id: item.id,
            count: item.select_count
          })
        }
        item['checked'] = this.checkedAll
        v.list[idx] = item
      })
      v.$store.commit('totalPrice', totalPrice)
      this.selectedList = selectedList
      if (!this.checkedAll) {
        this.btnText = null
      }
    }
  }
}
</script>

<style lang="less">

</style>
