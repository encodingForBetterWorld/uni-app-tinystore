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
        data-name='name')
    .address-section-form-item
      div 手机号码
      div
        input(type='text'
        placeholder='请输入收货人手机号码'
        placeholder-class='placeholder-text'
        v-model="addressForm.phone"
        data-name='phone')
    .address-section-form-item(v-if="pNames && pNames.length > 0")
      div 所在地区
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="pNames" data-level="0")
          .picker(:class="addressForm.province?'':'placeholder-text'") {{ addressForm.province || '请选择'}}
    .address-section-form-item(v-if="cNames && cNames.length > 0")
      div
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="cNames" data-level="1")
          .picker(class="addressForm.city?'':'placeholder-text'") {{ addressForm.city || '请选择'}}
    .address-section-form-item(v-if="aNames && aNames.length > 0")
      div
      .address-section-form-area-picker
        picker(@change="pickArea" :value="index" :range="aNames" data-level="2")
          .picker(class="addressForm.area?'':'placeholder-text'") {{ addressForm.area || '请选择'}}
    .address-section-form-item
      div 详细地址
      div
        input(type='text'
        placeholder='请输入街道地址'
        placeholder-class='placeholder-text'
        v-model="addressForm.detail"
        data-name='detail')
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
      this.provinces = areaDict.province
      this.pNames = areaDict.province.map(p => p.name)
    },
    changeAddressFrom (e) {
      this.addressForm[e.currentTarget.dataset.name] = e.detail.value
    },
    pickArea: function (e) {
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
      } else if (level === '1') {
        // 州市级
        selectedItem = this.cities[idx]
        let areas = areaDict.area.filter((n) => n.parentId === selectedItem.code)
        this.areas = areas
        this.aNames = areas.map(n => n.name)
        this.addressForm.city = selectedItem.name
        this.addressForm.area = null
      } else if (level === '2') {
        // 县市级
        this.addressForm.area = this.areas[idx].name
      }
    },
    initFormWithValue: function (form) {
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
    },
    clearArea: function () {
      this.cities = []
      this.cNames = []
      this.areas = []
      this.aNames = []
      this.addressForm.province = null
      this.addressForm.city = null
      this.addressForm.area = null
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
    padding: 18px 10px;
    background: #FFF;
  }
  .address-section-form-item{
    margin: 1px 0;
  }
  .address-section-form-item > div:nth-of-type(1){
    width: 80px;
    text-align: center;
  }
  .address-section-form-area-picker,.address-section-form-item input{
    margin-left: 25px;
    min-width: 50%;
  }
  .address-section-form:nth-of-type(2){
    padding: 4px 0 1.5px 0;
  }
  .address-section-default{
    justify-content: space-between;
  }
</style>
