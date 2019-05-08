<template lang="pug">
.container
  .pl-settings
    .pl-settings-item.settings-user-item(@click="turn('/pages/settings/address/index')")
      span 收货地址
      i.arrow.arrow-right
  .pl-settings
    .pl-settings-item.settings-system-item(@click="turn('https://33code.online/author/wang/', true)")
      span 关于开发者
      i.arrow.arrow-right
    .pl-settings-item.settings-system-item(@click="turn('https://uniapp.dcloud.io/', true)")
      span 关于uni-app
      i.arrow.arrow-right
    .pl-settings-item.settings-system-item(@click="turn('https://github.com/encodingForBetterWorld/uni-app-tinyStore/', true)")
      span 项目源码
      i.arrow.arrow-right
</template>

<script>
  export default {
    methods: {
      turn (url, href) {
        if (href) {
          window.location.href = url
          return
        }
        uni.navigateTo({
          url: url
        })
      }
    }
  }
</script>

<style lang="less">

</style>
