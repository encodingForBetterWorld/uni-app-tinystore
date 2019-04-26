<template lang="pug">
.container
  address-section(ref='address-section')
  custom-btn(btnType='single'
  text='确认修改'
  clickFunc='editAddress')
</template>

<script>
  import addressSection from '@/components/address-section'
  import customBtn from '@/components/custom-btn'
  import api from '@/utils/api'
  export default {
    components: {
      addressSection,
      customBtn
    },
    onShow () {
      this.initData()
    },
    methods: {
      async initData () {
        const { query } = this.$route
        const data = await api.getAddress(query.id)
        if (!data) return
        const addrSection = this.$refs['address-section']
        addrSection.initFormWithValue(data.address)
      },
      async editAddress (e) {
        const addrSection = this.$refs['address-section']
        const { addressForm } = addrSection.$props
        if (!addrSection.vaildAddressForm(addressForm)) return
        wx.showModal({
          title: '提示',
          content: '即将修改收获地址',
          success: async res => {
            if (res.confirm) {
              const data = await api.postAddress(addressForm)
              if (!data) return
              uni.showToast({
                title: '修改地址成功'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="less">

</style>
