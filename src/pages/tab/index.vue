<template lang="pug">
.container
  swiper.slider-wrap.section(
  v-if="banners.length",
  indicator-dots,
  autoplay,
  circular,
  interval=5000,
  duration=1000)
    swiper-item(
    v-for="(banner, index) of banners",
    :key="index")
      image.slider-item(:src="baseAssetsApi + banner.img"
      mode='scaleToFill'
      @click="turn(banner)")
  .section.container-goods.btn-footer
    goods-item(
    v-for="goods of goodies",
    :goods="goods"
    :key="goods.id")
</template>

<script>
import { mapState, mapActions } from 'vuex'
import goodsItem from '@/components/goods-item'
import { setCartTabBarBadge } from '@/utils'
export default {
  components: {
    goodsItem
  },
  computed: {
    ...mapState([
      'banners',
      'goodies'
    ])
  },
  onShow () {
    setCartTabBarBadge()
    uni.startPullDownRefresh()
  },
  async onPullDownRefresh () {
    await this.getHomeData()
    uni.stopPullDownRefresh()
  },
  methods: {
    ...mapActions([
      'getHomeData'
    ]),
    turn (banner) {
      const { url, goods } = banner
      uni.navigateTo({
        url: url || `/pages/detail/goods?goodsId=${goods}`
      })
    }
  }
}
</script>

<style lang="less">
  .slider-wrap {
    width: 100%;
    height: 215px;
  }
  .slider-item {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
