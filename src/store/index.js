import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    banners: [],
    addresses: [],

    goodies: [],
    slides: [],
    news: [],
    topics: [],

    goods: null,
    currGoodsType: null,
    goodsTypes: [],
    currGoodsTypeIdx: 0,
    goodsTypeCount: 1,

    showModalStatus: false,
    modalClass: '',
    modalType: null,

    freight: 0,
    totalCount: 0,
    totalPrice: 0,

    showNocontentStatus: false
  },
  mutations: {
    increment (state, t) {
      state[t]++
    },
    reduce (state, t) {
      state[t]--
    },
    banners (state, data) {
      state.banners = data
    },
    addresses (state, data) {
      state.addresses = data
    },
    goodies (state, data) {
      state.goodies = data
    },
    goods (state, data) {
      state.goods = data
    },
    currGoodsType (state, data) {
      state.currGoodsType = data
    },
    goodsTypes (state, data) {
      state.goodsTypes = data
    },
    currGoodsTypeIdx (state, data) {
      state.currGoodsTypeIdx = data
    },
    goodsTypeCount (state, data) {
      state.goodsTypeCount = data
    },
    showModalStatus (state, data) {
      state.showModalStatus = data
    },
    modalClass (state, data) {
      state.modalClass = data
    },
    modalType (state, data) {
      state.modalType = data
    },
    freight (state, data) {
      state.freight = data
    },
    totalCount (state, data) {
      state.totalCount = data
    },
    totalPrice (state, data) {
      state.totalPrice = data
    },
    showNocontentStatus (state, data) {
      state.showNocontentStatus = data
    }
  },
  actions: {
    async getGoods ({ commit }, goodsId) {
      const data = await api.getGoods(goodsId)
      if (!data || !data.goods_types || data.goods_types.length === 0) return
      commit('goods', data.goods)
      commit('goodsTypes', data.goods_types)
      commit('currGoodsType', data.goods_types[0])
      commit('currGoodsTypeIdx', 0)
      commit('goodsTypeCount', 1)
      return data
    },
    async getHomeData ({ commit }) {
      const homeData = await api.getHomeData()
      if (!homeData) return
      commit('banners', homeData.banners)
      commit('goodies', homeData.goodses)
    },
    async setAddresses ({ commit }, data) {
      if (!data) {
        data = await api.getAddresses()
      }
      if (!data) return
      commit('addresses', data.addresses)
    },
    async getOrderConfirmData ({ commit }, data) {
      data = await api.getOrderConfirmData(data)
      if (!data) return
      commit('addresses', data.addresses)
      commit('freight', data.freight)
      commit('totalCount', data.total_count)
      commit('totalPrice', data.total_price)
      return data
    },
    modalAnimate ({ commit }, { currentStatus, modalClass }) {
      // 关闭
      if (currentStatus === 'close') {
        commit('modalClass', modalClass + '-hide')
        setTimeout(function () {
          commit('showModalStatus', false)
        }, 200)
      }
      // 显示
      if (currentStatus === 'open') {
        commit('modalClass', modalClass + '-show')
        commit('showModalStatus', true)
      }
    },
    initModal ({ commit }) {
      commit('modalClass', '')
      commit('modalType', null)
      commit('showModalStatus', false)
    }
  }
})

export default store
