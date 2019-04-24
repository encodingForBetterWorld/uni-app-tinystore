<template lang="pug">
.order-footer
  .order-price
    div
      div 商品金额：
      div
        span.money-logo ¥
        label {{totalPrice}}
    div
      div 运费：
      div
        span.money-logo ¥
        label {{freight}}
    div
      div 实付款：
      .money-logo-line
        .money-logo-lg ¥
        div {{totalPrice+freight}}
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
