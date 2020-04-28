<template>
  <el-scrollbar :native="false" :class="['scroll-box',{'scroll-box-horizontal':isHorizontal}]" :tag="tag">
    <slot/>
  </el-scrollbar>
</template>
<script>
// https://github.com/ElemeFE/element/blob/dev/packages/scrollbar/src/main.js
export default {
  name: 'ScrollDiv',
  components: {},
  props: {
    // 渲染后的标签
    tag: {
      type: String,
      default: 'div'
    },
    // 是否是纵向滚动
    isVertical: {
      type: Boolean,
      default: true
    },
    // 是否是横向滚动
    isHorizontal: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-box {
  height: 100%;
}
.scroll-box-horizontal {
  width: 100%;
  white-space: nowrap;
}
</style>
