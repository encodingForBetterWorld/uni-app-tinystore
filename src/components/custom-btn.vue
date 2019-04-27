<template lang="pug">
.btn-custom.btn-single(v-if="btnType==='single'" @click="click")
  .btn-pay-text
    span {{text}}
.btn-pay-custom.btn-pay.btn-tab(v-else-if="btnType==='pay'")
  .wrapper-checkbox-confirm-pay
    checkbox-group(@change="check")
      checkbox(:checked="checked")
        span 全选
  .wrapper-btn-confirm-pay
    .btn-pay-price
      span 共计：¥
      span {{ totalPrice && totalPrice.toFixed(2) }}
    .btn-confirm-pay(@click="click") {{text}}
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      btnType: null,
      text: null,
      clickFunc: null,
      checkFunc: null,
      checked: null
    },
    computed: {
      ...mapState([
        'totalPrice'
      ])
    },
    methods: {
      click (e) {
        if (!this.clickFunc) return
        return this.$parent[this.clickFunc](e)
      },
      check (e) {
        if (!this.checkFunc) return
        return this.$parent[this.checkFunc](e)
      }
    }
  }
</script>

<style lang="less">
  .btn-pay{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px
  }
  .btn-pay > div{
    margin: 0 8px;
    padding: 2px
  }
  .btn-pay span{
    font-weight: bold
  }
  .btn-pay-price{
    font-size: 14px;
    margin-right: 12px;
  }
  .btn-pay-price span:nth-of-type(1){
    opacity: 0.6;
    margin-right: 5px;
  }
  .btn-pay-custom{
    position: fixed;
    bottom: 0;
    justify-content: space-between;
    padding: 10px 0;
    border-top: 1px solid #cacaca;
    background-color: #FFF;
    width: 100%;
  }
  .wrapper-btn-confirm-pay {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-end;
    width: 60%;
  }
  .btn-confirm-pay{
    text-align: center;
    background-color: #D0021B;
    border: 2px solid #D0021B;
    padding: 3px 15px;
    color: #FFF;
    font-size: 16px;
    flex-shrink: 0;
  }
  .btn-tab{
    margin-bottom: 50px!important;
  }
</style>
