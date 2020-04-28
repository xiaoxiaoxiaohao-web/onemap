<!--
 * @Description: 平差表格展示部分
 * @Author: your name
 * @Date: 2019-08-22 10:30:18
 -->
<template>
  <div class="table-body hide-table-header">
    <!-- 年份选择 -->
    <blocks-year-select v-show="pagingObj.canSelect"></blocks-year-select>
    <div class="top-text">
      <div>红线面积：
        <span>{{redLineArea}}(㎡)</span>
      </div>
      <div>计算面积：
        <span>{{sumArea}}(㎡)</span>
      </div>
      <div>相差：
        <span>{{DValue}}(㎡)</span>
      </div>
    </div>
    <!-- 表头展示 -->
    <div class="fixed-table-header">
      <div v-for="(item,index) in pageShowNameList" :key="index" :style="{width:item.minWidth}">
        {{item.name}}
      </div>
      <div style="width:150px">
        计算面积(㎡)
      </div>
    </div>
    <!-- 表格展示内容 -->
    <div class="data-body">
      <ScrollDiv>
        <!-- 表头隐藏，满足滚动需求 -->
        <el-table ref="singleTable" v-loading="loading" :data="pageShowDataList" border :row-class-name="tableRowClassName">
          <el-table-column :prop="item.value" :label="item.name" :width="item.minWidth" v-for="(item,index) in pageShowNameList" :key="index">
          </el-table-column>
          <el-table-column :prop="calculatedArea.value" :label="calculatedArea.name" width="150px">
            <template slot-scope="scope">
              <span v-show="!showInput">{{scope.row.calculatedArea}}</span>
              <el-input class="input-class" v-show="showInput" v-model="scope.row.calculatedArea" />
            </template>
          </el-table-column>
        </el-table>
      </ScrollDiv>
    </div>
    <div class="botoom-text">
      <div class="left-text">
      </div>
      <div class="right-text">
        <div class="return-button" @click="edit">编辑</div>
        <div class="return-button" @click="colseEdit">确认编辑</div>
        <div class="return-button" @click="returnAll">返回</div>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import blocksYearSelect from './blocksYearSelect'
export default {
  name: 'adjustmentTable',
  components: { ScrollDiv, blocksYearSelect },
  props: {
    pagingObj: {
      type: Object
    },
    loading: {
      type: Boolean
    },
    toExportCheckOpinion: {
      type: Boolean
    }
  },
  data() {
    return {
      pageShowDataList: [], // 展示的数据
      pageShowNameList: [], // 展示的表头
      redLineArea: 0, // 红线面积
      sumArea: 0, // 计算面积
      DValue: 0, // 差值
      calculatedArea: {
        name: '计算面积(㎡)',
        value: 'area'
      },
      // 控制能否编辑计算面积
      showInput: false
    }
  },
  created() { },
  mounted() {
    this.pageShowDataList = this.pagingObj.tableDataList
    this.pageShowNameList = this.pagingObj.tableNameList
    this.redLineArea = this.pagingObj.sumArea
    this.sumArea = this.pagingObj.sumArea
    this.changeDataList()
  },
  methods: {
    // 给内容加ID，确定是哪行
    changeDataList() {
      for (let i = 0; i < this.pageShowDataList.length; i++) {
        this.$set(this.pageShowDataList[i], 'tableCellId', i)
        this.$set(this.pageShowDataList[i], 'calculatedArea', this.pageShowDataList[i].area)
      }
    },
    edit() {
      this.showInput = true
    },
    colseEdit() {
      this.showInput = false
      // 重新计算计算面积
      let sum = 0
      let returnList = [] // 返回的数据
      for (let i in this.pageShowDataList) {
        // 如果为空或者输入了字母非数字
        if (this.pageShowDataList[i].calculatedArea === '' || isNaN(this.pageShowDataList[i].calculatedArea)) {
          continue
        } else {
          sum += parseFloat(this.pageShowDataList[i].calculatedArea)
        }
        returnList.push(this.pageShowDataList[i].calculatedArea)
      }
      this.sumArea = sum
      // 计算相差
      this.DValue = this.redLineArea - this.sumArea
      //判断是否需要保留位数
      this.sumArea = this.shouldFixed(this.sumArea, 8)
      this.DValue = this.shouldFixed(this.DValue, 8)
      // 新需求--平差后需要修改核查结果表格的数据
      this.$emit('changeOptionTableData', returnList, this.sumArea)
    },
    //判断是否需要保留位数
    shouldFixed(number, length) {
      let returnNumber = 0
      // 如果是整数
      if (number === parseInt(number, 10)) {
        return number
      }
      // 如果是小数
      let numberLength = number.toString().split('.')[1].length
      if (numberLength > length) {
        // 大于length则截取
        returnNumber = number.toFixed(length)
      } else {
        returnNumber = number
      }
      return returnNumber
    },
    // 表格背景颜色控制
    tableRowClassName({ row }) {
      if (row.type === '农用地') {
        // 农用地
        return 'agricultural-row'
      } else if (row.type === '建设用地') {
        // 建设用地
        return 'building-row'
      }
      // 一般农用地
      return ''
    },
    // 返回按钮
    returnAll() {
      this.$emit('returnAll', 'all')
    }
  },
  computed: {
    getNowYear() {
      return this.$store.state.onemapApplication.nowYear
    }
  },
  watch: {
    toExportCheckOpinion(value) {
      if (value) {
        this.$emit('changeCheckOpinionList', this.pageShowDataList, this.sumArea)
      }
    },
    // 修改年份后，同时修改表格数据
    getNowYear() {
      this.pageShowDataList = this.pagingObj.tableDataList
      this.pageShowNameList = this.pagingObj.tableNameList
      this.redLineArea = this.pagingObj.sumArea
      this.sumArea = this.pagingObj.sumArea
      this.changeDataList()
    }
  }
}
</script>
<style scoped>
.table-body {
  width: 100%;
  height: 100%;
  position: relative;
}
/* 顶部内容 */
.top-text {
  /* height: 40px; */
  min-height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: flex-start;
  font-size: 15px;
}
.top-text span {
  color: red;
}
.top-text div:not(:first-child) {
  padding-left: 20px;
}
/* 表头内容 */
.fixed-table-header {
  background-color: #121C4F;
  display: flex;
  color: white;
}
.fixed-table-header div{
  padding: 10px 1px;
  /* border-right: 1px solid white; */
}
/* 数据展示内容 */
.data-body {
  width: 100%;
  height: 320px;
  position: relative;
}
.bottom-button {
  width: calc(100% - 600px);
  height: 30px;
  padding-top: 10px;
  padding: 10px 300px 0px 300px;
  display: flex;
  justify-content: space-between;
  line-height: 30px;
  color: #0098ae;
}
.input-class {
  width: 100%;
  height: 100%;
}
/* 底部文字 */
.botoom-text {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 0px 0px;
}
.right-text {
  display: flex;
  color: gray;
}
.return-button {
  width: 85px;
  height: 28px;
  line-height: 28px;
  border: 1px solid gray;
  border-radius: 3px;
  cursor: pointer;
}
.return-button:not(:first-child) {
  margin-left: 10px;
}
.return-button:hover {
  border: 1px solid #27c5f4;
  color: #27c5f4;
}
.clickClass {
  background-color: yellow;
}
</style>
