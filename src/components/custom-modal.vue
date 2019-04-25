<template lang="pug">
div(v-if="showModalStatus")
  .modal-mask(@click="toggleModal" data-status='close' v-if="modalType=='goods' || modalType=='address'")
  scroll-view.modal-box.modal-goods-confirm(scroll-y
  :class="modalClass"
  v-if="modalType=='goods'")
    .modal-container
      .modal-header.modal-header-goods
        .modal-title.modal-title-goods
          div
            image(:src="baseAssetsApi + currGoodsType.img")
          div
            .money-logo-line
              .money-logo-lg ¥
              div {{currGoodsType.price}}
        .modal-close-btn-o(@click="toggleModal" data-status='close')
          span ×
      .modal-content
        .modal-content-section
          div 型号尺寸
          .modal-content-goods-types
            .modal-content-goods-types-item(v-for="(goodsType, index) of goodsTypes"
            :class="currGoodsTypeIdx==index?'item-select':''"
            :data-index="index"
            @click="selectGoodsType") {{goodsType.description}}
        .modal-content-section
          div 数量
          div
            .modal-content-goods-count
              .count-operator(:class="goodsTypeCount > 1?'':'disable'"
              @click="updateGoodsTypeCount"
              data-type="sub") -
              div
                input(type='text' :value="goodsTypeCount" @confirm="inputGoodsTypeCount")
              .count-operator(:class="goodsTypeCount < currGoodsType.count?'':'disable'"
              @click="updateGoodsTypeCount"
              data-type="add") +
            .goods-type-count-text(v-if="currGoodsType.count > 1") 库存{{currGoodsType.count}}件
    .btn-custom.btn-single(@click="confirm")
      .btn-pay-text
        span(v-if="showModalType=='cart'") 加入购物车
        span(v-else-if="showModalType=='pay'") 立即购买
  scroll-view.modal-box.modal-address-edit(scroll-y
  :class="modalClass"
  v-if="modalType=='address'")
    .modal-container
      .modal-header.modal-header-address
        .modal-title.modal-title-address
          div(:class="sectionIdx==0?'modal-title-select':''" data-index='0' @click="tapModalHeader") 收货地址
          div(:class="sectionIdx==1?'modal-title-select':''" data-index='1' @click="tapModalHeader") 添加收货地址
        .modal-close-btn(@click="toggleModal" data-status='close')
          span ×
      .modal-content.modal-content-address(v-if="sectionIdx==0")
        radio-group.radio-group(@change="checkAddress")
          .modal-content-address-item(v-for="(item, index) of addresses")
            .user-adderss-info
              div
                .user-adderss-info-name {{item.name}}
                  span(v-if="item.is_default") （默认）
                div {{item.phone}}
              div {{item.province + item.city + item.area + item.detail}}
            div
              radio(:value="index" :checked="selectedAddress && item.id==selectedAddress.id")
      .btn-custom.btn-single(v-if="sectionIdx==0" data-index='0' @click="tapModalConfirm")
        .btn-pay-text
          span 确认
      address-section(v-if="sectionIdx==1"
      sectionType='modal'
      ref='address-section')
      .btn-custom.btn-single(v-if="sectionIdx==1" data-index='1' @click="tapModalConfirm")
        .btn-pay-text
          span 添加
  .modal-mask(@click="togglePayModal" data-status='close' v-if="modalType=='qrcode' && qrcode")
  .modal-pay-box(v-if="modalType=='qrcode' && qrcode"
  :class="modalClass")
    .modal-container.modal-container-pay
      .modal-header.modal-header-pay
        .modal-title 支付提示
      .modal-content-pay
        .modal-section-pay.modal-section-pay-tip 请通过微信扫码进行支付
      .modal-section-pay.modal-section-pay-price-clipboard
        image.modal-section-pay-qrcode(:src="baseAssetsApi+qrcode" mode='scaleToFill')
        .modal-section-pay-price
          #qrcode-price(:data-clipboard-text="qrcodePrice")
            span ¥
            label {{qrcodePrice}}
          image.fa-icon.modal-section-pay-price-copy(:data-clipboard-text="qrcodePrice"
          src='/static/assets/fa-copy.png'
          mode='scaleToFill')
      .modal-section-pay-btngroup
        .pay-btn-close(@click="togglePayModal" data-status="close") 稍后支付
        .pay-btn-confirm(@click="togglePayModal" data-status="close") 扫码支付
</template>

<script>
import addressSection from '@/components/address-section'
import { cartAdd, isVaildAddressForm } from '@/utils'
import api from '@/utils/api'
import Clipboard from 'clipboard'
import { mapState, mapActions, mapMutations } from 'vuex'
const Clipboards = ['#qrcode-price', '.modal-section-pay-price-copy']
export default {
  components: {
    addressSection
  },
  props: {
    sectionIdx: null,
    selectedAddressIdx: null,
    selectedAddress: null
  },
  computed: {
    ...mapState([
      'goods',
      'currGoodsType',
      'goodsTypes',
      'currGoodsTypeIdx',
      'goodsTypeCount',
      'addresses',
      'showModalStatus',
      'modalClass',
      'modalType'
    ])
  },
  mounted () {
    this.sectionIdx = 0
    this.selectedAddressIdx = 0
    Clipboards.forEach(n => {
      new Clipboard(n).on('success', e => {
        uni.showToast({
          title: '已复制价格'
        })
      })
    })
  },
  methods: {
    ...mapActions(['setAddresses', 'modalAnimate']),
    ...mapMutations(['increment', 'reduce']),
    toggleModal (e) {
      // 弹出地址和商品页的模态框
      let currentStatus, currentType, modalType
      if (typeof e === 'string') {
        currentStatus = e
      } else if (e.hasOwnProperty('currentTarget')) {
        currentStatus = e.currentTarget.dataset.status
        currentType = e.currentTarget.dataset.type
        modalType = e.currentTarget.dataset.modal
      } else {
        currentStatus = e.status
        modalType = e.modal
      }
      if (currentStatus === 'open' && this.$parent.$props && this.$parent.$props.modalDisable) return
      if (currentType) {
        this.showModalType = currentType
      }
      currentStatus === 'open' && this.$store.commit('modalType', modalType)
      this.modalAnimate({
        currentStatus: currentStatus,
        modalClass: 'd-modal-animate'
      })
    },
    togglePayModal (e) {
      // 弹出二维码的模态框
      let currentStatus, orderIds
      if (e.hasOwnProperty('currentTarget')) {
        currentStatus = e.currentTarget.dataset.status
        orderIds = e.currentTarget.dataset.id
      } else {
        currentStatus = e.status
        orderIds = e.orderIds
      }
      if (orderIds && !(orderIds instanceof Array)) {
        orderIds = [Number(orderIds)]
      }
      let p = null
      let v = this
      if (orderIds && currentStatus === 'open') {
        p = new Promise(async (resolve, reject) => {
          let data = await api.getQrCode({
            order_ids: JSON.stringify(orderIds)
          })
          if (data) {
            v.qrcode = data.qrcode
            v.qrcodePrice = data.qrcode_price
            v.orderIds = orderIds
            resolve()
          }
        })
      }
      currentStatus === 'open' && this.$store.commit('modalType', 'qrcode')
      p ? p.then(() => this.modalAnimate({
        currentStatus: currentStatus,
        modalClass: 'd-modal-animate-pay'
      })) : this.modalAnimate({
        currentStatus: currentStatus,
        modalClass: 'd-modal-animate-pay'
      })
    },
    tapModalHeader (e) {
      this.sectionIdx = Number(e.currentTarget.dataset.index)
    },
    tapModalConfirm (e) {
      let v = this
      let addrSection = this.$refs['address-section']
      let currentIndex = e.currentTarget.dataset.index
      if (currentIndex === '0') {
        // 选择地址
        this.$parent.selectedAddress = v.addresses[v.selectedAddressIdx]
        v.showModalStatus = false
        uni.showToast({
          title: '已选择地址'
        })
        this.toggleModal('close')
      } else if (currentIndex === '1') {
        // 检查数据
        if (!isVaildAddressForm(addrSection.$props.addressForm)) return
        new Promise(async (resolve, reject) => {
          let data = await api.postAddress(addrSection.$props.addressForm)
          if (!data) return
          uni.showToast({
            title: '已添加地址'
          })
          addrSection.initForm()
          resolve()
        }).then(async () => {
          let data = await api.getAddresses()
          if (!data) return
          v.setAddresses(data)
          let firstAddress = v.addresses[0]
          if (firstAddress.is_default) {
            this.$parent.selectedAddress = firstAddress
          }
          this.toggleModal('close')
        })
      }
    },
    checkAddress (e) {
      this.selectedAddressIdx = e.detail.value
    },
    selectGoodsType: function (e) {
      let idx = Number(e.currentTarget.dataset['index'])
      this.$store.commit('currGoodsType', this.goodsTypes[idx])
      this.$store.commit('currGoodsTypeIdx', idx)
      this.$store.commit('goodsTypeCount', 1)
    },
    inputGoodsTypeCount: function (e) {
      let count = Number(e.detail.value)
      let maxCount = this.currGoodsType.count
      if (isNaN(count)) {
        count = 1
      } else {
        count = Number(count)
        if (count < 1) {
          count = 1
        } else if (count > maxCount) {
          count = maxCount
        }
      }
      this.$store.commit('goodsTypeCount', count)
    },
    updateGoodsTypeCount (e) {
      let cType = e.currentTarget.dataset.type
      let maxCount = this.currGoodsType.count
      let goodsTypeCount = this.goodsTypeCount
      if (cType === 'add' && goodsTypeCount < maxCount) {
        this.increment('goodsTypeCount')
      }
      if (cType === 'sub' && goodsTypeCount > 1) {
        this.reduce('goodsTypeCount')
      }
    },
    confirm (e) {
      let cType = this.showModalType
      if (cType === 'pay') {
        // 跳转到确认订单页
        uni.navigateTo({
          url: '/pages/detail/order-confirm?goods_types=' + JSON.stringify([{
            id: this.currGoodsType.id,
            count: this.goodsTypeCount
          }])
        })
        this.$store.commit('showModalStatus', false)
        this.$store.commit('modalClass', '')
        this.$store.commit('modalType', null)
      } else if (cType === 'cart') {
        // 添加到购物车
        cartAdd(this.currGoodsType.id, this.goodsTypeCount)
        uni.showToast({
          title: '成功添加至购物车'
        })
        this.toggleModal('close')
      }
    }
  }
}
</script>

<style lang="less">
  @import (reference) "~@/styles/index.less";
  .modal-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 900;
    background: #000;
    opacity: 0.5;
    overflow: hidden;
  }
  /*content*/
  .modal-box {
    position: fixed;
    z-index: 901;
    width: 100%;
    min-height: 80%;
    border-radius: 5px 5px 0 0;
    background-color: #FFF;
    bottom: 72px;
  }
  .modal-pay-box{
    position: fixed;
    z-index: 901;
    width: 100%;
    height: 70%;
    transform: scale(0);
    top: 15%;
    border-radius: 5px 5px 0 0;
  }
  .modal-container-pay{
    margin: auto !important;
    position: relative;
    width: 72%;
  }
  .modal-container > div{
    background-color: #FFF;
  }
  .modal-header{
    padding:0 15px;
    text-align: center;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-bottom: 1px solid #EDEDED;
  }
  .modal-header-goods{
    min-height: 85px;
    padding-top: 5px;
  }
  .modal-header-address{
    min-height: 80px;
    align-items: center;
  }
  .modal-header-pay{
    min-height: 50px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }
  .modal-title-goods > div:nth-of-type(1){
    position: fixed;
    width: 140px;
    height: 140px;
    margin-top: -70px;
    border-radius: 12px;
  }
  .modal-title-goods > div > image{
    border-radius: 6px;
    width: 100%;
    height: 100%;
  }
  .modal-title-goods > div:nth-of-type(2) {
    margin: 15px 0 0 150px;
  }
  .modal-title-address{
    align-self: stretch;
    display: flex;
    justify-content: space-between;
    width: 50%;
    padding-bottom: .5px;
  }
  .modal-title-address > div{
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    border-bottom: 3.5px solid #FFF;
  }
  .modal-title-select{
    border-bottom: 3.5px solid #D0021B!important;
  }
  .modal-content {
    min-height: 100%;
    margin-bottom: 72px;
  }
  .modal-content-addres{
    background-color: #FFF;
  }
  .modal-content-pay{
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
  }
  .modal-section-pay{
    padding: 16px 8px;
  }
  .modal-section-pay-tip{
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    text-align: center;
  }
  .modal-section-pay-price-clipboard{
    background-color: #bebebe!important;
    text-align: center;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
  }
  .modal-section-pay-qrcode{
    width: 72%;
  }
  .modal-section-pay-price{
    position: relative;
  }
  .modal-section-pay-price span{
    margin-right: 10px;
  }
  .modal-section-pay-price-copy{
    position: absolute;
    right: -48px;
    bottom: -6px;
  }
  .modal-close-btn-o{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1.2px solid #989898;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 22px;
  }
  .modal-close-btn-o > span{
    font-weight: lighter !important;
    color: #989898;
  }
  .modal-close-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1.2px solid #cacaca;
    background-color: #cacaca;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    font-size: 22px;
  }
  .modal-close-btn > span{
    font-weight: lighter !important;
    color: #FFF;
  }
  .modal-content-section{
    padding: 12px 0;
    margin: 0 15px;
    font-size: 16px;
  }
  .modal-content-section:first-of-type{
    border-bottom: 1px solid #cacaca;
  }
  .modal-content-address-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #cacaca;
  }
  .modal-content-section > div:nth-of-type(2){
    margin-top: 12px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }
  .goods-type-count-text{
    font-size: 13.5px;
    padding-left: 8px;
    color: #bebebe;
  }
  .modal-content-goods-types{
    display: flex;
    flex-flow: row wrap;
  }
  .modal-content-goods-types-item{
    margin: 8px 4px;
    padding: 4px 10px;
    border: 1.5px solid #cacaca;
    text-align: center;
  }
  .modal-content-goods-count{
    width: 40%;
    display: flex;
    border: 1.5px solid #cacaca;
    font-size: 18px;
  }
  .modal-content-goods-count input{
    text-align: center;
    font-size: 15px;
  }
  .count-operator{
    width: 100px;
    text-align: center;
    padding: 5px 0;
  }
  .count-operator:first-of-type{
    border-right: 1.5px solid #cacaca;
  }
  .count-operator:last-of-type{
    border-left: 1.5px solid #cacaca;
  }
  .modal-section-pay-btngroup{
    display: flex;
    height: 60px;
  }
  .modal-section-pay-btngroup > div{
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
  }
  .pay-btn-close{
    border-right: .6px solid #bebebe;
  }
  .pay-btn-confirm{
    border-left: .6px solid #bebebe;
    color: #44b549;
  }
  .modal-animation(modal-animate-show, 100%, 20%, 0, 1);
  .d-modal-animate-show {
    top: 20%;
    opacity: 1;
    .animation(modal-animate-show, .2s)
  }
  .modal-animation(modal-animate-hide, 20%, 100%, 1, 0);
  .d-modal-animate-hide {
    top: 100%;
    opacity: 0;
    .animation(modal-animate-hide, .2s)
  }
  .modal-animation-pay(modal-animate-pay-show, 0, 1, 0, 1);
  .d-modal-animate-pay-show {
    transform: scale(1, 1);
    opacity: 1;
    .animation(modal-animate-pay-show, .2s)
  }
  .modal-animation-pay(modal-animate-pay-hide, 1, 0, 1, 0);
  .d-modal-animate-pay-hide {
    transform: scale(1, 0);
    .animation(modal-animate-pay-hide, .2s)
  }
</style>
