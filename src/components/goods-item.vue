<template lang="pug">
.section-item.item-goods(
  @click="turn")
  image.item-goods-img(:src="baseAssetsApi + goods.img"
  mode='scaleToFill')
  .item-goods-content-list
    .title.item-goods-content {{goods.name}}
    .goods-desc.item-goods-content {{goods.description}}
    .price.item-goods-content ¥{{goods.min_price==goods.max_price?goods.min_price:goods.min_price+' ~ '+goods.max_price}}
</template>

<script>
  export default {
    props: {
      goods: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      turn () {
        const { id } = this.goods
        uni.navigateTo({
          url: `/pages/detail/goods?goodsId=${id}`
        })
      }
    }
  }
</script>

<style lang="less">
  @import (reference) "~@/styles/index.less";
  .item-goods-img{
    padding: 5px 8px;
    max-width: 46%;
    max-height: 180px;
    flex-shrink: 0;
  }
  .item-goods-content{
    margin: 10px 20px;
    padding: 5px;
    color: #0B0B0A;
  }
  .item-goods-content-list{
    display:flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    max-width: 50%;
    div{
      font-weight: bold;
      #text
    }
    .price {
      color: #8b572a
    }
    .goods-desc{
      font-weight: lighter;
      font-size: 12px;
      padding-right: 16px;
      -webkit-line-clamp: 3;
      color: #858585;
    }
  }
</style>
