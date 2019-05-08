<template lang="pug">
.order-section
  image.order-section-img(:src="baseAssetsApi + order.img"
  mode='scaleToFill')
  .item-order-content
    .item-order-content-title {{order.name}}
    .item-order-content-type 型号：{{order.goods_type_name}}
  div
    .item-order-content-price
      span.money-logo ¥
      label {{order.price}}
    .item-order-content-count
      span ×
      span {{order.count}}
</template>
<script>
  import { mapState } from 'vuex'
export default {
  props: {
    order: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['baseAssetsApi'])
  }
}
</script>

<style lang="less">
  @import (reference) "~@/styles/index.less";
  .order-section{
    margin: 0 6px;
    min-height: 160px;
    border-bottom: 2px solid #D7D7D7;
    display: flex;
  }
  .order-section:last-of-type{
    border: none!important;
  }
  .order-section-img{
    width: 125px;
    height: 125px;
    margin-top:10px;
    flex-shrink: 0;
  }
  .order-section > div{
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
  }
  .order-section > div:nth-of-type(1){
    justify-content: space-between;
    width:320px;
  }
  .order-section > div:nth-of-type(2){
    justify-content: start;
  }
  .order-section > div{
    margin: 15px 8px;
  }
  .item-order-content > div{
    #text
  }
  .item-order-content-type{
    font-size:14px;
    color: #b1b1b1;
    -webkit-line-clamp: 3!important;
  }
  .item-order-content-price{
    font-size: 16px;
    text-align: end;
  }
  .item-order-content-count{
    margin-top:28px;
    font-weight: lighter !important;
    color: #000;
    text-align: end;
    font-size: 14px;
  }
  .item-order-content-count > span:nth-of-type(1){
    margin-right: 10px;
  }
  .item-order-content-title{
    font-size: 16px;
  }
  .item-order-content-title{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>
