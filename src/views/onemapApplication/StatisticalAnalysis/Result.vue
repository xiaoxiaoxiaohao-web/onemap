<template>
  <div class="SA-result">
    <div class="top">
      <!-- 锚点链接内容 -->
      <!-- <BlocksTypeSelect @onTypeButtonClick="onTypeButtonClick" @onReturnClick="onReturnClick" :clickType="clickType" :topTypeList="topTypeList"></BlocksTypeSelect> -->
      <BlocksTypeSelect @onTypeButtonClick="onTypeButtonClick" @onReturnClick="onReturnClick" :title="resultTitle"></BlocksTypeSelect>
    </div>
    <div class="area-num">
      <div class="area">
        <p>{{areaData.title}}</p>
        <p>{{areaData.area}}</p>
      </div>
      <div class="num">
        <p>{{numData.title}}</p>
        <p>{{numData.num}}</p>
      </div>
    </div>
    <div class="content" v-if="resultShow">
      <ResultBarChart :chartData="barChartData_1"></ResultBarChart>
      <ResultBarChart :chartData="barChartData_2"></ResultBarChart>
      <!-- <BulidAreaBarChart></BulidAreaBarChart>
      <BulidLayerBarChart></BulidLayerBarChart> -->
      <ResultPieChart :pieData="pieChartData_1"></ResultPieChart>
    </div>
    <div class="content" v-else>
      <ResultBarChart :chartData="barChartData_3" :isIncrease="isIncrease"></ResultBarChart>
      <ResultPieChart :pieData="pieChartData_2"></ResultPieChart>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import BlocksTypeSelect from './components/BlocksTypeSelect'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import SpatialAnalysis from '@/api/SpatialAnalysis'
import ResultBarChart from './components/ResultBarChart'
// import BulidAreaBarChart from './components/BulidAreaBarChart'
// import BulidLayerBarChart from './components/BulidLayerBarChart'
import ResultPieChart from './components/ResultPieChart'
import toolbarMixin from '@/views/components/Map/mixin/toolbarMixin'
export default {
  name: 'Result',
  components: {
    BlocksTypeSelect,
    ResultBarChart,
    ResultPieChart
    // BulidAreaBarChart,
    // BulidLayerBarChart
  },
  mixins: [executeMixin],
  props: {
    data: {
      type: Array
    },
    isShowContorl: {
      type: Boolean
    }
  },
  data() {
    return {
      clickType: '', // 顶部选中内容
      barChartData_1: {
        num: '1',
        seriesData: []
      },
      barChartData_2: {
        num: '2',
        seriesData: []
      },
      barChartData_3: {
        num: '3',
        seriesData: [],
        yAxisData: []
      },
      isIncrease: true,
      resultShow: true, //统计显示结果
      resultTitle: '建筑统计分析',
      pieChartData_1: { },
      pieChartData_2: { },
      areaData: { title: '区域面积(km²)', area: '' },
      numData: { title: '建筑数量(栋)', num: '' },
      topTypeList: [],
      visible: false, // 分屏选择展示控制
      checkedTypes: [], // 当前选中内容名称
      checkedLayerUrl: [], // 当前选中内容
      refreshTable: false // 表格刷新
    }
  },
  created() {
    this.getChooseButtonData()
  },
  mounted() {
    // this.handleData(this.data)
  },
  methods: {
    //建筑分析数据
    getBulidChartData1() {
      // this.areaData.area = val
      let param = this.getAreaCondition.areaSum
      this.excuteMapMethod('analysisQuery', param[0], param[1], param[2], param[3], param[4], (res) => {
        console.log(res)
        this.areaData.area = res.features[0].attributes.areaSum.toFixed(3)
      })
    },
    getBulidChartData2() {
      let param = this.getAreaCondition.numSum
      this.excuteMapMethod('analysisQuery', param[0], param[1], param[2], param[3], param[4], (res) => {
        console.log(res)
        this.numData.num = res.features[0].attributes.numSum
      })
    },
    getBulidChartData3() {
      let param = this.getAreaCondition.Shape_Area
      let areaArray = []
      this.excuteMapMethod('queryRange', param[0], param[1], param[2], param[3], (res) => {
        console.log(res)
        res.forEach(element => {
          areaArray.push(element.features[0].attributes.NUM)
        })
      })
      this.barChartData_1.seriesData = areaArray
    },
    getBulidChartData4() {
      let param = this.getAreaCondition.layer
      let layerArray = []
      this.excuteMapMethod('queryRange', param[0], param[1], param[2], param[3], (res) => {
        console.log(res)
        res.forEach(element => {
          if (element.features.length > 0) {
            layerArray.push(element.features[0].attributes.NUM)
          } else {
            layerArray.push(0)
          }
        })
      })
      this.barChartData_2.seriesData = layerArray
    },
    getBulidChartData5() {
      let param = this.getAreaCondition.material
      let _this = this
      this.excuteMapMethod('analysisQuery', param[0], param[1], param[2], param[3], param[4], (res) => {
        console.log(res)
        this.pieChartData_1 = {
          text: '建筑材料',
          // legendData: ['混', '砖', '简', '钢', '硂', '其他'],
          seriesColor: ['#975FE5', '#3AA1FF', '#3ED1DE', '#10C144', '#FBB837', '#F2637B'],
          seriesData: []
        }
        let materialArray = [{ value: 0, name: '其他' }]
        res.features.forEach(element => {
          let material = element.attributes.材质
          let num = element.attributes.buildMaterial

          if (material === ' ' || material === '*') {
            materialArray[0].value += num || 0
          } else {
            materialArray.push({ name: material, value: num || 0 })
          }
        })

        this.pieChartData_1.seriesData = materialArray
      })
    },
    //宗地分析数据
    getParcelChartData1() {
      let param = this.getAreaCondition.landUse
      let ratioArray = []
      this.pieChartData_2 = {
        text: '宗地利用率',
        // legendData: ['高利用率', '低利用率'],
        seriesColor: ['#38A1FF', '#36CBCB'],
        seriesData: []
      }
      this.excuteMapMethod('analysisQuery', param[0], param[1], param[2], param[3], param[4], (res) => {
        res.features.forEach(element => {
          let count = element.attributes.ratioCount
          let ratio = element.attributes.是否为低效用地
          ratioArray.push({ name: ratio === '0' ? '低利用率' : '高利用率', value: count || 0 })
        })
      })
      this.pieChartData_2.seriesData = ratioArray
    },
    getParcelChartData2() {
      let param = this.getAreaCondition.practicalUse
      let useArray = [0]
      let nameArray = ['其他']
      this.excuteMapMethod('analysisQuery', param[0], param[1], param[2], param[3], param[4], (res) => {
        res.features.forEach(element => {
          let use = element.attributes.实际用途
          let count = element.attributes.useCount
          let num = 0
          if (use === '空' || use === '0' || use === '#N/A') {
            useArray[0] += count || 0
          } else {
            nameArray.push(use)
            useArray.push(count || 0)
          }
        })
      })
      this.barChartData_3.seriesData = useArray
      this.barChartData_3.yAxisData = nameArray
    },
    //查询结果头部变化
    getChooseButtonData() {
      let btnName = this.$store.state.onemapApplication.btnName
      if (btnName === '建筑统计分析') {
        this.resultShow = true
        this.resultTitle = '建筑统计分析'
        this.getBulidChartData1()
        this.$nextTick(() => {
          this.getBulidChartData2()
          this.$nextTick(() => {
            this.getBulidChartData3()
            this.$nextTick(() => {
              this.getBulidChartData4()
              this.$nextTick(() => {
                this.getBulidChartData5()
              })
            })
          })
        })
      } else if (btnName === '宗地统计分析') {
        this.resultShow = false
        this.resultTitle = '宗地统计分析'
        this.numData.title = '宗地数量(宗)'
        this.getBulidChartData1()
        this.$nextTick(() => {
          this.getBulidChartData2()
          this.$nextTick(() => {
            this.getParcelChartData1()
            this.$nextTick(() => {
              this.getParcelChartData2()
            })
          })
        })
      }
    },
    // // 处理获取的数据
    // handleData(data) {
    //   console.log('**********数据*****************', data)
    //   this.topTypeList = []
    //   for (let i = 0; i < data.length; i++) {
    //     let newObj = {
    //       name: data[i].heard,
    //       type: data[i].vueId,
    //       layerUrl: data[i].layerUrl
    //     }
    //     this.topTypeList.push(newObj)
    //     // 顶部内容默认选中第一个
    //     if (i === 0) {
    //       this.$nextTick(() => {
    //         this.clickType = data[i].vueId
    //       })
    //     }
    //     // 分屏控制
    //     this.visible = false
    //     this.checkedTypes = []
    //   }
    // },
    // 返回按钮点击事件
    onReturnClick() {
      this.$emit('changeIsShowResult', false)
      this.visible = false
    },
    // 表格类型锚点选择
    onTypeButtonClick(type) {
      this.clickType = type
    },
    // 导出按钮点击事件
    onExportResultClick() {
      console.log('导出按钮点击事件')
      // 1.组织数据结构
      let jsonParam = {}
      this.data.forEach(element => {
        // 去掉rings部分
        let features = []
        for (let i in element.tableObj.tableDataList) {
          let obj = {
            attributes: element.tableObj.tableDataList[i].attributes
          }
          features.push(obj)
        }
        let newObj = {
          module: {
            moduleResultName: element.title,
            conclusion: element.conclusion
          },
          resultJsonObj: {
            features: features,
            fieldAliases: element.fieldAliases
          }
        }
        jsonParam[element.vueId] = newObj
      })
      // console.log('组织的内容:', JSON.stringify(jsonParam))
      SpatialAnalysis.exportResult({ jsonParam: JSON.stringify(jsonParam) }).then(res => {
        // console.log('导出结果：' + res)
        this.downloadFile(res, 'resultOfAnalyze.xls')
      })
    },
    // 保存文件流数据为文件
    downloadFile(data, fileName) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      // 模拟A标签点击事件
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  computed: {
    getButtonName() {
      return this.$store.state.onemapApplication.btnName
    },
    getAreaCondition() {
      return this.$store.state.onemapApplication.areaCondition
    }
    // ...mapState({
    //   getBtnName: state => state.onemapApplication.btnName
    // })
  },
  watch: {
    getButtonName(newVal) {
      console.log(newVal)
    },
    // getBtnName(newVal) {
    //   console.log(newVal)
    // },
    checkedTypes: {
      handler(newVal, oldVal) {
        this.checkedLayerUrl = []
        console.log('选择多屏：' + JSON.stringify(newVal))
        for (let n = 0; n < newVal.length; n++) {
          for (let i = 0; i < this.data.length; i++) {
            if (newVal[n] === this.data[i].heard) {
              let obj = {
                layerUrl: this.data[i].layerUrl,
                title: this.data[i].heard
              }
              this.checkedLayerUrl.push(obj)
              break
            }
          }
        }
        console.log('多屏结果：' + JSON.stringify(this.checkedLayerUrl))
      },
      deep: true
    },
    isShowContorl(val) {
      // 如果收缩控制、并且内容展开，则收缩内容
      if (!val && this.visible) {
        this.visible = false
      }
    },
    areaData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(newVal)
      }
    },
    barChartData_1: {
      immediate: true,
      deep: true,
      handler(newVal) {
        console.log(newVal)
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.SA-result {
  width: 500px;
  height: 100%;
  background-color: #f4f4f4;
  text-align: center;
  .top {
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #e1e1e1;
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    background-color: white;
    width: calc(100% - 40px);
  }
  .area-num {
    display: flex;
    margin: 10px 20px;
    color: white;
    .area,
    .num {
      width: 185px;
      height: 48px;
      background-color: #7f7fef;
      border-radius: 8px;
      padding: 10px 20px 20px 20px;
      text-align: left;
      & > p {
        font-size: 14px;
      }
      & > p + p {
        margin-top: 10px;
        font-size: 24px;
        overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
    .num {
      margin-left: 10px;
      background-color: #56cece;
    }
  }
  .content {
    height: calc(100% - 250px);
    width: calc(100% - 40px);
    margin: 0px 10px 68px 10px;
    padding: 0px 10px 10px 10px;
    // overflow-x: hidden;
    // overflow: auto;
    transition: all 0.5s;
    div {
      margin-top: 15px;
    }
  }
  .all-map-css {
    width: 100vw;
  }
}
</style>
