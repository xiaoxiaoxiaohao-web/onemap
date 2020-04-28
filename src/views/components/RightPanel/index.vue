<template>
  <div :class="['right-Panel',{show:show}]">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'RightPanel',
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
.right-Panel {
  position: absolute;
  right: 0;
  height: 100%;
  transition: all 0.3s;
  transform: translateX(100%);
  z-index: 11;
  &.show {
    transform: translateX(0);
  }
}
</style>
