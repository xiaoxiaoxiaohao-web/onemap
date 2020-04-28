<!--
 * @Description: 菜单列表
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 -->
<template>
  <div>
    <div :class="['menu-item', {actived: currentMenuIndex === 1}]" @click="onMenuCdivck(1)">
      <div :class="['data-div', {'actived-data': currentMenuIndex === 1}]"></div>
      <span>数据</span>
    </div>
    <!-- <div :class="['menu-item', {actived: currentMenuIndex === 2}]" @click="onMenuCdivck(2)">
      <div :class="['special-div', {'actived-special': currentMenuIndex === 2}]"></div>
      <span>专题</span>
    </div> -->
    <div :class="['menu-item', {actived: currentMenuIndex === 3}]" @click="onMenuCdivck(3)">
      <div :class="['query-div', {'actived-query': currentMenuIndex === 3}]"></div>
      <span>查询</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Menudivst',
  components: {},
  props: {
    currentMenuIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  created() { },
  mounted() { },
  methods: {
    onMenuCdivck(sindex) {
      this.$emit('menuchange', sindex === this.currentMenuIndex ? 0 : sindex)
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.menu-item {
  width: 38px;
  height: 42px;
  padding: 5px 10px 15px 15px;
  border-radius: 0px 8px 8px 0px;
  margin: 20px 0px;
  cursor: pointer;
  position: relative;
  z-index: 30;
  &.actived {
    background-color: #21BDCA;
    color: white;
  }
  & div {
    width: 32px;
    height: 32px;
    background-size: cover;
  }
  .data-div {
    background-image: url('./images/SJ-1.png')
  }
  .actived-data {
    background-image: url('./images/SJ-2.png')
  }
  .special-div {
    background-image: url('./images/ZT-1.png')
  }
  .actived-special {
    background-image: url('./images/ZT-2.png')
  }
  .query-div {
    background-image: url('./images/CX-1.png')
  }
  .actived-query {
    background-image: url('./images/CX-2.png')
  }
}
</style>
