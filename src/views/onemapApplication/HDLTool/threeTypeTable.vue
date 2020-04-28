<!--
 * @Description: 三类表格展示部分
 * @Author: your name
 * @Date: 2019-08-22 10:30:18
 -->
<template>
  <div class="table-body">
    <!-- 年份选择 -->
    <blocks-year-select v-show="canSelect"></blocks-year-select>
    <!-- 建设用地 -->
    <div class="building">
      <div class="title-class">建设用地面积：{{buildingArea}}{{(aeraUnit==='meter')?'(㎡)':'公顷'}}</div>
      <scroll-div>
        <div class="building-body">
          <three-type-content :getList="showDataObj['建设用地']"></three-type-content>
        </div>
      </scroll-div>
    </div>
    <!-- 农用地 -->
    <div class="agriculture">
      <div class="title-class">农用地面积：{{agricultureArea}}{{(aeraUnit==='meter')?'(㎡)':'公顷'}}</div>
      <scroll-div>
        <div class="agriculture-body">
          <!-- 一般农用地 -->
          <div class="title-class agriculture-title">一般农用地</div>
          <three-type-content :getList="showDataObj['一般农用地']"></three-type-content>
          <!-- 带K可调整农用地 -->
          <div class="title-class agriculture-title">带K可调整农用地</div>
          <three-type-content :getList="showDataObj['带K可调整农用地']"></three-type-content>
          <!-- 耕地 -->
          <div class="title-class agriculture-title">耕地</div>
          <three-type-content :getList="showDataObj['耕地']"></three-type-content>
        </div>
      </scroll-div>
    </div>
    <!-- 未利用地 -->
    <div class="unUse">
      <div class="title-class unUse-title">未利用土地面积：{{unUseArea}}{{(aeraUnit==='meter')?'(㎡)':'公顷'}}</div>
      <scroll-div>
        <div class="unUse-body">
          <three-type-content :getList="showDataObj['未利用土地']"></three-type-content>
        </div>
      </scroll-div>
    </div>
    <!-- 返回按钮 -->
    <div class="botoom-text">
      <div class="left-text">
        <!-- 单位换算 -->
        <div class="top-unit-div">
          <span class="unit-span">面积单位</span>
          <el-radio-group v-model="aeraUnit">
            <el-radio label="meter" @change="meterSelect">平方米</el-radio>
            <el-radio label="hectare" @change="hectareSelect">公顷</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="right-text">
        <div class="return-button" @click="returnAll">返回</div>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import threeTypeContent from './threeTypeContent'
import blocksYearSelect from './blocksYearSelect'
export default {
  name: 'threeTypeTable',
  components: { ScrollDiv, threeTypeContent, blocksYearSelect },
  props: {
    pagingObj: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    canSelect: {
      type: Boolean
    }
  },
  data() {
    return {
      buildingArea: 0, // 建设用地面积
      agricultureArea: 0, // 农用地面积
      unUseArea: 0, // 未利用地面积
      aeraUnit: 'meter',
      showDataObj: {
        // 建设用地内容 buildingList
        '建设用地': [
          {
            typeCode: '',
            typeName: '',
            area: ''
          }
        ],
        // 1. 农用地--一般农用地 agricultureList1
        '一般农用地': [
          {
            typeCode: '',
            typeName: '',
            area: ''
          }
        ],
        // 1. 农用地--带K可调整农用地 agricultureList2
        '带K可调整农用地': [
          {
            typeCode: '',
            typeName: '',
            area: ''
          }
        ],
        // 1. 农用地--耕地 agricultureList3
        '耕地': [
          {
            typeCode: '',
            typeName: '',
            area: ''
          }
        ],
        // 未用地内容 unUseList
        '未利用土地': [
          {
            typeCode: '',
            typeName: '',
            area: ''
          }
        ]
      }
    }
  },
  created() { },
  mounted() {
    this.createData()
  },
  methods: {
    // 数据整理
    createData() {
      console.log('OK')
      for (let i = 0; i < this.pagingObj.length; i++) {
        // 如果内容不为空, 赋值给对应的内容
        if (this.pagingObj[i].lands.length) {
          this.showDataObj[this.pagingObj[i].type] = this.pagingObj[i].lands
        }
      }
      // 计算总面积
      // 建设用地面积
      for (let BUIndex in this.showDataObj['建设用地']) {
        let area = this.showDataObj['建设用地'][BUIndex].area
        this.buildingArea += (area !== '') ? parseFloat(this.showDataObj['建设用地'][BUIndex].area) : 0
      }
      // 农用地面积
      // 一般农用地
      for (let AGIndex1 in this.showDataObj['一般农用地']) {
        let area = this.showDataObj['一般农用地'][AGIndex1].area
        this.agricultureArea += (area !== '') ? parseFloat(this.showDataObj['一般农用地'][AGIndex1].area) : 0
      }
      // 带K可调整农用地
      for (let AGIndex2 in this.showDataObj['带K可调整农用地']) {
        let area = this.showDataObj['带K可调整农用地'][AGIndex2].area
        this.agricultureArea += (area !== '') ? parseFloat(this.showDataObj['带K可调整农用地'][AGIndex2].area) : 0
      }
      // 耕地
      for (let AGIndex3 in this.showDataObj['耕地']) {
        let area = this.showDataObj['耕地'][AGIndex3].area
        this.agricultureArea += (area !== '') ? parseFloat(this.showDataObj['耕地'][AGIndex3].area) : 0
      }
      // 未利用土地面积
      for (let NUIndex in this.showDataObj['未利用土地']) {
        let area = this.showDataObj['未利用土地'][NUIndex].area
        this.unUseArea += (area !== '') ? parseFloat(this.showDataObj['未利用土地'][NUIndex].area) : 0
      }
    },
    // 点击单位为平方米
    meterSelect() {
      this.buildingArea = this.buildingArea * 10000.0
      this.agricultureArea = this.agricultureArea * 10000.0
      this.unUseArea = this.unUseArea * 10000.0
      this.changeTableUnit(10000.0)
    },
    // 点击单位为平方米
    hectareSelect() {
      this.buildingArea = this.buildingArea / 10000.0
      this.agricultureArea = this.agricultureArea / 10000.0
      this.unUseArea = this.unUseArea / 10000.0
      this.changeTableUnit(0.0001)
    },
    // 改变单位调用方法
    changeTableUnit(number) {
      // 建设用地面积
      for (let BUIndex in this.showDataObj['建设用地']) {
        let area = this.showDataObj['建设用地'][BUIndex].area
        this.showDataObj['建设用地'][BUIndex].area = (area !== '') ? parseFloat(area) * number : ''
      }
      // 农用地面积
      // 一般农用地
      for (let AGIndex1 in this.showDataObj['一般农用地']) {
        let area = this.showDataObj['一般农用地'][AGIndex1].area
        this.showDataObj['一般农用地'][AGIndex1].area = (area !== '') ? parseFloat(area) * number : ''
      }
      // 带K可调整农用地
      for (let AGIndex2 in this.showDataObj['带K可调整农用地']) {
        let area = this.showDataObj['带K可调整农用地'][AGIndex2].area
        this.showDataObj['带K可调整农用地'][AGIndex2].area = (area !== '') ? parseFloat(area) * number : ''
      }
      // 耕地
      for (let AGIndex3 in this.showDataObj['耕地']) {
        let area = this.showDataObj['耕地'][AGIndex3].area
        this.showDataObj['耕地'][AGIndex3].area = (area !== '') ? parseFloat(area) * number : ''
      }
      // 未利用土地面积
      for (let NUIndex in this.showDataObj['未利用土地']) {
        let area = this.showDataObj['未利用土地'][NUIndex].area
        this.showDataObj['未利用土地'][NUIndex].area = (area !== '') ? parseFloat(area) * number : ''
      }
    },
    // 返回到开始表格内容
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
    getNowYear() {
      this.createData()
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
.top-unit-div {
  text-align: left;
  padding: 0px 5px;
  font-size: 16px;
}
.unit-span {
  padding-right: 20px;
}
/* 标题样式 */
.title-class {
  height: 38px;
  line-height: 38px;
  border: 1px solid gray;
  text-align: left;
  font-weight: 500;
  padding-left: 10px;
}
/* 建设用地 */
.building {
  margin-bottom: 10px;
  background-color: #fff3f5;
}
.building-body {
  height: 81px;
}
/* 农用地 */
.agriculture-body {
  height: 121px;
}
.agriculture {
  margin-bottom: 10px;
  background-color: #f0fbff;
}
.agriculture-title {
  padding-left: 20px;
}
/* 为用地 */
.unUse-body {
  height: 41px;
}
/* 数据展示内容 */
.data-body {
  width: 567px;
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
  justify-content: space-between;
  padding: 10px 10px 0px 0px;
}
.right-text {
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
.return-button:hover {
  border: 1px solid #27c5f4;
  color: #27c5f4;
}
.clickClass {
  background-color: yellow;
}
</style>
