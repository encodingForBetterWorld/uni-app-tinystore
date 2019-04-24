<template lang="pug">
.section-item.section-item-order
  .item-order-header
    .item-order-header-text.item-order-header-text-checkbox(v-if="item.status==0")
      checkbox(:value="index"
      :checked="checked")
      span {{item.name}}
    div(v-else)
      .item-order-header-text
        span {{item.name}}
    .item-order-header-status
      .unpay-status(v-if="item.status==0") 待付款
      .paying-status(v-else-if="item.status==1") 已完成
      div(v-else-if="item.status==2") 已取消
      .unpay-status(v-else-if="item.status==3") 确认交易中
      .unpay-status(v-else-if="item.status==4") 安排发货中
      .paying-status(v-else-if="item.status==5") 物流进行中
  .item-order-body(@click="turn")
    order-section(v-for="orderItem of item.orderitem_set"
    :order="orderItem")
  .item-order-footer
    .item-order-total-info
      span 共{{item.total_count}}件商品
      span 总价：{{item.total_price}}
      span （含运费{{item.freight}}）
    .order-btngroup(v-if="item.status==0")
      .order-btn-close(:data-id="item.id"
      :data-index="index"
      data-type='list'
      @click='singleClose') 关闭订单
      .order-btn-pay(:data-id="item.id"
      :data-index="index"
      data-type='list'
      @click='singlePay') 继续支付
    .order-btngroup(v-else)
      .order-btn-close(@click="turn") 查看详情
</template>

<script>
import orderSection from '@/components/order-section'
export default {
  components: { orderSection },
  props: {
    checked: null,
    index: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    turn () {
      uni.navigateTo({
        url: `/pages/detail/order?id=${this.item.id}`
      })
    },
    singleClose (e) {
      this.$parent.$parent.$parent.singleClose(e)
    },
    singlePay (e) {
      this.$parent.$parent.$parent.singlePay(e)
    }
  }
}
</script>

<style lang="less">
  .section-item-order{
    flex-flow: column nowrap;
  }
  .item-order-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 12px;
    height: 80px;
  }
  .item-order-header-text{
    width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-size: 16px;
  }
  .item-order-header-text-checkbox > span{
    padding-left: 10px;
  }
  .item-order-header-status > div{
    color: #bebebe;
    font-size: 15px;
    font-weight: bold;
  }
  .unpay-status{
    color: #D0021B !important;
  }
  .paying-status{
    color: #44b549 !important;
  }
  .item-order-body{
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    background-color: #f9f9f9;
  }

  .item-order-footer{
    padding: 10px 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 15px;
  }
  .item-order-total-info > span{
    font-weight: normal;
    margin-left: 6px;
  }
  .order-btngroup{
    display: flex;
    font-size: 16px;
    padding: 15px 0 6px 0;
  }
  .order-btngroup > div{
    padding: 3px 12px;
    margin-right: 6px;
  }
  .order-btn-close{
    border: 1.6px solid #b1b1b1;
  }
  .order-btn-pay{
    color: #D0021B;
    border: 1.6px solid #D0021B;
  }
</style>
