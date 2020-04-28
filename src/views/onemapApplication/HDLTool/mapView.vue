<!--
 * @Description:  map for exporting
 * @Author: bingyin wei
 * @Date: 2019-08-30
 -->
<template>
  <div class="map-content">
    <div ref="exportMapRef" class="map" id="exportArcgisId">
    </div>
    <!-- 导出的图片 -->
    <div ref="exportImg" class="export-class"></div>
    <!-- 指北针 -->
    <div class="compass-class"></div>
    <!-- 图例 -->
    <div class="legend-class"></div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
export default {
  data() {
    return {
      gisConstructor: [],
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/Basemap',
        'esri/layers/MapImageLayer',
        'esri/widgets/Print',
        'esri/widgets/Compass',
        'esri/geometry/Polygon',
        'esri/geometry/SpatialReference',
        'esri/Graphic',
        'esri/tasks/support/PrintTemplate',
        'esri/tasks/PrintTask',
        'esri/tasks/support/PrintParameters',
        'esri/layers/GraphicsLayer',
        'esri/Ground',
        'esri/geometry/Point'
      ],
      gisInst: {}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log('加载地图')
      loadModules(this.gisModules)
        .then(this.construct)
        .then(this.initMap)
    },
    construct(args) {
      for (const k in args) {
        const name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
    },
    initMap() {
      // 添加规则，解析地方坐标系
      const ZSspatialReference = new this.gisConstructor.SpatialReference({
        wkt:
          'PROJCS["ZS",GEOGCS["zsGeo",DATUM["",SPHEROID["",6378317.0,298.2999999999968]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",113.3666666666667],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]],VERTCS["Yellow_Sea_1985",VDATUM["Yellow_Sea_1985"],PARAMETER["Vertical_Shift",0.0],PARAMETER["Direction",1.0],UNIT["Meter",1.0]]'
      })
      this.gisInst.spatialReference = ZSspatialReference
      // 获取地图中心点
      let rings = []
      if (this.$store.state.onemapApplication.coordinate.length) {
        rings = JSON.parse(this.$store.state.onemapApplication.coordinate)
        // 首项末项相同
        rings.push(rings[0])
      }
      let centrPoint = this.getCenterPoint(rings)
      console.log('中心点的位置：', centrPoint)
      const layerUrl = window.baseMapBaseUrl + '/ZS/DLTB/MapServer/'
      const ZSKG = new this.gisConstructor.MapImageLayer({
        url: layerUrl,
        spatialReference: this.gisInst.spatialReference
      })
      const customBasemap = new this.gisConstructor.Basemap({
        baseLayers: [ZSKG],
        title: 'Custom Basemap',
        id: 'myBasemap'
      })

      // 地图部分
      const map = new this.gisConstructor.Map({
        basemap: customBasemap
      })
      // const map = new this.gisConstructor.Map({
      //   layers: [ZSKG, layer]
      //   // basemap: 'osm'
      // })
      this.gisInst.map = map
      // 设置view展示地图
      const view = new this.gisConstructor.MapView({
        container: 'exportArcgisId',
        map: map,
        scale: 5000
      })
      this.gisInst.view = view
      // 改变中心点
      const pt = new this.gisConstructor.Point({
        x: centrPoint[0],
        y: centrPoint[1],
        spatialReference: this.gisInst.spatialReference
      })
      view.center = pt
      this.createGraphic(rings)
    },
    // 获取中心点
    getCenterPoint(ring) {
      let lng = 0
      let lat = 0
      //多边形最后一项与第一项相同
      for (let i = 0; i < ring.length - 1; i++) {
        lng += ring[i][0]
        lat += ring[i][1]
      }
      let point = [(lng / (ring.length - 1)), (lat / (ring.length - 1))]
      return point
    },
    // 打印地图
    exportMap(callback) {
      // 打印地图
      let width = this.$refs.exportMapRef.offsetWidth
      let height = this.$refs.exportMapRef.offsetHeight
      // 参数设置
      let area = {
        x: 0,
        y: 0,
        width: width,
        height: height
      }
      const _this = this
      // set the position of the div element that marks the selected area
      // 截图方式
      this.gisInst.view.takeScreenshot({ area: area, format: 'png' })
        .then(function (screenshot) {
          // display a preview of the image
          _this.showPreview(screenshot, callback, _this)
        })
    },
    showPreview(screenshot, callback, _this) {
      // add the screenshot dataUrl as the src of an image element
      const screenshotImage = _this.$refs.exportImg
      screenshotImage.width = screenshot.data.width
      screenshotImage.height = screenshot.data.height
      screenshotImage.style.backgroundImage = 'url(' + screenshot.dataUrl + ')'
      callback()
    },
    // 创建绘制内容
    createGraphic(paths) {
      // 清理已经绘制的内容
      this.gisInst.view.graphics.removeAll()
      const graphic = new this.gisConstructor.Graphic({
        geometry: {
          type: 'polyline',
          paths: paths,
          spatialReference: this.gisInst.spatialReference
        },
        symbol: {
          type: 'simple-line', // autocasts as new SimpleFillSymbol
          color: 'red',
          width: 2,
          cap: 'round',
          join: 'round'
        }
      })
      this.gisInst.view.graphics.add(graphic)
    }
  }
}
</script>

<style scoped>
.map-content {
  width: 100%;
  height: 100%;
  position: relative;
}
.map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
/* 导出图片 */
.export-class {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9;
  top: 0;
  left: 0;
  background-size: cover;
}
/* 图例 */
.legend-class {
  width: 163px;
  height: 240px;
  position: absolute;
  z-index: 10;
  right: 0;
  bottom: 0;
  background-image: url('./images/lengend.jpg');
  background-size: cover;
}
/* 指北针 */
.compass-class {
  width: 51px;
  height: 69px;
  position: absolute;
  z-index: 10;
  right: 0;
  top: 0;
  background-image: url('./images/compass.jpg');
  background-size: cover;
}
</style>
