<template>
  <div class="dataShow">
    <div class="resultsTable">
      <div class="table-theme">
        <p class="theme-text">{{theme}}</p>
        <p class="theme-unit">{{unit}}</p>
      </div>
      <div class="table-content">
        <el-table class='cursor-pointer' :data="tableData" header-row-class-name="no-height" style="width: 100%; color:#555555;font-size:14px;" >
          <el-table-column prop="adaptText" label=" " width="93%" align="center" class-name="no-bottom-border" >
          </el-table-column>
          <el-table-column label="2019" width="100%" align="center">
            <el-table-column prop="nineLeft" width="64%" class-name="no-right-border column-active no-bottom-border">
            </el-table-column>
            <el-table-column prop="nineRight" width="70%" class-name="no-bottom-border">
            </el-table-column>
          </el-table-column>
          <el-table-column label="2018" width="100%" align="center">
            <el-table-column prop="eightLeft" width="64%" class-name="no-right-border no-bottom-border">
            </el-table-column>
            <el-table-column prop="eightRight" width="70%" class-name="no-bottom-border">
            </el-table-column>
          </el-table-column>
          <el-table-column label="2017" width="100%" align="center">
            <el-table-column prop="sevenLeft" width="64%" class-name="no-right-border no-bottom-border">
            </el-table-column>
            <el-table-column prop="sevenRight" width="70%" class-name="no-bottom-border">
            </el-table-column>
          </el-table-column>
          <el-table-column label="总变化量" width="100%" align="center">
            <el-table-column prop="changeIcon" width="30%" class-name="no-right-border no-bottom-border">
            </el-table-column>
            <el-table-column prop="changeLeft" width="64%" class-name="no-right-border no-bottom-border">
            </el-table-column>
            <el-table-column prop="changeRight" width="70%" class-name="no-bottom-border">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="resultsFooter">
      <p class="resultsFooter-title">土地资源适宜性分级数据趋势分析图</p>
      <ul class="resultsFooter-select clear-fix">
        <li class="cursor-pointer" @click=selectLine :class="{'actived':addclass === false}">折线图</li>
        <li class="cursor-pointer" @click=selectBar :class="{'actived':addclass === true}">条形图</li>
      </ul>
      <div class="resultsFooterCont">
        <div class="resultsFooter-echart">
          <!-- 条形图 -->
           <div class="ResultsShow-bar" v-show="displayMode === 'showBar'">
            <div ref="myChartBar" class="barCanvas"></div>
          </div>
          <!-- 折线图 -->
          <div class="ResultsShow-line" v-show="displayMode === 'showLine'">
            <div ref="myChartLine" class="lineCanvas"></div>
          </div>
        </div>
        <div class="resultsFooter-footer">
          <p>
            中山市总行政面积为1783.7km²，现对其农业生产适宜性评价中的土地资源适宜性单项评价数据与往年数据进行比对分析，
             经分析得出：农业生产土地资源适宜性高的面积为147.12km²，较2017年增长29.07km²，增长比为24.62%；
             农业生产土地资源适宜性较高的面积为320.94km²，较2017年降低80.38km²，增长比为-20.03%；
              农业生产土地资源适宜性一般的面积为768.57km²，较2017年增长107.02km²，增长比为16.18%；
              农业生产土地资源适宜性较低的面积为378.48km²，较2017年增长19.50km²，增长比为5.43%；
              农业生产土地资源适宜性低的面积为177.14km²，较2017年降低66.66km²，增长比为-27.34%。
          </p>
          <p>
            总体而言，花都区农业生产土地资源适宜性朝较明朗态势发展。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Data',
  components: {
  },
  props: [],
  data() {
    this.myBarChart = null
    this.myLineChart = null
    return {
      theme: '土地资源适宜性分级数据对比统计汇总表',
      unit: ' 单位: km²',
      tableData: [ //table
        {
          adaptText: '适应性高',
          nineLeft: '14.12',
          nineRight: '80.5%',
          eightLeft: '11.2',
          eightRight: '10.1%',
          sevenLeft: '22.1',
          sevenRight: '10.5%',
          changeLeft: '251.12',
          changeRight: '25.03%',
          changeIcon: <span class="up">↑</span>
        },
        {
          adaptText: '适应性较高',
          nineLeft: '124.12',
          nineRight: '12.5%',
          eightLeft: '11.30',
          eightRight: '10.12%',
          sevenLeft: '22.21',
          sevenRight: '11.15%',
          changeLeft: '221.02',
          changeRight: '35.32%',
          changeIcon: <span class="up">↑</span>
        },
        {
          adaptText: '适应性一般',
          nineLeft: '125.12',
          nineRight: '12.03%',
          eightLeft: '11.41',
          eightRight: '10.03%',
          sevenLeft: '22.31',
          sevenRight: '12.51%',
          changeLeft: '255.02',
          changeRight: '32.03%',
          changeIcon: <span class="up">↑</span>
        },
        {
          adaptText: '适应性较低',
          nineLeft: '148.12',
          nineRight: '0.12%',
          eightLeft: '11.15',
          eightRight: '10.14%',
          sevenLeft: '22.4',
          sevenRight: '13.15%',
          changeLeft: '201.13',
          changeRight: '36.11%',
          changeIcon: <span class="down">↓</span>
        },
        {
          adaptText: '适应性低',
          nineLeft: '94.12',
          nineRight: '91.03%',
          eightLeft: '11.51',
          eightRight: '10.15%',
          sevenLeft: '22.40',
          sevenRight: '14.15%',
          changeLeft: '271.02',
          changeRight: '95.01%',
          changeIcon: <span class="down">↓</span>
        }
      ],
      optionBar: {}, //柱状图echart实例
      optionLine: {}, //折线图echart实例
      displayMode: 'showBar',
      addclass: true
    }
  },
  computed: {
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    },
    //国土空间规划评价首次点击数据时出现条形图
    getBarShowVal() {
      return this.$store.state.territorialPlanEvaluate.getBarShow
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
    getBarShowVal(oldval, newval) {
      //情况控制点击数据时渲染echart条形图的值
      this.$store.commit('territorialPlanEvaluate/evaluationDataEchart', '')
      //点击数据首次渲染echart条形图
      if (newval === '') {
        this.drawBar()
      }
    }

  },
  created() {

  },
  mounted() {

  },
  methods: {
    selectBar() {
      this.displayMode = 'showBar'
      this.addclass = true
      this.$nextTick(() => {
        this.drawBar()
      })
    },
    selectLine() {
      this.displayMode = 'showLine'
      this.addclass = false
      this.$nextTick(() => {
        this.drawLine()
      })
    },
    //柱状图绘制
    drawBar() {
      this.myBarChart = this.$echarts.init(this.$refs.myChartBar)
      this.optionBar = {
        title: [{
          text: '中山市土地资源分级趋势条形图',
          x: 'center',
          y: '1%',
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
        color: ['#FD322D', '#FFA71D', '#89A5FF'],
        legend: {
          top: '10%',
          left: 'center',
          itemWidth: 20,
          itemHeight: 4
        },
        tooltip: {},
        grid: {
          top: '20%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        dataset: {
          source: [
            ['年份', '2017', '2018', '2019'],
            ['低', 93, 12, 24],
            ['较低', 55, 23, 54],
            ['一般', 82, 10, 9],
            ['较高', 39, 42, 23],
            ['高', 39.1, 14, 52]
          ]
        },
        xAxis: {

        },
        yAxis: { type: 'category' },
        series: [
          { type: 'bar', barGap: '1%', barWidth: '5px' },
          { type: 'bar', barGap: '1%', barWidth: '5px' },
          { type: 'bar', barGap: '1%', barWidth: '5px' }
        ]
      }
      this.myBarChart.clear()
      this.myBarChart.setOption(this.optionBar, true)
    },
    //折线图绘制
    drawLine() {
      this.myLineChart = this.$echarts.init(this.$refs.myChartLine)
      this.optionLine = {
        title: [{
          text: '中山市土地资源分级趋势折线图',
          x: 'center',
          y: '1%',
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
        color: ['#FD322D', '#FFA71D', '#89A5FF'],
        legend: {
          top: '10%',
          left: 'center',
          itemWidth: 9, // 设置宽度
          itemHeight: 9, // 设置高度
          itemGap: 15, // 设置间距
          data: ['2017', '2018', '2019']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['高', '较高', '一般', '较低', '低']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '2017',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '2018',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '2019',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          }

        ]

      }
      this.myLineChart.clear()
      this.myLineChart.setOption(this.optionLine, true)
    }


  }
}
</script>
<style lang="scss" scoped>
.dataShow {
  width: 95%;
  margin: 0 auto;
  height: calc(100% - 80px);
  padding-top: 10px;
  position: relative;
}
.resultsFooter {
  margin-top: 10px;
  border: 1px solid rgba(225, 225, 225, 1);
  border-radius: 8px;
}
.resultsFooter-title {
  margin-top: 10px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: #293c98;
  margin-left: 3%;
}
.resultsFooter-select li {
  float: right;
  width: 70px;
  height: 28px;
  line-height: 28px;
  background: #eeeeee;
  border-radius: 3px;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  text-align: center;
  color: #999999;
  margin-right: 5px;
}
.resultsFooterCont {
  margin-top: 10px;
  position: relative;
  .resultsFooter-echart {
    // 柱状/折线图
    .ResultsShow-bar,
    .ResultsShow-line {
      width: 656px;
      height: 200px;
      margin: 0 auto;
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
  }
}
.resultsFooter-footer {
  margin-top: 25px;
  padding-bottom: 20px;
}
.resultsFooter-footer p {
  font-size: 14px;
  padding: 0 25px;
  font-family: 'Microsoft YaHei';
  color: #333333;
  line-height: 24px;
  text-indent: 20px;
}
//点击激活
.resultsFooter-select li.actived {
  background: #21bdca;
  color: white;
}
//table
.resultsTable {
  height: 285px;
  background-color: white;
  border: 1px solid rgba(225, 225, 225, 1);
  border-radius: 8px;
  padding: 0 10px 10px 10px;
  .table-theme {
    height: 45px;
    line-height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .theme-text {
      color: #293c98;
      font-size: 16px;
      padding-left: 10px;
    }
    .theme-unit {
      font-size: 12px;
      color: #555555;
    }
  }
}
.up {
  font-size: 18px;
  color: #ff3333;
}
.down {
  font-size: 20px;
  color: #08a000;
}
</style>
