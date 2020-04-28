const SpatialAnalysisMixin = {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    // 导入多rings数据改变时，绘制出地图范围
    getGeoListMultiple(list) {
      // 1.先清理掉内容,再加载新的数据
      this.gisInst.view.graphics.removeAll()
      this.drawFileGeoList(JSON.parse(this.$store.state.onemapApplication.coordinate))
      // 2.循环绘制
      // this.drawFileMultipleGeoList(list)
      console.log('绘制')
      for (let i = 0; i < list.length; i++) {
        this.drawFileMultipleGeoList(list[i])
      }
    },
    // 绘制导入的rings项目红线数据,多次绘制
    drawFileMultipleGeoList(rings) {
      // console.log('绘制导入的项目红线数据', rings)
      let polygon = {
        type: 'polygon',
        rings: rings,
        spatialReference: this.gisInst.view.spatialReference
      }

      let lineSymbol = {
        type: 'simple-fill',
        color: [255, 255, 0, 1],
        outline: {
          color: 'black',
          width: 1
        }
      }
      let redLinePolygon = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: lineSymbol
      })
      this.gisInst.view.graphics.add(redLinePolygon)
    }
  },
  computed: {
  },
  watch: {
  }
}
export default SpatialAnalysisMixin
