<template>
  <div class="evaluation-results">
    <div class="evaluation-nav clear-fix">
      <div class="evaluation-nav-left">
        <ul class="clear-fix">
          <li class="cursor-pointer" v-for="(item,index) in listCheck" :key="index" @click="onItemClick(item,index)" :class="{'changeStyle':item.id === isChecked}">{{item.name}}</li>
        </ul>
      </div>
      <div class="evaluation-nav-right cursor-pointer" @click="isExportWinShow = !isExportWinShow" >一键导出</div>
    </div>
    <!-- 成果,说明,数据 -->
    <Data v-show="currentTab === 'Data'" ></Data>
    <Explain v-show="currentTab === 'Explain'"></Explain>
    <ResultsShow ref="ResultsShow" v-show="currentTab === 'ResultsShow'"></ResultsShow>
    <!-- 一键导出弹窗 -->
    <div class="export-win" v-show="isExportWinShow">
      <div class="win-top">
        <span>文件选择</span>
        <i class="el-icon-close cursor-pointer" @click="isExportWinShow = false"></i>
      </div>
      <!-- 内容部分 -->
      <div class="win-content">
        <div class="content-div">
          <el-checkbox v-model="exportList[0].isChecked">{{exportList[0].lable}}</el-checkbox>
          <div class="radio-div mag-botm">
            <el-radio-group v-model="exportRadioType" :disabled="!exportList[0].isChecked">
              <el-radio v-for="(item,index) in exportRadioList" :key="index" :label="item">{{item}}</el-radio>
            </el-radio-group>
          </div>
          <el-checkbox class="mag-botm" v-model="exportList[1].isChecked">{{exportList[1].lable}}</el-checkbox>
          <el-checkbox v-model="exportList[2].isChecked">{{exportList[2].lable}}</el-checkbox>
        </div>
        <div class="button-div">
          <el-button class="cancel-btn" @click="isExportWinShow = !isExportWinShow">取消</el-button>
          <el-button class="print-btn" @click="onExportClick">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Data from './ResultsContent/Data'
import Explain from './ResultsContent/Explain'
import ResultsShow from './ResultsContent/ResultsShow'
export default {
  name: 'EvaluationResults',
  components: {
    Data,
    Explain,
    ResultsShow
  },
  props: [],
  data() {
    return {
      listCheck: [
        {
          'name': '成果',
          'id': 0
        },
        {
          'name': '说明',
          'id': 1
        },
        {
          'name': '数据',
          'id': 2
        }

      ],
      isChecked: 0,
      currentTab: 'ResultsShow',
      isExportWinShow: false, // 导出窗口控制
      // 一键导出数据
      exportList: [
        {
          lable: '农业生产土地资源适宜性分级图',
          isChecked: true
        },
        {
          lable: '农业生产土地资源适宜性等级评价成果',
          isChecked: false
        },
        {
          lable: '农业生产土地资源适宜性等级评价往期数据对比',
          isChecked: false
        }
      ],
      exportRadioType: 'A2',
      exportRadioList: ['A1', 'A2', 'A3', 'A4']
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
    //选择
    onItemClick(item, index) {
      this.isChecked = index
      if (item.name === '成果') {
        this.currentTab = 'ResultsShow'
      }
      if (item.name === '说明') {
        this.currentTab = 'Explain'
      }
      if (item.name === '数据') {
        this.currentTab = 'Data'
        //控制点击数据时echart条形图
        this.$store.commit('territorialPlanEvaluate/evaluationDataEchart', 'barShow')
      }
    },
    // 导出确定按钮点击事件
    onExportClick() {
      // 构建数据
      let canExport = false
      console.log('导出点击：' + this.exportRadioType)
      for (let i in this.exportList) {
        if (this.exportList[i].isChecked) {
          console.log('选中内容：' + this.exportList[i].lable)
          canExport = true
        }
      }
      if (!canExport) {
        this.$message({
          type: 'error',
          message: '请至少选择一类文件进行导出'
        })
      }
      this.isExportWinShow = !canExport
      // 导出图表
      let echartsUrl = this.$refs.ResultsShow.exportChart()
      // console.log('echartsUrl' + echartsUrl)
    }
  }
}
</script>
<style lang="scss" scoped>
.evaluation-results {
  width: 718px;
  height: 100%;
  background-color: #f4f4f4;
  z-index: 99;
  position: relative;
  // 一键导出窗口
  .export-win {
    width: 370px;
    height: 260px;
    background: white;
    border-radius: 5px;
    position: fixed;
    z-index: 10;
    top: 300px;
    left: 0;
    right: 0;
    margin: 0 auto;
    box-shadow: 0px 2px 5px 5px rgba(49, 49, 49, 0.2);
    .win-top {
      height: 35px;
      padding: 0px 18px;
      background-color: #21bdca;
      border-radius: 5px 5px 0px 0px;
      color: white;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      align-items: center;
    }
    .win-content {
      width: calc(100% -50px);
      height: calc(100% - 85px);
      padding: 25px;
      // 内容
      .content-div {
        text-align: left;
        .radio-div {
          padding-left: 15px;
          padding-top: 13px;
        }
        .mag-botm {
          margin-bottom: 18px;
        }
      }
      // 按钮
      .button-div {
        padding-top: 20px;
        text-align: center;
        .cancel-btn {
          width: 80px;
          height: 32px;
          background: #e5e5e5;
          color: #666666;
          border-radius: 16px;
        }
        .print-btn {
          width: 80px;
          height: 32px;
          background: #409eff;
          color: white;
          border-radius: 16px;
        }
      }
    }
  }
}

// 成果上部分
.evaluation-nav {
  width: 100%;
  height: 48px;
  border-bottom: 1px solid #dcdcdc;
}
.evaluation-nav-left {
  float: left;
  width: 50%;
}
.evaluation-nav-left ul li {
  float: left;
  width: 50px;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: rgba(136, 136, 136, 1);
  position: relative;
}
.evaluation-nav-left ul li:nth-child(1) {
  margin-left: 3%;
}
.evaluation-nav-left ul li:nth-child(2) {
  margin-left: 8.3%;
}
.evaluation-nav-left ul li:nth-child(3) {
  margin-left: 8.3%;
}
.evaluation-nav-left ul li::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -5%;
  width: 0;
  height: 3px;
  border-bottom: 3px solid #546bdb;
}
.evaluation-nav-left ul li:hover {
  color: #596ed6;
  &::before {
    width: 80%;
  }
}
.evaluation-nav-left ul li.changeStyle {
  color: #596ed6;
  &::before {
    width: 80%;
  }
}

.evaluation-nav-right {
  float: right;
  width: 11.5%;
  margin-right: 2.8%;
  height: 30px;
  line-height: 30px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(218, 221, 236, 1);
  border-radius: 3px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: rgba(112, 112, 112, 1);
  text-align: center;
  margin-top: 9px;
  &:hover {
    border:1px solid #89A5FF;
  }
}
</style>
