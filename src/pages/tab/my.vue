<template lang="pug">
div
  .container
    .my-header(:class="'d-my-header-animate-'+((isHeaderShow===1&&'show')||(isHeaderShow===0&&'hide')||'none')")
      image.user-settings-btn(src="/static/assets/fa-cog-white.png"
      mode='scaleToFill'
      @click="turn('/pages/settings/index')")
      .user-info(@click="turn('/pages/settings/index')")
        image.user-image(:src="userInfo.avatarUrl || '/static/assets/avatar_default.png'"
        mode="scaleToFill")
        .user-name {{userInfo.nickName}}
      .user-order(:class="'d-user-order-animate-'+((isHeaderShow===1&&'show')||(isHeaderShow===0&&'hide')||'none')")
        .my-order-title(:style="'opacity:'+(((isHeaderShow===void 0)||(isHeaderShow===1)) ? '1':'0')") 我的订单
        .my-order-selection-group
          .my-order-selection(v-for="(orderSection, idx) of orderSelections"
          :class="headerOrderStatus==idx?'text-select':''"
          @click="tapOrderHeader"
          :data-index="idx")
            img(:src="'/static/assets/' + orderSection[0]+(headerOrderStatus==idx?'-focus':'') + '.png'")
            div {{orderSection[1]}}
    scroll-view.section.my-order-list(v-if="orders.length > 0"
    scroll-y
    @scroll="scrollOrderList")
      .my-order-list-blank
      checkbox-group(@change="checkOrderPay")
        order-item(v-for="(item, index) of orders"
        :item="item"
        :index="index"
        :checked="item.checked")
      .btn-footer(v-if="headerOrderStatus==0")
    custom-btn(v-if="btnText && headerOrderStatus==0"
    btnType='pay'
    :text="btnText"
    :checked="checkedAll"
    clickFunc='groupPay'
    checkFunc='checkAllOrderPay'
    )
  custom-modal(ref='modal')
</template>

<script>
import orderItem from '@/components/order-item'
import customBtn from '@/components/custom-btn'
import customModal from '@/components/custom-modal'
import { mapState } from 'vuex'
import api from '@/utils/api'
import btn from '@/utils/btn'
import { setCartTabBarBadge } from '@/utils'
export default {
  components: {
    orderItem, customBtn, customModal
  },
  computed: {
    ...mapState([
      'totalPrice'
    ])
  },
  props: {
    checkedAll: null,
    btnText: null,
    isHeaderShow: null,
    orders: {
      type: Array,
      default () {
        return []
      }
    },
    orderIds: {
      type: Array,
      default () {
        return []
      }
    },
    checkedOrderIdxs: {
      type: Array,
      default () {
        return []
      }
    },
    headerOrderStatus: null,
    orderSelections: {
      type: Array,
      default () {
        return [['fa-wallet', '待付款'], ['fa-truck', '进行中'], ['fa-check-square-o', '已完成'], ['fa-trash-o', '已关闭']]
      }
    },
    userInfo: {
      type: Object,
      default () {
        return {
          nickName: '测试账号',
          avatarUrl: null
        }
      }
    }
  },
  onShow () {
    this.headerOrderStatus = this.headerOrderStatus || 0
    setCartTabBarBadge()
    uni.startPullDownRefresh()
  },
  async onPullDownRefresh () {
    this.isHeaderShow = void 0
    await this.initData()
    uni.stopPullDownRefresh()
  },
  methods: {
    ...btn,
    togglePayModal (e) {
      return this.$refs['modal'].togglePayModal(e)
    },
    scrollOrderList (e) {
      if (e.detail.scrollTop > 128 && e.detail.deltaY < 0 && (this.isHeaderShow === 1 || this.isHeaderShow === void 0)) {
        this.isHeaderShow = 0
      } else if (e.detail.scrollTop < 128 && e.detail.deltaY > 0 && this.isHeaderShow === 0) {
        this.isHeaderShow = 1
      }
    },
    async initData () {
      this.orders = []
      this.orderIds = []
      this.$store.commit('totalPrice', 0)
      this.btnText = null
      const data = await api.getOrderList(
        this.getStatus(this.headerOrderStatus)
      )
      if (!data) return
      this.orders = data
    },
    getStatus: function (status) {
      switch (status) {
        case 0:
          status = 0
          break
        case 1:
          status = 4
          break
        default:
          status -= 1
          break
      }
      return status
    },
    async tapOrderHeader (e) {
      this.headerOrderStatus = Number(e.currentTarget.dataset.index)
      uni.startPullDownRefresh()
    },
    checkOrderPay: function (e) {
      let v = this
      let orders = v.$props.orders
      let totalPrice = 0
      let checkedOrderIdxs = e.detail.value
      orders.forEach((item, idx) => {
        item['checked'] = false
        orders[idx] = item
      })
      checkedOrderIdxs.forEach(idx => {
        let order = orders[idx]
        v.orders[idx]['checked'] = true
        totalPrice += (order.total_price + order.freight)
      })
      let l = checkedOrderIdxs.length
      let btnText = null
      if (l === 1) {
        btnText = '去付款'
      } else if (l > 1) {
        btnText = '合并付款'
      }
      this.$store.commit('totalPrice', totalPrice.toFixed(2))
      this.btnText = btnText
      this.checkedOrderIdxs = checkedOrderIdxs
      this.checkedAll = checkedOrderIdxs.length === orders.length
    },
    groupPay: function (e) {
      let orderIds = []
      let { orders, checkedOrderIdxs } = this.$props
      checkedOrderIdxs.forEach(idx => {
        orderIds.push(orders[idx].id)
      })
      this.togglePayModal({
        status: 'open',
        orderIds: orderIds
      })
    },
    checkAllOrderPay (e) {
      let v = this
      let totalPrice = 0
      let checkedOrderIdxs = []
      this.checkedAll = e.detail.value.length > 0
      v.orders.forEach((order, idx) => {
        if (this.checkedAll) {
          checkedOrderIdxs.push(idx)
          totalPrice += order.total_price + order.freight
        }
        order['checked'] = this.checkedAll
        v.orders[idx] = order
      })
      v.$store.commit('totalPrice', totalPrice.toFixed(2))
      this.checkedOrderIdxs = checkedOrderIdxs
      if (!this.checkedAll) {
        this.btnText = null
      } else {
        this.btnText = (v.orders.length === 1 && '去付款') || (v.orders.length > 1 && '合并付款') || null
      }
    }
  }
}
</script>

<style lang="less">
  @import (reference) "~@/styles/index.less";
  .my-header{
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 160px;
    border-bottom: .5px solid #979797;
    border-radius: 0 0 25% 25%;
    background-color: #8B572A;
    z-index: 1;
  }
  .user-info{
    display: flex;
    flex-flow: column nowrap;
    margin-top: 3px;
    height: 130px;
  }
  .user-image{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #FFF;
    border: 1px solid #979797;
  }
  .user-name{
    color: #FFF;
    text-align: center;
    font-size: 18px;
  }
  .user-order{
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    top: 110px;
    height: 120px;
    border-radius: 9px;
    background-color: #FFF;
    border: .5px solid #979797;
  }
  .my-order-title{
    width: 86%;
    font-size: 16px;
    line-height: 40px;
    vertical-align: middle;
    border-bottom: 2px solid #D7D7D7;
  }
  .my-order-selection-group{
    width: 86%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  .my-order-selection{
    margin: 12px 0;
    font-size: 13px;
    text-align: center;
  }
  .my-order-selection > img{
    width: 28px;
    height: 28px;
  }
  .user-settings-btn{
    position: absolute;
    top: 3px;
    right: 5%;
    width: 25px;
    height: 25px;
  }
  .my-order-list{
    position: absolute;
    top: 65px;
    width: 100%;
    bottom: -5px;
  }
  .my-order-list-blank{
    height: 175px;
  }
  .modal-animation(my-header-animate-show, -156px, 0, 1, 1);
  .d-my-header-animate-show {
    top: 0;
    opacity: 1;
    .animation(my-header-animate-show, .2s)
  }
  .modal-animation(my-header-animate-hide, 0, -156px, 1, 1);
  .d-my-header-animate-hide {
    top: -156px;
    opacity: 1;
    border: none;
    background-color: inherit;
    .animation(my-header-animate-hide, .2s)
  }
  .section-animation(user-order-animate-show, 100%, 70%);
  .d-user-order-animate-show {
    width: 70%;
    .animation(user-order-animate-show, .2s)
  }
  .section-animation(user-order-animate-hide, 70%, 100%);
  .d-user-order-animate-hide {
    width: 100%;
    border-right: none;
    border-left: none;
    border-radius: 0;
    .animation(user-order-animate-hide, .2s)
  }
</style>
