<template lang="pug">
.no-content-wrapper(v-if="isShow")
  image.no-content-img(src="/static/assets/empty.png"
  mode='scaleToFill')
  .no-content-text {{text}}
</template>

<script>
  export default {
    props: {
      text: {
        Object: String,
        default () {
          return ''
        }
      },
      isShow: {
        Object: Boolean,
        default () {
          return false
        }
      }
    },
    mounted () {
      const v = this
      setTimeout(() => {
        v.isShow = true
      }, 1000)
    }
  }
</script>

<style lang="less">
  .no-content-wrapper{
    text-align: center;
    bottom: 80px;
    position: absolute;
    width: 100%;
  }
  .no-content-text{
    text-align: center;
    color: #989898;
    font-size: 18px;
    font-weight: bold;
    opacity: .5;
  }
</style>
