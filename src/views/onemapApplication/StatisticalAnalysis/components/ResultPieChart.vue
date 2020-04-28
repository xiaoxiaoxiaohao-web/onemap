<template>
  <div class="result-pie-chart" ref="chart">
  </div>
</template>

<script>
export default {
  name: 'ResultPieChart',
  props: ['pieData'],
  data() {
    this.pieChart = null
    return {
      optionBar_1: {}
    }
  },
  computed: {
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    }
  },
  watch: {
    htmlFontSize() {
      if (this.pieChart) {
        this.pieChart.resize()
      }
    },
    pieData: {
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
        if (this.optionBar_1) {
          this.getChartData()
        }
      })
    },
    getChartData() {
      this.pieChart = this.$echarts.init(this.$refs.chart)
      this.optionBar_1 = {
        title: {
          text: this.pieData.text,
          left: 'left',
          textStyle: {
            fontSize: 14,
            color: '#293C98',
            fontWeight: '100'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical ',
          x: '180',
          y: 'center',
          align: 'left',
          data: this.pieData.legendData,
          itemWidth: 14,
          itemHeight: 10
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['20%', '50%'],
            avoidLabelOverlap: false,
            color: this.pieData.seriesColor,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData.seriesData
          }
        ]
      }
      this.pieChart.clear()
      this.pieChart.setOption(this.optionBar_1)
    }
  },
  mounted() {
  }
}
</script>

<style lang='scss' scoped>
.result-pie-chart {
  width: 460px;
  height: 30%;
  background-color: white;
  border-radius: 8px;
  padding: 10px 0 0 10px;
}
</style>
