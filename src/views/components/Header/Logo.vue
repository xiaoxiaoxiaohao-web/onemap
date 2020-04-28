<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-07 14:28:42
 -->
<template>
  <span class="logo-box">
    <img src="./images/logo.png" class="logo" /> 新城区国土空间规划资源一张图管理平台
  </span>
</template>
<script>
export default {
  name: 'Logo'
}
</script>
<style lang="scss" scoped>
.logo-box {
  font-size: 22px;
  padding: 0 33px;
  border-right: 1px solid #4458b9;
  .logo {
    vertical-align: middle;
    // animation: trans 2s linear infinite;
  }
}
@keyframes trans {
  0%{
    -webkit-transform: rotate(0deg)
  }
  25%{
    -webkit-transform: rotate(20deg)
  }
  75%{
    -webkit-transform: rotate(340deg)
  }
  100%{
    -webkit-transform: rotate(360deg)
  }
}
</style>
