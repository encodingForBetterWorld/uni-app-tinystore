<template lang="pug">
.container
  address-section(ref='address-section')
  custom-btn(btnType='single'
  text='确认添加'
  clickFunc='addAddress')
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
    methods: {
      async addAddress (e) {
        const addrSection = this.$refs['address-section']
        const { addressForm } = addrSection.$props
        if (!addrSection.vaildAddressForm(addressForm)) return
        const data = await api.postAddress(addressForm)
        if (!data) return
        uni.showToast({
          title: '添加地址成功'
        })
        addrSection.initForm()
      }
    }
  }
</script>

<style scoped>

</style>
