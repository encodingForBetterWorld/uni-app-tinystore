<template lang="pug">
.section.user-address(@click="toggleModal" data-status='open' data-modal='address')
  image.icon-user-address(src='/static/assets/fa-map-marker-gray.png'
  mode='scaleToFill')
  .user-adderss-info
    div
      div 收件人：{{address.name}}
      div {{address.phone}}
    div 收货地址：{{address.province + address.city + address.area + address.detail}}
  image.fa-icon(src="/static/assets/fa-edit.png"
  v-if="!modalDisable"
  mode='scaleToFill')
</template>

<script>
  export default {
    props: {
      modalDisable: null,
      address: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    methods: {
      toggleModal (e) {
        if (this.modalDisable) return
        this.$parent.toggleModal(e)
      }
    }
  }
</script>

<style lang="less">

</style>
