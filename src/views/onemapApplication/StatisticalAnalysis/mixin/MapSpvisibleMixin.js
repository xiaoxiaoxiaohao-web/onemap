const MapSpvisibleMixin = {
  data() {
    return {
      // 高亮控制参数
      highlightList: []
    }
  },
  mounted() {
  },
  methods: {
    // 表格行点击事件
    onTableRowClick(rings) {
      // console.log('表格行点击事件')
      if (this.highlightList.length === 1) {
        this.drawPartPolygon(rings, 'view1')
      } else if (this.highlightList.length === 2) {
        this.drawPartPolygon(rings, 'view1')
        this.drawPartPolygon(rings, 'view2')
      } else if (this.highlightList.length === 3) {
        this.drawPartPolygon(rings, 'view1')
        this.drawPartPolygon(rings, 'view2')
        this.drawPartPolygon(rings, 'view3')
      }
    },
    // 高亮选择内容，单个 // 高亮绘制地类图斑
    drawPartPolygon(rings, view) {
      // console.log('绘制地类图斑', rings)
      // this.gisInst.view.graphics.remove(1)
      // 1.先清理掉内容,再加载新的数据
      this.gisInst[view].graphics.removeAll()
      this.drawFileGeoList(JSON.parse(this.$store.state.onemapApplication.coordinate))
      let polygon = {
        type: 'polygon',
        rings: rings,
        spatialReference: { wkid: 2381 }
      }

      let lineSymbol = {
        type: 'simple-fill',
        color: [255, 255, 0, 1],
        outline: {
          color: 'black',
          width: 1
        }
      }
      this.gisInst[view].graphics.remove(this.polygonGraphic)
      this.polygonGraphic = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: lineSymbol
      })

      this.gisInst[view].graphics.add(this.polygonGraphic)
    },
    // 表格标题点击事件
    onTableTiltleClick(rings) {
      // console.log('表格标题点击事件')
      if (this.highlightList.length === 1) {
        this.getGeoListMultiple(rings, 'view1')
      } else if (this.highlightList.length === 2) {
        this.getGeoListMultiple(rings, 'view1')
        this.getGeoListMultiple(rings, 'view2')
      } else if (this.highlightList.length === 3) {
        this.getGeoListMultiple(rings, 'view1')
        this.getGeoListMultiple(rings, 'view2')
        this.getGeoListMultiple(rings, 'view3')
      }
    },
    // 高亮选择内容，多个 // 导入多rings数据改变时，绘制出地图范围
    getGeoListMultiple(list, view) {
      // 1.先清理掉内容,再加载新的数据
      this.gisInst[view].graphics.removeAll()
      this.drawFileGeoList(JSON.parse(this.$store.state.onemapApplication.coordinate))
      // 2.循环绘制
      // this.drawFileMultipleGeoList(list)
      console.log('绘制')
      for (let i = 0; i < list.length; i++) {
        this.drawFileMultipleGeoList(list[i], view)
      }
    },
    // 绘制导入的rings项目红线数据,多次绘制
    drawFileMultipleGeoList(rings, view) {
      // console.log('绘制导入的项目红线数据', rings)
      let polygon = {
        type: 'polygon',
        rings: rings,
        spatialReference: this.gisInst[view].spatialReference
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
      this.gisInst[view].graphics.add(redLinePolygon)
    }
  },
  computed: {
  },
  watch: {
  }
}
export default MapSpvisibleMixin
