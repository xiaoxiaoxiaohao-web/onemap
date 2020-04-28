<template>
  <div class="ResultsShow">
    <div class="ResultsShow-nav">
      <p class="ResultsShow-nav-title">中山市农业生产土地资源适宜性等级评价结果汇总表</p>
      <div class="ResultsShow-nav-nav clear-fix">
        <p class="ResultsShow-nav-explain" v-show="displayMode === 'showTable'">单位：面积，km²；比重，%</p>
        <ul class="ResultsShow-nav-select clear-fix">
          <li class="cursor-pointer" v-for="(item,index) in listSelect" @click="onItemClick(index,item)" :key="index" :class="{'active':inde === index}">{{item.name}}</li>
        </ul>
      </div>
      <!-- 测试导出 -->
      <div class="outside-div">
        <div class="inside-div" ref="inside">
          <!-- 表格 -->
          <div class="ResultsShow-table" v-if="displayMode === 'showTable'">
            <el-table ref="myTable" :row-class-name="'current-Class'" class='cursor-pointer' @cell-click="onCellClick" :cell-style="cellColor" :data="tableList" :span-method="objectSpanMethod" height="250" :row-style="rowClass" border style="width: 98%; margin-top: 20px;margin: 0 auto;height:100%;overflow:auto;">
              <el-table-column prop="district" label="区域">
                <el-table-column prop="city" width="58" label="市">
                </el-table-column>
                <el-table-column prop="street" width="58" label="街道">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="hight" label="高">
                <el-table-column prop="hightarea" width="55.5" label="面积">
                </el-table-column>
                <el-table-column prop="hightproportion" width="55.5" label="比重">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="higher" label="较高">
                <el-table-column prop="higherarea" width="55.5" label="面积">
                </el-table-column>
                <el-table-column prop="higherproportion" width="55.5" label="比重">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="medium" label="中等">
                <el-table-column prop="mediumarea" width="55.5" label="面积">
                </el-table-column>
                <el-table-column prop="mediumproportion" width="55.5" label="比重">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="lower" label="较低">
                <el-table-column prop="lowerarea" width="55.5" label="面积">
                </el-table-column>
                <el-table-column prop="lowerproportion" width="55.5" label="比重">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="low" label="低">
                <el-table-column prop="lowarea" width="55.5" label="面积">
                </el-table-column>
                <el-table-column prop="lowproportion" width="55.5" label="比重">
                </el-table-column>
              </el-table-column>

            </el-table>
          </div>
          <!-- 柱状图 -->
          <div class="ResultsShow-bar">
            <div ref="myChartBar" class="barCanvas"></div>
          </div>
          <!-- 折线图 -->
          <div class="ResultsShow-line">
            <div ref="myChartLine" class="lineCanvas"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ResultsShow-cont">
      <p class="ResultsShow-cont-title">中山市农业生产土地资源适宜性等级评价结果分析</p>
      <div class="ResultsShow-cont-cont">
        <p>
          中山市，总行政面积为1783.74km²，现对其进行农业生产适宜性评价中的气候适宜性单项评价， 农业生产气候适宜性一般的面积为839.43km²，占比47.64%； 农业生产气候适宜性较低的面积为235.66km²，占比13.21%；农业生产气候适宜性低的面积为110.92km²， 占比6.22%。
        </p>
        <p>其中，南区街道总行政面积为49.15km，农业生产气候适宜性高的面积为7.12km²， 占比14.49%； 农业生产气候适宜性较高的面积为8.06km²，占比16.40%；农业生产气候适宜性一般的面积为23.16km²， 占比47.12%； 农业生产气候适宜性较低的面积为10.49km²，占比21.35%；农业生产气候适宜性低的面积为5.53km²， 占比11.25%。
        </p>
        <p>注：定制评价分析报告模板，系统自动填充评价结果，自动生成分析报告。</p>
      </div>
    </div>
  </div>
</template>
<script>
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import Suitability from '@/api/territorialPlanEvaluate/Suitability'
export default {
  name: 'ResultsShow',
  components: {
  },
  mixins: [executeMixin],
  props: [],
  data() {
    this.myBarChart = null
    this.myLineChart = null
    return {
      listSelect: [
        {
          'name': '表格',
          'value': 'showTable',
          'id': 0
        },
        {
          'name': '柱状图',
          'value': 'showBar',
          'id': 1
        },
        {
          'name': '折线图',
          'value': 'showLine',
          'id': 2
        }
      ],
      inde: 0, //切换栏的下标,
      displayMode: 'showTable',
      resultsList: [], //初始化成果数组
      resultsListDeep: [], //深拷贝始化成果数组
      tableList: [], //table表格渲染
      optionBar: {}, //柱状图echart实例
      optionLine: {}, //折线图echart实例
      xAxisTitle: [], // 2个echart的x轴的数值
      yAxisHeight: [], //柱状/折线图的高等级的数组
      yAxisHigher: [], //柱状/折线图的较高等级的数组
      yAxismedium: [], //柱状/折线图的中等等级的数组
      yAxislower: [], //柱状/折线图的较低等级的数组
      yAxisLow: [], //柱状/折线图的第等级的数组
      rowindexActive: '', //点击当前单元格的行的index
      colindexActive: '', //点击当前单元格的列的index
      getStreetName: ''//选择街道的名字

    }
  },
  computed: {
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    },
    getDistrictStreetVal() {
      return this.$store.state.territorialPlanEvaluate.getDistrictStreet
    }
  },
  watch: {
    htmlFontSize() {
      if (this.myBarChart) {
        this.myBarChart.resize()
      }
      if (this.myLineChart) {
        this.myLineChart.resize()
      }
    },
    getDistrictStreetVal(val) {
      this.getStreetName = val
      //表格重新绘制
      this.$refs.myTable.doLayout()
    },
    displayMode(val) {
      if (val === 'showTable') {
        if (this.resultsList.length !== 0) {
          //table表格最左边的一个
          this.tableEspeciallyStyle()
        }
      }
    }
  },
  created() {
    //初始化table表格数据
    this.evaluationResultsInit()
  },
  mounted() {
  },
  updated() {

  },
  methods: {
    //初始化调成果接口
    evaluationResultsInit() {
      Suitability.evaluationResults().then(res => {
        if (res.status === 1) {
          //每一次切换echart图和table表格来回切换涉及到的数组值会不断的push,所以每一次要先清空
          this.resultsList = []
          this.resultsListDeep = []
          this.tableList = []
          this.xAxisTitle = []
          this.yAxisHeight = []
          this.yAxisHigher = []
          this.yAxismedium = []
          this.yAxislower = []
          this.yAxisLow = []
          //清空的数组重新赋值
          this.resultsList = res.data
          this.resultsListDeep = this.deepCopy(this.resultsList)
          for (var i = 0; i < this.resultsList.length; i++) {
            this.tableList.push({
              city: '中山市',
              street: '',
              hightarea: '',
              hightproportion: '',
              higherarea: '',
              higherproportion: '',
              mediumarea: '',
              mediumproportion: '',
              lowerarea: '',
              lowerproportion: '',
              lowarea: '',
              lowproportion: ''
            })
            //把每一个街道的5个等级(高,较高,中等,较低,低)补全
            if (this.resultsList[i].length !== 0 && this.resultsList[i].length < 5) {
              for (var k = 0; k < 5 - this.resultsList[i].length; k++) {
                this.resultsListDeep[i].push({
                  rankArea: '0.00',
                  rankCode: this.resultsList[i].length + k + 1,
                  rankLandScale: '0.00',
                  regionName: this.resultsList[i][0].regionName
                })
              }
            }
            //table表格部分
            this.tableList[i].street = this.resultsListDeep[i][0].regionName
            this.tableList[i].hightarea = this.resultsListDeep[i][4].rankArea
            this.tableList[i].hightproportion = this.resultsListDeep[i][4].rankLandScale
            this.tableList[i].higherarea = this.resultsListDeep[i][3].rankArea
            this.tableList[i].higherproportion = this.resultsListDeep[i][3].rankLandScale
            this.tableList[i].mediumarea = this.resultsListDeep[i][2].rankArea
            this.tableList[i].mediumproportion = this.resultsListDeep[i][2].rankLandScale
            this.tableList[i].lowerarea = this.resultsListDeep[i][1].rankArea
            this.tableList[i].lowerproportion = this.resultsListDeep[i][1].rankLandScale
            this.tableList[i].lowarea = this.resultsListDeep[i][0].rankArea
            this.tableList[i].lowproportion = this.resultsListDeep[i][0].rankLandScale
            //echart柱状图/折线图的x轴部分
            this.xAxisTitle.push(this.resultsListDeep[i][0].regionName)
          }
          for (let j = 0; j < this.resultsListDeep.length; j++) {
            //echart柱状图/折线图y轴部分
            this.yAxisHeight.push(this.resultsListDeep[j][4].rankArea) //高
            this.yAxisHigher.push(this.resultsListDeep[j][3].rankArea) //较高
            this.yAxismedium.push(this.resultsListDeep[j][2].rankArea) //中等
            this.yAxislower.push(this.resultsListDeep[j][1].rankArea) //较低
            this.yAxisLow.push(this.resultsListDeep[j][0].rankArea) //低
          }
          this.$nextTick(() => {
            //table表格最左边的一个
            this.tableEspeciallyStyle()
            this.drawBar(this.xAxisTitle, this.yAxisHeight, this.yAxisHigher, this.yAxismedium, this.yAxislower, this.yAxisLow)
            this.drawLine(this.xAxisTitle, this.yAxisHeight, this.yAxisHigher, this.yAxismedium, this.yAxislower, this.yAxisLow)
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取评价成果数据失败'
        })
      })
    },
    //图表和表格的切换
    onItemClick(index, item) {
      this.inde = index
      this.displayMode = item.value
      if (this.displayMode === 'showTable') {
        //table表格最左边的一个
        if (this.resultsList.length !== 0) {
          this.$refs.myTable.doLayout()
          this.tableEspeciallyStyle()
        }
      }
      // 表格切换滚动问题解决
      let num = (index - 1) ? (index - 1) : 0
      let width = this.pxSuitRem(680 * num)
      console.log('移动距离：' + width)
      this.$refs.inside.style.WebkitTransform = 'translate(-' + width + 'rem)'
    },
    // 转换PX自适应
    pxSuitRem(width) {
      const pxNow = width * (this.htmlFontSize / process.env.VUE_APP_ROOT_VALUE)
      const remWidth = pxNow / this.htmlFontSize
      return remWidth
    },
    //图表的合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableList.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    //table表格最左边的一个
    tableEspeciallyStyle() {
      let tableEspecially = document.getElementsByClassName('current-Class')[0].children[0]
      tableEspecially.style.background = 'white'
    },
    //图表的激活项
    rowClass(row) {
      if (row.row.street === this.getStreetName) {
        return { 'background-color': '#e6ebff' }
      }
    },
    //单元格点击
    onCellClick(row, column, cell, event) {
      this.rowindexActive = row.index
      this.colindexActive = column.index
    },
    //单元格颜色
    cellColor({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
      if (this.colindexActive > 1) {
        if (this.rowindexActive === rowIndex) {
          if (this.colindexActive === columnIndex) {
            return 'background:#ffface'
          } else if (this.colindexActive % 2 === 0 && columnIndex === this.colindexActive + 1) {
            return 'background:#ffface'
          } else if (this.colindexActive % 2 === 1 && columnIndex === this.colindexActive - 1) {
            return 'background:#ffface'
          }
        }
      }
    },
    //深拷贝
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]) //递归复制
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    //柱状图绘制
    drawBar(xAxisTitle, yAxisHeightBar, yAxisHigherBar, yAxismediumBar, yAxislowerBar, yAxisLowBar) {
      this.myBarChart = this.$echarts.init(this.$refs.myChartBar)
      this.optionBar = {
        title: [{
          text: '中山市农业生产土地资源适宜性等级评价柱状图',
          x: 'center',
          y: '2%',
          textAlign: 'left',
          textStyle: {//标题内容的样式
            color: '#555555',
            fontStyle: 'normal', //主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontSize: 14//主题文字字体大小
          }
        },
        {
          text: '单位：km²',
          x: 'right',
          y: '10%',
          textStyle: {//标题内容的样式
            color: '#555555',
            fontStyle: 'normal', //主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontSize: 12//主题文字字体大小
          }
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: ['#FD322D', '#FFA71D', '#89A5FF', '#88D7F8', '#90F5F2'],
        legend: {
          top: '10%',
          left: 'center',
          itemWidth: 9, // 设置宽度
          itemHeight: 9, // 设置高度
          itemGap: 15, // 设置间距
          data: ['高', '较高', '一般', '较低', '低']
        },
        grid: {
          left: '5%',
          bottom: '8px',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisTitle,
          axisLabel: {
            formatter: function (value) {
              return value.split('').join('\n')
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '高',
            type: 'bar',
            barWidth: 8,
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: yAxisHeightBar
          },
          {
            name: '较高',
            type: 'bar',
            barWidth: 8,
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: yAxisHigherBar
          },
          {
            name: '一般',
            type: 'bar',
            barWidth: 8,
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: yAxismediumBar
          },
          {
            name: '较低',
            type: 'bar',
            barWidth: 8,
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: yAxislowerBar
          },
          {
            name: '低',
            type: 'bar',
            barWidth: 8,
            stack: '总量',
            label: {
              normal: {
                show: false,
                position: 'insideRight'
              }
            },
            data: yAxisLowBar
          }
        ]
      }
      this.myBarChart.clear()
      this.myBarChart.setOption(this.optionBar, true)
    },
    //折线图绘制
    drawLine(xAxisTitle, yAxisHeightLine, yAxisHigherLine, yAxismediumLine, yAxislowerLine, yAxisLowLine) {
      this.myLineChart = this.$echarts.init(this.$refs.myChartLine)
      this.optionLine = {
        title: [{
          text: '中山市农业生产土地资源适宜性等级评价折线图',
          x: 'center',
          y: '2%',
          textAlign: 'left',
          textStyle: {//标题内容的样式
            color: '#555555',
            fontStyle: 'normal', //主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontSize: 14//主题文字字体大小
          }
        },
        {
          text: '单位：km²',
          x: 'right',
          y: '10%',
          textStyle: {//标题内容的样式
            color: '#555555',
            fontStyle: 'normal', //主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
            fontSize: 12//主题文字字体大小
          }
        }],
        tooltip: {
          trigger: 'axis'
        },
        color: ['#FD322D', '#FFA71D', '#89A5FF', '#88D7F8', '#90F5F2'],
        legend: {
          top: '10%',
          left: 'center',
          itemGap: 10, // 设置间距
          data: ['高', '较高', '一般', '较低', '低']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxisTitle,
          axisLabel: {
            formatter: function (value) {
              return value.split('').join('\n')
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '高',
            type: 'line',
            stack: '总量',
            data: yAxisHeightLine
          },
          {
            name: '较高',
            type: 'line',
            stack: '总量',
            data: yAxisHigherLine
          },
          {
            name: '一般',
            type: 'line',
            stack: '总量',
            data: yAxismediumLine
          },
          {
            name: '较低',
            type: 'line',
            stack: '总量',
            data: yAxislowerLine
          },
          {
            name: '低',
            type: 'line',
            stack: '总量',
            data: yAxisLowLine
          }
        ]
      }
      this.myLineChart.clear()
      this.myLineChart.setOption(this.optionLine, true)
    },
    // 导出图表内容
    exportChart() {
      let myChart = this.$echarts.init(this.$refs.myChartLine)
      let i = myChart.getDataURL({
        type: 'png',
        backgroundColor: '#fff'
        // 导出的图片分辨率比例，默认为 1。
        //pixelRatio: number,
      })
      var $a = document.createElement('a')
      $a.setAttribute('href', i)
      $a.setAttribute('download', 'exportChart.png')
      $a.click()
      return i
    }
  }
}
</script>
<style lang="scss" scoped>
.ResultsShow {
  background: #f4f4f4;
  height: calc(100% - 48px);
  padding-top: 10px;
  position: relative;
  .outside-div {
    width: 100%;
    height: calc(100% - 110px);
    overflow: hidden;
    .inside-div {
      display: flex;
      width: 9999px;
      height: 100%;
      flex-wrap: nowrap;
      transition: all 0.3s;
    }
  }
}
.ResultsShow-nav {
  width: 95%;
  margin: 0 auto;
  height: 47%;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(225, 225, 225, 1);
  border-radius: 8px;
  position: relative;
}
.ResultsShow-cont {
  width: 92.2%;
  margin: 0 auto;
  margin-top: 10px;
  padding: 0 10px;
  overflow: auto;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(225, 225, 225, 1);
  border-radius: 8px;
}
.ResultsShow-nav-title {
  margin-left: 20px;
  margin-top: 15px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: #293c98;
}
.ResultsShow-nav-nav {
  margin-top: 25px;
  height: 28px;
  line-height: 28px;
  margin-bottom: 15px;
}
.ResultsShow-nav-explain {
  float: left;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: rgba(85, 85, 85, 1);
  padding-left: 12px;
}
.ResultsShow-nav-select {
  float: right;
}
.ResultsShow-nav-select li {
  float: left;
  margin-right: 6px;
  padding-left: 15px;
  padding-right: 15px;
  height: 28px;
  line-height: 28px;
  background: rgba(238, 238, 238, 1);
  border-radius: 3px;
  color: #999999;
  text-align: center;
}
.ResultsShow-nav-select li.active {
  background: #21bdca;
  color: white;
}
.ResultsShow-table {
  height: calc(100% - 2px);
  width: 680px;
}

.ResultsShow-cont-title {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: rgba(41, 60, 152, 1);
  margin-left: 3.2%;
}
.ResultsShow-cont-cont {
  width: 97%;
  height: calc(100% - 50px);
  overflow: auto;
  margin: 0 auto;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(220, 220, 220, 1);
  margin-bottom: 10px;
  padding-bottom: 50px;
}
.ResultsShow-cont-cont p {
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: #555555;
  line-height: 24px;
  text-indent: 2em;
  padding-left: 18px;
  padding-right: 12px;
  margin-top: 25px;
}
// 柱状/折线图
.ResultsShow-bar,
.ResultsShow-line {
  border: 1px solid rgba(225, 225, 225, 1);
  width: 656px;
  height: calc(100% - 2px);
  margin: 0px 12px;
  position: relative;
  .barCanvas {
    width: 100%;
    height: 100%;
  }
  .lineCanvas {
    width: 100%;
    height: 100%;
  }
}
</style>
