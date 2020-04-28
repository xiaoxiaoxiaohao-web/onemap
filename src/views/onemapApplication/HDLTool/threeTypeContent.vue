<!--
 * @Description: 三类展示内容一行三列
 * @Author: your name
 * @Date: 2019-08-23 14:13:47
 -->
<template>
  <div class="coentent-body">
    <div class="content-div" v-for="(item,index) in getList" :key="index">
      <div>{{item.typeCode}}</div>
      <div>{{item.typeName}}</div>
      <div>{{item.area}}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'threeTypeContent',
  components: {},
  props: {
    getList: {
      type: Array
    }
  },
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
<style scoped>
.coentent-body {
  width: 100%;
}
.content-div {
  display: flex;
}
.content-div div {
  width: 33%;
  height: 38px;
  border: 1px solid gray;
  line-height: 38px;
}
</style>
