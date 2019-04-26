<template lang="pug">
scroll-view.container(scroll-y
@scrolltolower="getGoodsListByPage")
  swiper.slider-wrap.section(
  v-if="banners.length"
  :indicator-dots="banners.length > 1"
  :autoplay="banners.length > 1"
  circular
  interval=5000
  duration=1000
  indicator-color="rgba(190, 190, 190, .3)"
  indicator-active-color="rgba(244, 53, 48 , .7)")
    swiper-item(
    v-for="(banner, index) of banners",
    :key="index")
      image.slider-item(:src="baseAssetsApi + banner.img"
      mode='scaleToFill'
      @click="turn(banner)")
  .section.container-goods(v-if="goodies&&goodies.length>0")
    goods-item(v-for="goods of goodies",
    :goods="goods"
    :key="goods.id")
    .nomore(v-if="page.page===page.page_max") 没有更多商品了
  no-content(v-else
  text='暂无商品')
</template>

<script>
import { mapState, mapActions } from 'vuex'
import goodsItem from '@/components/goods-item'
import { setCartTabBarBadge } from '@/utils'
import noContent from '@/components/nocontent'
import api from '@/utils/api'
export default {
  components: {
    goodsItem,
    noContent
  },
  computed: {
    ...mapState([
      'banners',
      'goodies'
    ])
  },
  data: function () {
    return {
      page: {
        page: 1,
        page_max: 0
      }
    }
  },
  onShow () {
    setCartTabBarBadge()
    uni.startPullDownRefresh()
  },
  async onPullDownRefresh () {
    this.$store.commit('showNocontentStatus', false)
    const data = await this.getHomeData()
    this.$store.commit('showNocontentStatus', true)
    if (!data) return
    this.page = data.page || {
      page: 1,
      page_max: 1
    }
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
    },
    async getGoodsListByPage (e) {
      if (this.page.page === this.page.page_max) return
      const data = await api.getGoodsList(this.page.page + 1)
      this.page.page++
      this.$store.commit('goodies', this.goodies.concat(data.goodses))
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
  .container {
    position: absolute;
    top: 0;
    bottom: 0;
  }
</style>
