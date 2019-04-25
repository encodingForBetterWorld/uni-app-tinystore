<template lang="pug">
div
  .container(v-if="goods")
    .section.goods-details-header
      image.goods-details-img(:src="baseAssetsApi + goods.img"
      mode='scaleToFill')
      .goods-name-txt {{goods.name}}
      .money-logo-line
        .money-logo-lg ¥
        div {{goods.min_price==goods.max_price?goods.min_price:goods.min_price+'~'+goods.max_price}}
    .section.goods-details-desc {{goods.description}}
    .btn-custom.btn-goods-confirm
      div(@click="toggleModal" data-status='open' data-type='cart' data-modal='goods')
        span 加入购物车
      div(@click="toggleModal" data-status='open' data-type='pay' data-modal='goods')
        span 立即购买
  custom-modal(ref='modal')
</template>

<script>
import customModal from '@/components/custom-modal'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    customModal
  },
  computed: {
    ...mapState([
      'goods',
      'currGoodsType',
      'goodsTypes',
      'currGoodsTypeIdx',
      'goodsTypeCount'
    ])
  },
  onShow () {
    this.$store.commit('modalType', 'goods')
    this.initData()
  },
  methods: {
    ...mapActions([
      'getGoods'
    ]),
    async initData () {
      const { query } = this.$route
      const data = await this.getGoods(query.goodsId)
      if (!data) return
      const { name } = data.goods
      uni.setNavigationBarTitle({
        title: name.length > 9 ? name.substr(0, 9) + '...' : name
      })
    },
    toggleModal (e) {
      this.$refs['modal'].toggleModal(e)
    }
  }
}
</script>

<style lang="less">
.btn-goods-confirm{
  display: flex;
  align-items: stretch;
  border-top: 2px solid #b1b1b1;
}
.btn-goods-confirm > div{
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #FFF;
}
.btn-goods-confirm > div:nth-of-type(1){
  border-right: 2px solid #b1b1b1;
}
.goods-details-header{
  display: flex;
  flex-flow: column nowrap;
  background-color: #FFF;
}
.goods-details-header > div{
  width: 90%;
  margin:15px 5%;
}
.goods-details-header > div:nth-of-type(2){
  margin-top: 20px !important;
  margin-bottom: 5px !important;
}
.goods-details-header > div:nth-of-type(3){
  margin-top: 0 !important;
  margin-bottom: 42px !important;
}
.goods-details-img{
  height: 320px;
  width: 100%;
}
.goods-details-desc{
  background-color: #FFF;
  font-size: 14px;
  color: #858585;
  padding: 25px 16px;
  min-height: 160px;
}
.goods-name-txt{
  font-size: 28px;
  font-weight: bold;
  font-family: "microsoft yahei";
}
</style>
