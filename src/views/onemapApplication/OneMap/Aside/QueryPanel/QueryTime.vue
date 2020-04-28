<template>
  <div class="QueryTime">
    <!-- <ul class="QueryTime-cont">
      <li>
        <el-checkbox-group v-model="checkedTimeVal">
          <el-checkbox v-for="(item,index) in getQueryYear" :label="item" :key="index" @change="onChangeTime">{{item}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul> -->
  </div>
</template>

<script>
export default {
  name: 'QueryTime',
  data() {
    return {
      checkedTimeVal: [], //选中的时间
      starttime: '',
      endtime: '',
      checked: false
    }
  },
  computed: {
    // getQueryYear() {
    //   //获取当前年份的数据
    //   return this.$store.state.onemapApplication.getAllYearData
    // },
    // getQueryListChangeVal() {
    //   //获取QueryList切换的不同的index
    //   return this.$store.state.onemapApplication.getQueryListChangeVal
    // }
  },
  watch: {
    // getQueryListChangeVal(newVal, oldVal) {
    //   //获取QueryList切换清空传到查询部分条件的数据(避免携带上一部分的条件)
    //   if (newVal !== oldVal) {
    //     this.checkedTimeVal = []
    //     this.$emit('funcTime', this.checkedTimeVal.join(' '))
    //   }
    // }
  },
  methods: {
    //选择时间
    // onChangeTime() {
    //   this.$emit('funcTime', this.checkedTimeVal.join(' '))
    // }


  }
}
</script>

<style scoped lang="scss">
.QueryTime-cont {
  padding-right: 10px;
  padding-left: 10px;
  li {
    width: 100%;
    margin-top: 5px;
    font-size: 14px;
    font-family: 'Microsoft YaHei';
  }
}
.Query-data {
  margin-top: 15px;
}
.Query-data-title {
  padding-left: 10px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: #a1aee4;
}
.Query-data .Query-start,
.Query-data .Query-end {
  float: left;
  margin-top: 10px;
  cursor: pointer;
}
.Query-dataDiog {
  margin-top: 3.5px;
  float: left;
  width: 20px;
  height: 32px;
  margin-right: 8px;
  margin-left: 8px;
  line-height: 32px;
  text-align: center;
}
</style>
