<template lang="pug">
.order-footer
  .order-price
    div
      div 商品金额：
      div
        span.money-logo ¥
        label {{totalPrice && totalPrice}}
    div
      div 运费：
      div
        span.money-logo ¥
        label {{ freight && freight }}
    div
      div 实付款：
      .money-logo-line
        .money-logo-lg ¥
        div {{ (totalPrice+freight) && (totalPrice+freight) }}
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState([
        'totalPrice', 'freight'
      ])
    }
  }
</script>

<style lang="less">
</style>
