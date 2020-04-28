<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import resizeMixin from '@/mixins/resize'
export default {
  name: 'App',
  mixins: [resizeMixin]
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 14px;
  background-color: #14236A;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
