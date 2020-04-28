<!--
 * @Description: 核查结果表格展示部分
 * @Author: your name
 * @Date: 2019-08-22 10:30:18
 -->
<template>
  <div class="table-body hide-table-header">
    <!-- 年份选择 -->
    <blocks-year-select v-show="pagingObj.canSelect"></blocks-year-select>
    <!-- 表头展示 -->
    <div class="fixed-table-header">
      <div v-for="(item,index) in pageShowNameList" :key="index" :style="{width:item.minWidth}">
        {{item.name}}
      </div>
    </div>
    <!-- 表格展示内容 -->
    <div class="data-body" :class="{'is-decoration':isDecoration}">
      <ScrollDiv :isHorizontal="false">
        <!-- 表头隐藏，满足滚动需求 -->
        <el-table ref="singleTable" v-loading="loading" :data="pageShowDataList" border :row-class-name="tableRowClassName" highlight-current-row @row-click="handleCurrentChange">
          <el-table-column :prop="item.value" :width="item.minWidth" :label="item.name" v-for="(item,index) in pageShowNameList" :key="index">
          </el-table-column>
        </el-table>
      </ScrollDiv>
    </div>
    <div class="botoom-text">
      <div class="left-text">
        <span>批次编号：{{batchNumber}}</span>
      </div>
      <div class="right-text">
        <span>合计：{{sumArea}}</span>
      </div>
    </div>
    <!-- <el-button @click="colse">取消内容</el-button> -->
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import blocksYearSelect from './blocksYearSelect'
import HDLTool from '@/api/HDLTool'
export default {
  name: 'optionTable',
  components: { ScrollDiv, blocksYearSelect },
  // props: ['tableDataList', 'tableNameList', 'tablePageList', 'isExport'],
  props: {
    pagingObj: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      pageShowDataList: [], // 展示的数据
      pageShowNameList: [], // 展示的表头
      currentRow: null, // 表格选择内容
      // 年份内容
      allLenght: 1, // 控制左右移动长度
      batchNumber: 'D29AAd20178120  2017年10月31日', // 批次编号
      isDecoration: false, // 是否需要加下划线
      sumArea: null, // 合计
      canDrawHighlight: false // 地块追溯是否高亮
    }
  },
  created() { },
  mounted() {
    this.pageShowDataList = this.pagingObj.tableDataList
    this.pageShowNameList = this.pagingObj.tableNameList
    this.sumArea = this.pagingObj.sumArea
  },
  methods: {
    // 表格高亮
    handleCurrentChange(val) {
      if (JSON.stringify(this.currentRow) === JSON.stringify(val)) {
        this.$refs.singleTable.setCurrentRow()
        this.currentRow = null
        console.log('点击相同内容')
        // 点击表格后，如果是地块追溯--进行追溯非建设用地年份
        if (this.pagingObj.canSelect) {
          this.isDecoration = true
          // 2.判断是地类图斑还是线状地物
          if (val.areaType === '地类图斑') {
            // 地类图斑
            this.getLandBeforeYearData(val.geometry)
            // 如果年份不在跳转，则绘制高亮
            if (this.canDrawHighlight) {
              this.$store.commit('onemapApplication/changeGeometry', val.geometry)
            }
          } else {
            // 线状地物
            this.getLineBeforeYearData(val.geometry)
            // 如果年份不在跳转，则绘制高亮
            if (this.canDrawHighlight) {
              this.$store.commit('onemapApplication/changeGeometry', val.geometry)
            }
          }
        } else {
          this.$store.commit('onemapApplication/changeGeometry', val.geometry)
        }
      } else {
        this.currentRow = val
        this.$store.commit('onemapApplication/changeGeometry', val.geometry)
        // 如果是地块追溯，添加下划线class
        if (this.pagingObj.canSelect) {
          this.isDecoration = true
        }
      }
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
    // 地类图斑追溯建设用地年份
    getLandBeforeYearData(regionJson) {
      let params = {
        regionJson: regionJson,
        year: this.$store.state.onemapApplication.nowYear,
        landServer: window.baseMapBaseUrl
      }
      HDLTool.postLandbeforeYearData(params).then(res => {
        console.log('年份', res)
        if (res) {
          this.$store.commit('onemapApplication/changeNowYear', res + '')
          this.canDrawHighlight = false
        } else {
          this.canDrawHighlight = true
        }
      })
    },
    // 线状地物追溯非建设用地年份
    getLineBeforeYearData(regionJson) {
      let params = {
        regionJson: regionJson,
        year: this.$store.state.onemapApplication.nowYear,
        landServer: window.baseMapBaseUrl,
        lineServer: window.baseMapBaseUrl
      }
      HDLTool.postLandbeforeYearData(params).then(res => {
        console.log('年份', res)
        this.$store.commit('onemapApplication/changeNowYear', res + '')
      })
    },
    colse() {
      this.$refs.singleTable.setCurrentRow()
    }
  },
  computed: {
    getNowYear() {
      return this.$store.state.onemapApplication.nowYear
    },
    getSumArea() {
      return this.pagingObj.sumArea
    }
  },
  watch: {
    getNowYear() {
      this.pageShowDataList = this.pagingObj.tableDataList
      this.pageShowNameList = this.pagingObj.tableNameList
      this.sumArea = this.pagingObj.sumArea
    },
    getSumArea() {
      this.sumArea = this.pagingObj.sumArea
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
/* 顶部年份内容 */
.year-select {
  height: 20px;
  padding: 10px;
  line-height: 20px;
  display: flex;
  justify-content: flex-start;
  font-size: 15px;
}
.year-change {
  border: 1px solid gray;
  border-radius: 2px;
  padding: 2px 2px;
  cursor: pointer;
}
.year-change:not(:last-child) {
  margin-left: 5px;
}
.year-div {
  width: 456px;
  margin-left: 5px;
  height: 22px;
  margin-top: -1px;
  overflow: hidden;
  color: gray;
}
.year-div-hide {
  width: 10000px;
  transition: all 1s;
}
.year-button {
  float: left;
  width: 48px;
  margin-right: 7px;
  font-size: 12px;
  border: 1px solid gray;
  border-radius: 3px;
  cursor: pointer;
}
.year-selection {
  background: #409eff;
  color: white;
}
/* 表头内容 */
.fixed-table-header {
  /* width: calc(100% - 2px); */
  background-color: #121c4f;
  display: flex;
  color: white;
  /* margin-left: 1px; */
}
.fixed-table-header div {
  padding: 10px 1px;
  /* border-right: 1px solid white; */
}
/* 数据展示内容 */
.data-body {
  width: 100%;
  height: 350px;
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
.previous-page {
  width: 48px;
  height: 28px;
  border: 1px solid #0098ae;
  border-radius: 3px;
  background-color: rgba(0, 42, 62, 0.9);
}
.next-page {
  width: 48px;
  height: 28px;
  border: 1px solid #0098ae;
  border-radius: 3px;
  background-color: rgba(0, 42, 62, 0.9);
}
.now-page {
  width: 50px;
  height: 30px;
}
/* 底部文字 */
.botoom-text {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: flex-end;
  padding: 0px 10px;
}
.left-text {
  display: none;
}
.right-text {
  color: rgb(231, 73, 53);
}
.clickClass {
  background-color: yellow;
}
</style>
