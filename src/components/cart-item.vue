<template lang="pug">
.section-item.item-cart(
  :class="item.id==deleteId?'section-delete':'section'"
  :style="'margin-left:'+(distX&&(index==currIdx)?(-1*distX+'%'):'')"
  @touchstart="touchStart"
  @touchmove="touchMove"
  @touchend="touchEnd"
  @touchcancel="touchEnd"
  :data-index="index")
  .item-cart-info
    image.item-cart-img(:src="baseAssetsApi + item.img"
    mode='scaleToFill'
    @click="turn")
    .item-cart-content
      .item-cart-title.title
        checkbox(:value="index" :checked="checked")
          div {{ item.goods.name }}
      div
        .item-cart-type 型号：{{ item.description }}
        .price
          span ¥{{item.price}}
          span ×
          span {{item.select_count}}
  .item-cart-count-picker
    .arrow.arrow-top(@click="cartCountEdit" :data-index="index" data-type='add' :data-id='item.id')
    span {{item.select_count}}
    .arrow.arrow-bottom(@click="cartCountEdit" :data-index="index" data-type='sub' :data-id='item.id')
  .btn-delete(v-if="index==currIdx"
  @click="cartItemRemove"
  :data-index="index"
  :data-id="item.id") 删除
  .btn-delete-blank(v-else)
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    deleteId: null,
    currIdx: null,
    distX: null,
    index: null,
    checked: null,
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapState([
      'totalPrice'
    ])
  },
  methods: {
    cartCountEdit (e) {
      this.$parent.$parent.cartCountEdit(e)
    },
    cartItemRemove (e) {
      this.$parent.$parent.cartItemRemove(e)
    },
    touchStart (e) {
      this.$parent.$parent.touchStart(e)
    },
    touchMove (e) {
      this.$parent.$parent.touchMove(e)
    },
    touchEnd (e) {
      this.$parent.$parent.touchEnd(e)
    },
    turn () {
      uni.navigateTo({
        url: `/pages/detail/goods?goodsId=${this.item.goods.id}`
      })
    }
  }
}
</script>

<style lang="less">
  @import (reference) "~@/styles/index.less";
  .item-cart{
    height: 175px;
    width: 110%;
  }
  .item-cart-info {
    display: flex;
    width: 90%;
  }
  .item-cart-img{
    width: 160px;
    height: 160px;
    padding: 5px 8px;
    flex-shrink: 0;
  }
  .item-cart-type{
    font-size:14px;
    color: #b1b1b1;
    margin-bottom: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .item-cart-content{
    margin: 15px 10px;
    padding: 2px;
    font-family: arial,sans-serif;
    color: #0B0B0A;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 118px;
  }
  .item-cart-content div {
    #text
  }
  .item-cart-title{
    display: flex;
    align-content: center;
  }
  .item-cart-count-picker{
    width: 10%;
    min-width: 42px;
    height: 168px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
    font-size: 20px;
  }
</style>
