<!--
 * @Description: 头部主体部分
 * @Author: your name
 * @Date: 2019-09-08 16:12:52
 -->
<template>
  <header class="app-header">
    <Logo />
    <!-- <SystemDropdown :currentIndex="currentIndex" /> -->
    <SystemDropdown :routerPath="routerPath" />
    <!-- <InputSearch v-model="serchKey" class="search-box" /> -->
    <UserBox class="user-box" />
  </header>
</template>
<script>
import Logo from './Logo'
import SystemDropdown from './SystemDropdown'
// import InputSearch from '@/components/Input/InputSearch'
import UserBox from '@/views/components/UserBox'
export default {
  name: 'OnemapHeader',
  components: {
    Logo,
    SystemDropdown,
    // InputSearch,
    UserBox
  },
  props: [],
  data() {
    return {
      serchKey: '',
      routerPath: ''
    }
  },
  computed: {
    getRouterPath() {
      return this.$store.state.global.routerPath
    }
  },
  watch: {
    getRouterPath(val) {
      this.routerPath = val
    }
  }
}
</script>
<style lang="scss" scoped>
.app-header {
  position: relative;
  height: 60px;
  line-height: 60px;
  background-color: $header-backgroud-color;
  color: #fff;
  display: flex;
  .search-box {
    position: absolute;
    right: 186px;
    top: 50%;
    width: 240px;
    transform: translateY(-50%);
    border: 1px solid #4d598e;
    border-radius: 17px;
  }
  .user-box {
    position: absolute;
    right: 35px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
