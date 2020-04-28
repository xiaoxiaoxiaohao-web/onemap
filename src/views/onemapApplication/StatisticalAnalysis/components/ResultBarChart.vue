<template>
  <div ref="chart" :class="[isIncrease === true ? 'increase' : 'result-bar-chart'] ">
  </div>
</template>

<script>
import { format } from 'path'
export default {
  name: 'ResultBarChart',
  props: ['chartData', 'isIncrease'],
  data() {
    this.barChart_1 = null
    this.barChart_2 = null
    this.barChart_3 = null
    return {
      optionBar_1: {}, //柱状图echart实例
      optionBar_2: {},
      optionBar_3: {}
    }
  },
  computed: {
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    }
  },
  watch: {
    htmlFontSize() {
      if (this.chartData.num === '1') {
        this.barChart_1.resize()
      } else if (this.chartData.num === '2') {
        this.barChart_2.resize()
      } else {
        this.barChart_3.resize()
      }
    },
    chartData: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.excDrew()
      }
    }
  },
  methods: {
    excDrew() {
      this.$nextTick(() => {
        if (this.chartData.num === '1') {
          this.getOneChartData()
        } else if (this.chartData.num === '2') {
          this.getTwoChartData()
        } else {
          this.getThreeChartData()
        }
      })
    },
    //构建图表数据
    getOneChartData() {
      this.barChart_1 = this.$echarts.init(this.$refs.chart)
      this.optionBar_1 = {
        title: {
          text: '建筑面积',
          left: 'left',
          textStyle: {
            fontSize: 14,
            color: '#293C98',
            fontWeight: '100'
          }
        },
        color: ['#6EA8FF'],
        xAxis: [
          {
            type: 'category',
            data: ['50m²以下', '50-100m²', '100-200m²', '200-500m²', '500-1000m²', '1000-1500m²', '1500m²以上'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              rotate: -30,
              textStyle: {
                fontSize: 10 //更改坐标轴文字大小
              }
            },
            axisTick: { //隐藏刻度线
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            // max: 5000,
            // interval: 1000,
            axisLabel: {
              formatter: '{value}',
              textStyle: {
                fontSize: 10
              }
            }

          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            // data: ['800', '2300', '3500', '2600', '1900', '600', '1500'],
            data: this.chartData.seriesData,
            barWidth: 10
          }
        ]
      }
      this.barChart_1.clear()
      this.barChart_1.setOption(this.optionBar_1)
    },
    getTwoChartData() {
      this.barChart_2 = this.$echarts.init(this.$refs.chart)
      this.optionBar_2 = {
        title: {
          text: '建筑层数',
          left: 'left',
          textStyle: {
            fontSize: 14,
            color: '#293C98',
            fontWeight: '100'
          }
        },
        color: ['#6EA8FF'],
        xAxis: [
          {
            type: 'category',
            data: ['1-3层', '3-7层', '7-11层', '11-24层', '24-34层', '34层以上'],
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                fontSize: 12 //更改坐标轴文字大小
              }
            },
            axisTick: { //隐藏刻度线
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            min: 0,
            // max: 800,
            // interval: 1000,
            axisLabel: {
              textStyle: {
                fontSize: 10
              }
            }
          }
        ],
        series: [
          {
            name: '数量',
            type: 'bar',
            center: ['20%', '80%'],
            data: this.chartData.seriesData,
            barWidth: 10
          }
        ]
      }
      this.barChart_2.clear()
      this.barChart_2.setOption(this.optionBar_2)
    },
    getThreeChartData() {
      this.barChart_3 = this.$echarts.init(this.$refs.chart)
      this.optionBar_3 = {
        title: [{
          text: '宗地用途',
          textStyle: {
            color: '#293C98',
            fontSize: 12,
            fontWeight: '100'
          }
        }],
        grid: {
          left: 80,
          top: 30,
          bottom: 30
        },
        xAxis: {
          axisTick: { //隐藏刻度线
            show: false
          }
        },
        yAxis: {
          type: 'category',
          // data: ['宗教', '文娱', '机关', '办公', '教育', '商业', '医疗卫生', '住宅'],
          data: this.chartData.yAxisData,
          splitNumber: 80,
          axisTick: { //隐藏刻度线
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            data: this.chartData.seriesData,
            barWidth: 8,
            itemStyle: {
              color: function (val) {
                let arr = ['#3A4289', '#4F58D3', '#F15B74', '#4ECB72', '#9459E4', '#FBB837', '#36CBCB', '#438EFF']
                arr.forEach(element => {
                  arr.push(element)
                })
                return arr[val.dataIndex]
              }
            }
          }
        ]
      }
      this.barChart_3.clear()
      this.barChart_3.setOption(this.optionBar_3)
    }
  }
}
</script>

<style lang='scss' scoped>
.result-bar-chart {
  width: 460px;
  height: 34%;
  background-color: white;
  border-radius: 8px;
  padding: 10px 0 0 10px;
}
.increase {
  width: 460px;
  height: 55%;
  background-color: white;
  border-radius: 8px;
  padding: 10px 0 0 10px;
}
</style>
