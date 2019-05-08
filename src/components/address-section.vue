<template lang="pug">
div(:class="sectionType==='modal'?'modal-content modal-content-address': ''")
  .address-section-form
    .address-section-form-item
      div 收货人姓名
      div
        input(type='text'
        placeholder='请输入收货人姓名'
        placeholder-class='placeholder-text'
        v-model="addressForm.name"
        data-name='name'
        @click="inputAddressFrom"
        :class="errMsgs.name?'d-err-input-animate err-input':''")
      .err-text(v-if="errMsgs.name") {{errMsgs.name}}
    .address-section-form-item
      div 手机号码
      div
        input(type='text'
        placeholder='请输入收货人手机号码'
        placeholder-class='placeholder-text'
        v-model="addressForm.phone"
        data-name='phone'
        @click="inputAddressFrom"
        :class="errMsgs.phone?'d-err-input-animate err-input':''")
      .err-text(v-if="errMsgs.phone") {{errMsgs.phone}}
    .address-section-form-item(v-if="pNames && pNames.length > 0")
      div 所在地区
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="pNames" data-level="0")
          .picker(:class="addressForm.province?'':'placeholder-text'") {{ addressForm.province || '请选择'}}
      .err-text(v-if="errMsgs.province") {{errMsgs.province}}
    .address-section-form-item(v-if="cNames && cNames.length > 0")
      div
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="cNames" data-level="1")
          .picker(class="addressForm.city?'':'placeholder-text'") {{ addressForm.city || '请选择'}}
      .err-text(v-if="errMsgs.city") {{errMsgs.city}}
    .address-section-form-item(v-if="aNames && aNames.length > 0")
      div
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="aNames" data-level="2")
          .picker(class="addressForm.area?'':'placeholder-text'") {{ addressForm.area || '请选择'}}
      .err-text(v-if="errMsgs.area") {{errMsgs.area}}
    .address-section-form-item
      div 详细地址
      div
        input(type='text'
        placeholder='请输入街道地址'
        placeholder-class='placeholder-text'
        v-model="addressForm.detail"
        data-name='detail'
        @click="inputAddressFrom"
        :class="errMsgs.detail?'d-err-input-animate err-input':''")
      .err-text(v-if="errMsgs.detail") {{errMsgs.detail}}
  .address-section-form
    .address-section-default
      div 设置默认地址
      div
        switch(:checked="addressForm.is_default"
        @change="changeAddressFrom"
        data-name='is_default')
</template>

<script>
import areaDict from '@/utils/area'
export default {
  props: {
    sectionType: null,
    provinces: {
      type: Array,
      default () {
        return []
      }
    },
    cities: {
      type: Array,
      default () {
        return []
      }
    },
    areas: {
      type: Array,
      default () {
        return []
      }
    },
    pNames: {
      type: Array,
      default () {
        return []
      }
    },
    cNames: {
      type: Array,
      default () {
        return []
      }
    },
    aNames: {
      type: Array,
      default () {
        return []
      }
    },
    addressForm: {
      type: Object,
      default () {
        return {
          name: '',
          phone: '',
          province: null,
          city: null,
          area: null,
          detail: '',
          is_default: false
        }
      }
    },
    errMsgs: {
      type: Object,
      default () {
        return {
          name: null,
          phone: null,
          province: null,
          city: null,
          area: null,
          detail: null
        }
      }
    }
  },
  mounted () {
    this.initForm()
  },
  methods: {
    initForm () {
      this.clearArea()
      this.addressForm = {
        name: '',
        phone: '',
        province: null,
        city: null,
        area: null,
        detail: '',
        is_default: false
      }
      this.errMsgs = {}
      this.provinces = areaDict.province
      this.pNames = areaDict.province.map(p => p.name)
    },
    changeAddressFrom (e) {
      let form = {}
      form[e.currentTarget.dataset.name] = e.detail.value
      this.addressForm = Object.assign(this.addressForm, form)
    },
    inputAddressFrom (e) {
      let msg = {}
      msg[e.currentTarget.dataset.name] = null
      this.errMsgs = Object.assign(this.errMsgs, msg)
    },
    pickArea (e) {
      let level = e.currentTarget.dataset['level']
      let idx = e.detail.value
      let selectedItem
      if (level === '0') {
        // 省级
        selectedItem = areaDict.province[idx]
        let cities = areaDict.city.filter(n => n.parentId === selectedItem.code)
        this.cities = cities
        this.cNames = cities.map(n => n.name)
        this.areas = []
        this.aNames = []
        this.addressForm.province = selectedItem.name
        this.addressForm.city = null
        this.addressForm.area = null
        this.errMsgs = Object.assign(this.errMsgs, {
          province: null,
          city: null,
          area: null
        })
      } else if (level === '1') {
        // 州市级
        selectedItem = this.cities[idx]
        let areas = areaDict.area.filter((n) => n.parentId === selectedItem.code)
        this.areas = areas
        this.aNames = areas.map(n => n.name)
        this.addressForm.city = selectedItem.name
        this.addressForm.area = null
        this.errMsgs = Object.assign(this.errMsgs, {
          city: null,
          area: null
        })
      } else if (level === '2') {
        // 县市级
        this.addressForm.area = this.areas[idx].name
        this.errMsgs = Object.assign(this.errMsgs, {
          area: null
        })
      }
    },
    initFormWithValue (form) {
      this.addressForm = form
      let p = form.province
      let c = form.city
      let a = form.area
      let cp = areaDict.province.filter(n => n.name === p)
      if (cp.length !== 1) return
      cp = cp[0]
      let cities = areaDict.city.filter(n => n.parentId === cp.code)
      let cc = cities.filter(n => n.name === c)
      if (cc.length !== 1) return
      cc = cc[0]

      let areas = areaDict.area.filter(n => n.parentId === cc.code)
      let ca = areas.filter(n => n.name === a)
      if (ca.length !== 1) return
      ca = ca[0]

      this.cities = cities
      this.cNames = cities.map(n => n.name)
      this.areas = areas
      this.aNames = areas.map(n => n.name)
      this.addressForm.province = cp.name
      this.addressForm.city = cc.name
      this.addressForm.area = ca.name
      this.errMsgs = {}
    },
    clearArea () {
      this.cities = []
      this.cNames = []
      this.areas = []
      this.aNames = []
      this.addressForm.province = null
      this.addressForm.city = null
      this.addressForm.area = null
    },
    vaildAddressForm (form) {
      let msg = {}
      if (!form.name) {
        msg['name'] = '不能为空'
      }
      if (!form.phone) {
        msg['phone'] = '不能为空'
      }
      if (!form.province) {
        msg['province'] = '不能为空'
      }
      if (!form.city) {
        msg['city'] = '不能为空'
      }
      if (!form.area) {
        msg['area'] = '不能为空'
      }
      if (!form.detail) {
        msg['detail'] = '不能为空'
      }
      if (!(/^1[34578]\d{9}$/.test(form.phone))) {
        msg['phone'] = '格式有误'
      }
      this.errMsgs = msg
      return Object.keys(msg).length === 0 ? form : null
    }
  }
}
</script>

<style lang="less">
  .address-section-form,.address-section-default{
    font-size: 14px;
  }
  .address-section-form{
    background: #EDEDED;
  }
  .address-section-form-item,.address-section-default{
    display: flex;
    padding: 15px 10px;
    background: #FFF;
  }
  .address-section-form-item{
    margin: 1px 0;
    div:nth-of-type(1){
      width: 80px;
      text-align: center;
    }
    div {
      line-height: 36px;
    }
  }
  .address-section-form-area-picker,.address-section-form-item input{
    margin-left: 25px;
    min-width: 50%;
    padding: 0 8px;
    border: 1px solid #FFF;
  }
  .address-section-form:nth-of-type(2){
    padding: 4px 0 1.5px 0;
  }
  .address-section-default{
    justify-content: space-between;
  }
  @keyframes myfirst
  {
    0%   {border: 1px solid #D0021B;}
    25%  {border: 1px solid #FFF;}
    50%  {border: 1px solid #D0021B;}
    75%  {border: 1px solid #FFF;}
    100% {border: 1px solid #D0021B;}
  }

  @-moz-keyframes myfirst /* Firefox */
  {
    0%   {border: 1px solid #D0021B;}
    25%  {border: 1px solid #FFF;}
    50%  {border: 1px solid #D0021B;}
    75%  {border: 1px solid #FFF;}
    100% {border: 1px solid #D0021B;}
  }

  @-webkit-keyframes myfirst /* Safari 和 Chrome */
  {
    0%   {border: 1px solid #D0021B;}
    25%  {border: 1px solid #FFF;}
    50%  {border: 1px solid #D0021B;}
    75%  {border: 1px solid #FFF;}
    100% {border: 1px solid #D0021B;}
  }

  @-o-keyframes myfirst /* Opera */
  {
    0%   {border: 1px solid #D0021B;}
    25%  {border: 1px solid #FFF;}
    50%  {border: 1px solid #D0021B;}
    75%  {border: 1px solid #FFF;}
    100% {border: 1px solid #D0021B;}
  }
  .err-input{
    border: 1px solid #D0021B!important;
  }
  .d-err-input-animate {
    animation:myfirst .5s;
    -moz-animation:myfirst .5s; /* Firefox */
    -webkit-animation:myfirst .5s; /* Safari and Chrome */
    -o-animation:myfirst .5s; /* Opera */
  }
  .err-text {
    color: #D0021B;
    font-size: 14px;
    padding-left: 12px;
  }
</style>
