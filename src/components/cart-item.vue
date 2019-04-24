<template lang="pug">
.section-item.item-cart(
  :class="item.id==deleteId?'section-delete':'section'"
  @touchstart="touchStart"
  @touchmove="touchMove"
  :data-index="index")
  image.item-cart-img(:src="baseAssetsApi + item.img"
  mode='scaleToFill'
  @click="turn")
  .item-cart-content
    .item-cart-title.title
      checkbox(:value="index" :checked="checked") {{ item.goods.name }}
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
  .btn-delete(v-if="item.id==deleteId"
  @click="cartItemRemove"
  :data-index="index"
  :data-id="item.id") 删除
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    deleteId: null,
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
    turn () {
      uni.navigateTo({
        url: `/pages/detail/goods?goodsId=${this.item.goods.id}`
      })
    }
  }
}
</script>

<style lang="less">
  .item-cart{
    height: 175px;
    width: auto !important;
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
  }
  .item-cart-title{
    display: flex;
    align-content: center
  }
  .item-cart-count-picker{
    flex-basis: 60px;
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
