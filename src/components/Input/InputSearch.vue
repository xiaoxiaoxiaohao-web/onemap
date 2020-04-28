<template>
  <span class="input-search">
    <input type="text" v-model="searchKey" placeholder="请输入搜索内容" />
    <i v-show="searchKey" class="el-icon-close cursor-pointer clear" @click="onCleanClick" title="清除"></i>
    <i class="el-icon-search search" />
  </span>
</template>
<script>
export default {
  name: 'InputSearch',
  components: {},
  data() {
    return {
      searchKey: ''
    }
  },
  created() { },
  mounted() { },
  methods: {
    onCleanClick() {
      this.searchKey = ''
    }
  },
  computed: {},
  watch: {
    searchKey() {
      this.$emit('input', this.searchKey)
    }
  }
}
</script>
<style lang="scss" scoped>

.input-search {
  position: relative;
  display: inline-block;
  height: 34px;
  line-height: 34px;
  vertical-align: middle;
  color: $placeholder-color;
  input {
    width: calc(100% - 70px);
    margin-left: 20px;
    background: transparent;
    border: none;
    outline: none;
    color: #fff;
    @include placeholder;
  }
  .search {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  .clear {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    &:hover {
      color: #fff;
    }
  }
}
</style>
