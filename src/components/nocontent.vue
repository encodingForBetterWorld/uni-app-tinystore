<template lang="pug">
.no-content-wrapper(v-if="showNocontentStatus")
  image.no-content-img(src="/static/assets/empty.png"
  mode='scaleToFill')
  .no-content-text {{text}}
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      text: {
        Object: String,
        default () {
          return ''
        }
      }
    },
    computed: {
      ...mapState([
        'showNocontentStatus'
      ])
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
