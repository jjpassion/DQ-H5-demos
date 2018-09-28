<template>
  <div class="option">
    <ul>
      <li v-for="(item, index) in options" @click.stop='change(index)'>{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  created () {
  },
  methods: {
    change (index) {
      this.$emit('changeType', index)
    }
  }
}
</script>

<style scoped lang="less">
.option {
  padding: 20px 36px;
  border: 1px solid #F4F5F7; /*no*/
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0 4px 4px #cccccc;
  ul {
    li {
      line-height: 80px;
      border-bottom: 1px solid #F4F5F7; /*no*/
      font-size: 28px; /*px*/

      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
