<template lang="pug">
.container
  .pl-settings
    .pl-settings-item.pl-settings-add(@click="turn('/pages/settings/address/add')")
      span 添加收货地址
      i.arrow.arrow-right
  .pl-settings
    .pl-addresses-list
      .pl-address-item(v-for="(item, index) of list"
      :class="item.id==deleteId?'section-delete':''"
      :style="'margin-left:'+(distX&&(index==currIdx)?(-1*distX+'%'):'0')"
      :data-index="index"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @touchcancel="touchEnd")
        .user-adderss-info
          div
            .user-adderss-info-name {{item.name}}
              span(v-if="item.is_default") （默认）
            div {{item.phone}}
          div {{item.province + item.city + item.area + item.detail}}
        .user-adderss-edit(@click="turn('/pages/settings/address/edit?id='+item.id)")
          image.fa-icon(src="/static/assets/fa-edit.png"
          mode='scaleToFill')
        .btn-delete(v-if="index==currIdx"
        @click="deleteAddress"
        :data-index="index"
        :data-id="item.id") 删除
        .btn-delete-blank(v-else)
</template>

<script>
  import btn from '@/utils/btn'
  import api from '@/utils/api'
  export default {
    props: {
      startX: null,
      deleteId: null,
      currIdx: null,
      distX: null,
      list: {
        type: Array,
        default () {
          return []
        }
      }
    },
    onShow () {
      this.initData()
    },
    async onPullDownRefresh () {
      await this.initData()
      uni.stopPullDownRefresh()
    },
    methods: {
      ...btn,
      async initData () {
        const data = await api.getAddresses()
        if (!data) return
        this.list = data.addresses
      },
      deleteAddress (e) {
        let v = this
        let idx = Number(e.currentTarget.dataset.index)
        let { list } = v.$props
        uni.showModal({
          title: '提示',
          content: '即将删除收获地址',
          success: async res => {
            if (res.confirm) {
              const data = await api.postAddress({
                id: v.deleteId,
                is_showing: false
              })
              if (!data) return
              list.splice(idx, 1)
              v.list = list
              v.deleteId = null
              v.currIdx = null
              uni.showToast({
                title: '删除地址成功'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .pl-settings-add{
    padding: 15px 8px;
  }
  .pl-addresses-list{
    display: flex;
    flex-flow: column nowrap;
  }
  .pl-address-item{
    display: flex;
    justify-content: space-between;
    border-bottom: 1.5px solid #EDEDED;
    background-color: #FFF;
    width: 110%;
  }
  .user-adderss-edit{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
  }
  .user-adderss-info {
    width: 90%!important;
  }
</style>
