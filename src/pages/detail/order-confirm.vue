<template lang="pug">
div
  .container
    order-address-section(v-if="selectedAddress"
    :modalDisable="modalDisable"
    :address="selectedAddress")
    .section.order-content.btn-footer(v-if="orderitem_set && orderitem_set.length > 0")
      .order-goods-list
        order-section(v-for="orderItem of orderitem_set"
        :order="orderItem")
      order-footer
      .order-remark
        div 买家留言：
        input(type='text'
        placeholder='请输入买家留言'
        placeholder-class="placeholder-text"
        v-model="remark"
        :disabled="orderId")
    custom-btn(btnType='single'
    text='确认付款'
    clickFunc='submitOrder')
  custom-modal(ref='modal'
  :sectionIdx="sectionIdx"
  :selectedAddress="selectedAddress")
</template>

<script>
import orderAddressSection from '@/components/order-address-section'
import orderSection from '@/components/order-section'
import customBtn from '@/components/custom-btn'
import customModal from '@/components/custom-modal'
import OrderFooter from '@/components/order-footer'
import { mapState, mapActions } from 'vuex'
import api from '../../utils/api'

export default {
  components: {
    OrderFooter,
    orderSection,
    orderAddressSection,
    customBtn,
    customModal
  },
  props: {
    orderitem_set: {
      type: Array,
      default () {
        return []
      }
    },
    remark: null,
    sectionIdx: null,
    orderId: null,
    modalDisable: null,
    selectedAddress: {
      type: Object,
      default () {
        return null
      }
    },
    form: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState([
      'addresses',
      'modalType'
    ])
  },
  onShow () {
    this.sectionIdx = 0
    this.modalDisable = false
    this.initData()
  },
  methods: {
    ...mapActions(['getOrderConfirmData']),
    toggleModal (e) {
      return this.$refs['modal'].toggleModal(e)
    },
    togglePayModal (e) {
      return this.$refs['modal'].togglePayModal(e)
    },
    async initData () {
      const { query } = this.$route
      const data = await this.getOrderConfirmData(query.goods_types)
      if (!data) return
      this.selectedAddress = null
      if (data.addresses.length > 0) {
        this.selectedAddress = (data.addresses[0].is_default && data.addresses[0]) || null
      }
      this.orderitem_set = data.order_datas
      if (!this.selectedAddress) {
        this.sectionIdx = data.addresses.length === 0 ? 1 : 0
        this.toggleModal({
          status: 'open',
          modal: 'address'
        })
      }
    },
    async submitOrder () {
      let v = this
      if (v.orderId) {
        v.togglePayModal({
          status: 'open',
          orderIds: v.qrcode ? null : [v.orderId]
        })
        return
      }
      if (!v.selectedAddress) {
        this.sectionIdx = 1
        v.toggleModal({
          status: 'open',
          modal: 'address'
        })
      } else {
        // 提交订单数据
        v.form.order_datas = v.orderitem_set.map((n) => { return { id: n.id, count: n.count } })
        v.form.address_id = v.selectedAddress.id
        new Promise(async (resolve, reject) => {
          resolve(await api.postOrderSubmit(v.form))
        }).then(data => {
          if (!data) return
          v.orderId = data.order_id
          v.modalDisable = true
          v.togglePayModal({
            status: 'open',
            orderIds: [v.orderId]
          })
        })
      }
    }
  }
}
</script>

<style lang="less">
  .order-remark{
    display: flex;
    flex-flow: row nowrap;
    margin: 5px 10px 20px 10px;
    padding: 4px 0;
    font-size: 14px;
    align-items: center;
    line-height: 30px;
    padding: 12px 0;
    border-top: 2px solid #EDEDED
  }
</style>
