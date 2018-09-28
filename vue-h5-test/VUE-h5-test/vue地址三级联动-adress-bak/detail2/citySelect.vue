<template>
  <div class="city-select">
    <select v-model="selectedProvince" name="province">
      <option v-for="(item, index) in provinces"
        v-if="item.level === 1"
        :value="item">
        {{ item.name }}
      </option>
    </select>
    <select v-model="selectedCity" name="city">
      <option
        v-for="(item, index) in cities"
        :value="item">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>
<script>
/**
 *  省 市  二级联动
*/
import provinces from './provinces.js'
import Vue from 'vue'

export default {
  name: 'citySelect',
  data () {
    return {
      selectedProvince: provinces[0],
      selectedCity: 0,
      cities: 0,
      provinces
    }
  },
  created () {
    // 数据初始化,默认选中北京市,默认选中第一个;
    // 由于产品需求---直辖市不区分市辖区/县---统一与一级一致，所以特殊处理直辖市
    // 北京、天津、上海、重庆
    let beijing = this.provinces.slice(0, 1)
    this.cities = beijing
    this.selectedCity = this.cities[0]
  },
  watch: {
    selectedProvince (newVal, oldVal) {
      // 港澳台数据只有一级,特殊处理 加入 北京11、天津12、上海31、重庆50 产品特殊需求
      if (newVal.sheng === '71' || newVal.sheng === '81' || newVal.sheng === '82' || newVal.sheng === '11' || newVal.sheng === '12' || newVal.sheng === '31' || newVal.sheng === '50') {
        this.cities = [newVal]
        // this.blocks = [newVal]
      } else {
        this.cities = this.provinces.filter(item => {
          if (item.level === 2 && item.sheng && newVal.sheng === item.sheng) {
            return true
          }
        })
      }
      // 此时在渲染DOM,渲染结束之后再选中第一个
      Vue.nextTick(() => {
        this.selectedCity = this.cities[0]
        this.$emit('input', this.info)
      })
    },
    selectedCity (newVal) {
      // 选择了一个市,要选择区了 di是城市的代表,sheng
      if (newVal.sheng === '71' || newVal.sheng === '81' || newVal.sheng === '82') {
        // this.blocks = [newVal]
        this.cities = [newVal]
      } else {
        // this.blocks = this.provinces.filter(item => {
        //   if (item.level === 3 && item.sheng && item.sheng === newVal.sheng && item.di === newVal.di && item.name !== '市辖区') {
        //     return true
        //   }
        // })
      }
      Vue.nextTick(() => {
        // 触发与 v-model相关的 input事件
        this.$emit('input', this.info)
      })
    }
  },
  computed: {
    info () {
      return {
        province: this.selectedProvince,
        city: this.selectedCity
      }
    }
  }
}
</script>
<style lang="less" scoped>
.city-select {
  select {
    outline: 0;
  }
}
</style>
