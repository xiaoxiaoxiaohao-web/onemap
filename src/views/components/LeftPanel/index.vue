<template>
  <div :class="['left-Panel',{show:show}]">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'LeftPanel',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang='scss' scoped>
.left-Panel {
  background-color: #fff;
  position: absolute;
  left: 0;
  height: 100%;
  transition: all 0.3s;
  transform: translateX(-100%);
  z-index: 11;
  &.show {
    transform: translateX(0);
  }
}
</style>
