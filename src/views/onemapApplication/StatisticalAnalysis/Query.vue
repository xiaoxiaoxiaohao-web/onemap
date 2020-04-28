<template>
  <div class="SA-query">
    <div class="query-content">
      <!-- 主体内容 -->
      <div class="content-body">
        <ScrollDiv>
          <ShowAnalysisBox v-for="(item, index) in ModulesDataList" :key="index" v-show="canShowControl(item.orderId)" ref="module" :moduleData="item" :parentIndex="index" :allModuleData="ModulesDataList" @chooseModule="chooseModule">
          </ShowAnalysisBox>
        </ScrollDiv>
      </div>
      <!-- 底部按钮 -->
      <div class="content-bottom">
        <div class="bottom-body">
          <el-select v-model="selectValue" placeholder="全市" class="place-slt">
            <el-option v-for="s in options" :key="s.value" :label="s.label" :value="s.value">
            </el-option>
          </el-select>
          <el-button class="draw-btn" @click="drawRange"><i class="icon-draw" /> 绘制区域</el-button>
          <el-button class="upload-btn" @click="exportFile"><i class="icon-upload" />上传范围线</el-button>
        </div>
        <el-button class="query-btn" @click="onQueryClick">执行分析</el-button>
      </div>
      <!-- 隐藏内容 -->
      <!-- 导入内容 -->
      <div class="import-window">
        <import-file ref="importFile"></import-file>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import ShowAnalysisBox from './components/ShowAnalysisBox'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import importFile from './components/importFile'
import StatisticalAnalysis from '@/api/StatisticalAnalysis'
export default {
  name: 'Query',
  components: {
    ShowAnalysisBox,
    ScrollDiv,
    importFile
  },
  // 混入地图控制
  mixins: [executeMixin],
  props: [],
  data() {
    return {
      clickType: '0', // 顶部选中内容
      haveResult: false, // 查询过结果
      //暂用展示数据
      DataList: [],
      // 后台获取的展示数据
      ModulesDataList: [],
      inputCode: '', // 用地测量编号
      esriGeometryType: [
        'esriGeometryPoint',
        'esriGeometryMultipoint',
        'esriGeometryPolyline',
        'esriGeometryPolygon',
        'esriGeometryEnvelope'
      ],
      options: [
        { value: '1', label: '全市' },
        { value: '2', label: '新城区' },
        { value: '3', label: '未央区' },
        { value: '4', label: '碑林区' },
        { value: '5', label: '莲湖县' },
        { value: '6', label: '灞桥区' },
        { value: '7', label: '雁塔区' },
        { value: '8', label: '阎良区' },
        { value: '9', label: '临潼区' },
        { value: '10', label: '长安区' },
        { value: '11', label: '高陵区' },
        { value: '12', label: '鄠邑区' },
        { value: '13', label: '蓝天县' },
        { value: '14', label: '周至县' }
      ],
      selectValue: '',
      layerUrl: '',
      areaSum: '',
      numSum: '',
      barData_1: [],
      barData_2: [],
      pieData_1: [],
      comNum: 0
    }
  },
  created() {
    this.postAllModulesRelationData()
  },
  methods: {
    postAllModulesRelationData() {
      StatisticalAnalysis.postAllModulesRelation().then(res => {
        let module = res.data.config.module
        for (let i = 0; i < module.length; i++) {
          module[i].module.forEach(element => {
            element.isCheck = false
          })
        }
        this.ModulesDataList = module
      })
    },
    // 根据id排序方法
    sortByOrderId(data) {
      let newData = data
      let retrunData = []
      // 正确的顺序
      for (let i = 1; i < data.length + 1; i++) {
        // 内部顺序
        for (let n = 0; n < data.length; n++) {
          if (i === parseInt(data[n].orderId, 10)) {
            if (data[n].module) {
              data[n].module = this.sortByOrderId(data[n].module)
            }
            retrunData.push(data[n])
          }
        }
      }
      return retrunData
    },
    //获取到选中的按钮的信息
    chooseModule(res) {
      this.ModulesDataList.forEach(element => {
        element.module.forEach(e => {
          e.isCheck = false
        })
      })
      this.ModulesDataList[res[0]].module[res[1]].isCheck = true
      this.layerUrl = this.ModulesDataList[res[0]].module[res[1]].layer.layerUrl
      console.log(this.layerUrl)
    },
    // 查询按钮点击事件
    onQueryClick() {
      // 如果还没有范围
      if (this.selectValue !== '') {
        console.log(this.selectValue)
      } else if (this.$store.state.onemapApplication.coordinate.length <= 0) {
        this.$message({
          type: 'error',
          message: '分析范围不能为空'
        })
        return
      }
      let rings = JSON.parse(this.$store.state.onemapApplication.coordinate)
      if (this.btnName === '宗地统计分析') {
        let areaCondition = {}
        areaCondition.areaSum = [this.layerUrl, rings, '实测面积', 'sum', 'areaSum']
        areaCondition.numSum = [this.layerUrl, rings, 'OBJECTID', 'count', 'numSum']
        areaCondition.landUse = [this.layerUrl, rings, '是否为低效用地', 'count', 'ratioCount']
        areaCondition.practicalUse = [this.layerUrl, rings, '实际用途', 'count', 'useCount']
        this.$store.commit('onemapApplication/setAreaCondition', areaCondition)
        this.$emit('changeIsShowResult', true)
      } else if (this.btnName === '建筑统计分析') {
        let areaCondition = {}
        areaCondition.areaSum = [this.layerUrl, rings, 'Shape_Area', 'sum', 'areaSum']
        areaCondition.numSum = [this.layerUrl, rings, 'OBJECTID', 'count', 'numSum']
        areaCondition.Shape_Area = [this.layerUrl, rings, 'Shape_Area', [0, 50, 100, 200, 500, 1000, 1500]]
        areaCondition.layer = [this.layerUrl, rings, '总楼层', [1, 3, 7, 11, 24, 34]]
        areaCondition.material = [this.layerUrl, rings, '材质', 'count', 'buildMaterial']
        this.$store.commit('onemapApplication/setAreaCondition', areaCondition)
        this.$emit('changeIsShowResult', true)
      } else {
        this.$message({
          type: 'error',
          message: '暂无此分析模型'
        })
      }
    },
    // 判断分析是否展示
    canShowControl(type) {
      if (this.clickType === '0') {
        return true
      }
      if (this.clickType === type) {
        return true
      } else {
        return false
      }
    },
    // 自定义--绘制范围
    drawRange() {
      // 改变鼠标样式
      document.querySelector('#app').style.cursor = 'crosshair'
      // 关闭导入
      console.log('点击绘制')
      this.excuteMapMethod('drawPolygon')
    },
    // 导入文件
    exportFile() {
      // 打开导入窗口
      this.$refs.importFile.onUploadBtnClick()
      this.excuteMapMethod('removDarwFun')
    },
    // 返回结果页
    onToResultClick() {
      this.$emit('returnResult')
    },
    // 清除所有内容
    clearRange() {
      this.excuteMapMethod('removDarwFun')
      this.haveResult = false
      this.$store.commit('onemapApplication/changeGeometry', '')
    }
  },
  computed: {
    btnName() {
      return this.$store.state.onemapApplication.btnName
    }
  },
  watch: {
    // bulidData: {
    //   deep: true,
    //   immediate: true,
    //   handler(newVal) {
    //     console.log(newVal)
    //     this.$emit('changeIsShowResult', newVal)
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.SA-query {
  width: 500px;
  height: 100%;
  background-color: #f4f4f4;
  text-align: center;
  padding-top: 10px;
  .query-content {
    margin: 10px 20px 35px 20px;
    width: 458px;
    height: calc(100% - 97px);
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 225, 225, 1);
    border-radius: 8px;
    position: relative;
    .content-body {
      height: calc(100% - 152px);
    }
    .content-bottom {
      height: 120px;
      padding: 16px;
      width: calc(100% - 32px);
      position: absolute;
      bottom: 0;
      background-color: #ededee;
      border-radius: 0px 0px 8px 8px;
      .bottom-title {
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        span {
          color: #293c98;
          font-size: 16px;
        }
        .title-button {
          display: flex;
          .clear-btn {
            width: 66px;
            height: 28px;
            line-height: 28px;
            padding-top: 0px;
            background: rgba(92, 99, 171, 1);
            border-radius: 3px;
            color: white;
          }
          .result-btn {
            width: 66px;
            height: 28px;
            line-height: 28px;
            padding-top: 0px;
            background: rgb(73, 221, 73);
            border-radius: 3px;
            color: white;
          }
        }
      }
      .bottom-body {
        padding: 15px 0px;
        .place-slt {
          width: 120px;
          margin-right: 10px;
        }
        .upload-btn,
        .draw-btn {
          width: 140px;
          height: 32px;
        }
      }
      .query-btn {
        width: 160px;
        height: 36px;
        padding-top: 0px;
        line-height: 36px;
        font-size: 14px;
        background: rgba(255, 180, 0, 1);
        border-radius: 18px;
        color: white;
      }
    }
  }
  .import-window {
    display: none;
  }
}
</style>
