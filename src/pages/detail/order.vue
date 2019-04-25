<template lang="pug">
div
  .container
    order-address-section(v-if="orderAddress"
    :address="orderAddress"
    modalDisable="false")
    .section.order-content(v-if="order.orderitem_set && order.orderitem_set.length > 0")
      .order-goods-list
        order-section(v-for="orderItem of order.orderitem_set"
        :order="orderItem")
      order-footer(:totalPrice="order.total_price"
      :freight="order.freight")
    .express-trace-list
      div(v-if="order.status==5 || order.status==1"
      v-for="(expresstrace, index) of order.expresstrace_set"
      :class="index==0?'latest':''")
        div {{expresstrace.time}}
        div {{expresstrace.status}}
      .express-trace-item.latest(v-if="order.status==3")
        div 商家正在确认收款
      .express-trace-item.latest(v-if="order.status==4")
        div 商家正在安排发货
    .section.order-content-footer(v-if="order.code"
    :class="(order.status===0)?'btn-footer':''")
      div 订单号：{{order.code}}
      div(v-if="order.status==5 || order.status==1") 物流单号：{{order.express_code}}
      div 下单时间：{{order.create_time}}
    .order-content-btngroup(v-if="order.status==0")
      .order-btngroup
        .order-btn-close(:data-id="order.id" data-type='detail' @click="singleClose") 关闭订单
        .order-btn-pay(:data-id="order.id" @click="singlePay") 继续支付
  custom-modal(ref="modal")
</template>

<script>
import orderAddressSection from '@/components/order-address-section'
import orderSection from '@/components/order-section'
import customModal from '@/components/custom-modal'
import OrderFooter from '@/components/order-footer'
import api from '@/utils/api'
import { mapState } from 'vuex'
import btn from '@/utils/btn'
export default {
  components: {
    orderAddressSection, orderSection, customModal, OrderFooter
  },
  computed: {
    ...mapState([
      'totalPrice',
      'freight'
    ])
  },
  props: {
    order: {
      type: Object,
      default () {
        return {}
      }
    },
    orderAddress: {
      type: Object,
      default () {
        return {
          name: null,
          phone: null,
          province: null,
          city: null,
          area: null,
          detail: null
        }
      }
    }
  },
  onShow () {
    this.initData()
  },
  methods: {
    ...btn,
    async initData () {
      const { query } = this.$route
      const data = await api.getOrder(query.id)
      if (!data) return
      if (data.expresstrace_set instanceof Array) {
        data['expresstrace_set'] = data.expresstrace_set.sort((i1, i2) => {
          if (i1.time < i2.time) return 1
          else if (i1.time > i2.time) return -1
          else return 0
        })
      }
      this.order = data
      this.orderAddress.name = data.addressee_name
      this.orderAddress.phone = data.addressee_phone
      this.orderAddress.province = data.addressee_province
      this.orderAddress.city = data.addressee_city
      this.orderAddress.area = data.addressee_area
      this.orderAddress.detail = data.addressee_detail
      this.$store.commit('totalPrice', data.total_price)
      this.$store.commit('freight', data.freight)
    },
    togglePayModal (e) {
      return this.$refs['modal'].togglePayModal(e)
    }
  }
}
</script>

<style lang="less">
  .order-content-footer, .order-content-btngroup, .express-trace-list{
    display: flex;
    width: 100%;
  }
  .order-content-footer, .order-content-btngroup{
    background-color: #FFF;
  }
  .order-content-footer, .express-trace-list{
    flex-flow: column nowrap;
  }
  .order-content-footer{
    padding: 6px 10px;
  }
  .order-content-footer > div{
    margin: 8px 0;
    font-size: 12px;
  }
  .order-content-btngroup{
    position: fixed;
    bottom: 0;
    flex-flow: row nowrap;
    justify-content: flex-end;
    padding: 10px 0;
    border-top: 1px solid #cacaca;
  }
  .order-btngroup{
    display: flex;
    width: 60%;
    justify-content: space-around;
    font-size: 14px;
  }
  .order-btngroup > div{
    padding: 6px 18px;
  }
  .order-btn-close{
    border: 1.5px solid #b1b1b1;
  }
  .order-btn-pay{
    background-color: #D0021B;
    border: 2px solid #D0021B;
    color: #FFF;
  }
  .express-trace-list{
    margin-left: 8px;
  }
  .express-trace-list>div{
    display: flex;
    align-items: center;
    padding: 20px 0;
    font-size: 12px;
    margin-right: 10px;
    border-left: 1.5px solid #d9d9d9;
  }
  .express-trace-list > div > div{
    padding: 5px 12px;
  }
  .express-trace-list > div > div:nth-of-type(1){
    max-width: 30%;
  }
  .express-trace-list > div > div:nth-of-type(2){
    max-width: 60%;
  }
  .express-trace-list>div::before{
    content: '';
    border: 4px solid #EDEDED;
    border-radius: 4px;
    background-color: #d9d9d9;
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-left: -8px;
  }
  .express-trace-list .latest{
    color: #fe4300;
  }
  .express-trace-list .latest::before{
    background-color: #fe4300;
    border-color:#f8e9e4;
  }
</style>
