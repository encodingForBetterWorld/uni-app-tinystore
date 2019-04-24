<template lang="pug">
.section-item.item-goods(
  @click="turn")
  image.item-goods-img(:src="baseAssetsApi + goods.img"
  mode='scaleToFill')
  .item-goods-content-list
    .title.item-goods-content
      span {{goods.name}}
    .goods-desc.item-goods-content
      span {{goods.description}}
    .price.item-goods-content
      span ¥{{goods.min_price==goods.max_price?goods.min_price:goods.min_price+'~'+goods.max_price}}
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
  .item-goods-img{
    padding: 5px 8px;
    max-width: 46%;
    max-height: 180px;
  }
  .item-goods-content{
    margin: 10px 20px;
    padding: 5px;
    color: #0B0B0A;
  }
  .item-goods-content-list{
    display:flex;
    flex-grow: 1;
    flex-flow: column nowrap;
    justify-content: space-around
  }
  .goods-desc{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    font-weight: lighter !important;
    font-size: 12px;
    padding-right: .2rem;
    color: #858585;
  }
</style>
