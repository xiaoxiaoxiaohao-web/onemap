<template>
  <div class="loading-box" v-if="isLoading">
    <i class="el-icon-loading"></i>
  </div>
</template>
<script>
export default {
  name: '',
  components: {},
  props: ['isLoading'],
  data() {
    return {
    }
  },
  created() { },
  mounted() { },
  methods: {},
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.loading-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5000;
  color: white;
  position: absolute;
  top: 0;
  right: 0;
  i {
    font-size: 50px;
  }
}
</style>
