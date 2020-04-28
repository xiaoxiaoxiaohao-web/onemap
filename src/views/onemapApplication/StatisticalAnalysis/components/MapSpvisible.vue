<template>
  <div class="map-spvisible">
    <!-- 地图一 -->
    <div class="map-frist" :class="{'half-height':!oneType}">
      <div class="map-div" id="SAMapFrist">
        <div class="titile titile-frist">
          <i class="el-icon-menu"></i>
          <span>{{mapList[0]?mapList[0].title:''}}</span>
        </div>
      </div>
    </div>
    <div class="map-bottom" v-show="!oneType">
      <!-- 地图二 -->
      <div class="map-second" :class="{'half-width':threeType}">
        <div class="map-div" id="SAMapSecond">
          <div class="titile titile-other">
            <i class="el-icon-menu"></i>
            <span>{{mapList[1]?mapList[1].title:''}}</span>
          </div>
        </div>
      </div>
      <!-- 地图三 -->
      <div class="map-third" v-show="threeType">
        <div class="map-div" id="SAMapThird">
          <div class="titile titile-other">
            <i class="el-icon-menu"></i>
            <span>{{mapList[2]?mapList[2].title:''}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import SASubscribeMixin from '../mixin/SASubscribeMixin'
export default {
  name: 'MapSpvisible',
  components: {},
  mixins: [SASubscribeMixin],
  props: {
    mapList: {
      type: Array
    }
  },
  data() {
    return {
      oneType: true,
      threeType: false,
      mapFrist: 0,
      mapSecond: 0,
      mapThird: 0,
      landLayer1: null,
      landLayer2: null,
      landLayer3: null,
      // 地图数据
      gisConstructor: [],
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Extent',
        'esri/layers/support/TileInfo',
        'esri/layers/TileLayer',
        'esri/layers/MapImageLayer',
        'esri/layers/WebTileLayer',
        'esri/widgets/Home',
        'esri/widgets/Compass',
        'esri/widgets/ScaleBar',
        'esri/core/watchUtils',
        'esri/Graphic',
        'esri/layers/FeatureLayer',
        'esri/views/draw/Draw',
        'esri/geometry/SpatialReference',
        'esri/geometry/Point'
      ],
      gisInst: {},
      // 高亮控制参数
      highlightList: []
    }
  },
  created() { },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      loadModules(this.gisModules)
        .then(this.construct)
        .then(this.initMap)
    },
    construct(args) {
      for (let k = 0; k < args.length; k += 1) {
        const name = this.gisModules[k].split('/').pop()
        this.gisConstructor[name] = args[k]
      }
    },
    initMap() {
      const basemap = new this.gisConstructor.TileLayer({
        // url: window.baseMapBaseUrl + '/ZSSJZL/DT/MapServer'
        url: 'http://dev.chinadci.com:38081/arcgis/rest/services/ZSSJZL/QU_DZDT/MapServer'
      })

      const map1 = new this.gisConstructor.Map({
        layers: basemap
      })
      this.gisInst.map1 = map1
      const map2 = new this.gisConstructor.Map({
        layers: basemap
      })
      this.gisInst.map2 = map2
      const map3 = new this.gisConstructor.Map({
        layers: basemap
      })
      this.gisInst.map3 = map3
      // 太大了，设置两个看行不行
      const extent = new this.gisConstructor.Extent({
        xmin: 496798.2276333333,
        ymin: 2485956.426633334,
        xmax: 508566.8942999999,
        ymax: 2491959.2933,
        spatialReference: { wkid: 2381 }
      })
      this.gisInst.extent = extent
      // 地图1
      const view1 = new this.gisConstructor.MapView({
        map: map1,
        extent: extent,
        container: 'SAMapFrist',
        scale: 12000
      })
      this.gisInst.view1 = view1
      // 地图2
      const view2 = new this.gisConstructor.MapView({
        map: map2,
        extent: extent,
        container: 'SAMapSecond',
        scale: 12000
      })
      this.gisInst.view2 = view2
      // 地图3
      const view3 = new this.gisConstructor.MapView({
        map: map3,
        extent: extent,
        container: 'SAMapThird',
        scale: 10000
      })
      this.gisInst.view3 = view3
      // eslint-disable-next-line no-undef
      this.gisConstructor.watchUtils.when(view1, 'animation', function (animation) {
        animation.finish()
        // eslint-disable-next-line no-shadow
        animation.when(function (animation) { })
          // eslint-disable-next-line no-shadow
          .catch(function (animation) { })
      })
      const tileInfo = new this.gisConstructor.TileInfo({
        dpi: 96,
        format: 'image/png',
        spatialReference: { wkid: 2381 },
        size: [256, 256],
        origin: [477765.4786376953, 2519842.0604248047],
        lods: [
          {
            level: 0,
            resolution: 8.466666666666667,
            scale: 30238.095238095237
          },
          {
            level: 1,
            resolution: 4.233333333333333,
            scale: 15119.047619047618
          },
          {
            level: 2,
            resolution: 2.1166666666666667,
            scale: 7559.523809523809
          },
          {
            level: 3,
            resolution: 1.0583333333333333,
            scale: 3779.7619047619046
          },
          {
            level: 4,
            resolution: 0.6614583333333334,
            scale: 2362.3511904761904
          },
          {
            level: 5,
            resolution: 0.26458333333333334,
            scale: 944.9404761904761
          },
          {
            level: 6,
            resolution: 0.13229166666666667,
            scale: 472.4702380952381
          }
        ]
      })
      this.gisInst.tileInfo = tileInfo
    },
    // 修改地图底图
    changeMapLayer(map, layerUrl, view) {
      this.gisInst[map].removeAll()
      const landLayer = new this.gisConstructor.FeatureLayer({
        url: layerUrl
      })
      this.gisInst[map].layers.add(landLayer)
      const rings = JSON.parse(this.$store.state.onemapApplication.coordinate)
      this.getCenterPoint(this.gisInst[view], rings) // 中心点
      this.createGraphic(this.gisInst[view], rings) // 红线
      // 高亮
      const highlightRings = this.$store.state.onemapApplication.SAHighlightRings
      if (highlightRings) {
        // 单行点击
        if (highlightRings.type === 'row') {
          this.onTableRowClick(highlightRings.rings)
        } else {
          // 标题点击
          this.onTableTiltleClick(highlightRings.rings)
        }
      }
      console.log('修改地图操作')
    },
    // 获取中心点,并改变
    getCenterPoint(view, ring) {
      let lng = 0
      let lat = 0
      //多边形最后一项与第一项相同
      for (let i = 0; i < ring.length - 1; i++) {
        lng += ring[i][0]
        lat += ring[i][1]
      }
      let point = [(lng / (ring.length - 1)), (lat / (ring.length - 1))]
      // 改变中心点
      const pt = new this.gisConstructor.Point({
        x: point[0],
        y: point[1],
        // spatialReference: this.gisInst.spatialReference
        spatialReference: { wkid: 2381 }
      })
      view.center = pt
    },
    // 创建绘制内容
    createGraphic(view, paths) {
      // 清理已经绘制的内容
      view.graphics.removeAll()
      paths.push(paths[0])
      const graphic = new this.gisConstructor.Graphic({
        geometry: {
          type: 'polyline',
          paths: paths,
          // spatialReference: this.gisInst.spatialReference
          spatialReference: { wkid: 2381 }
        },
        symbol: {
          type: 'simple-line', // autocasts as new SimpleFillSymbol
          color: 'red',
          width: 2,
          cap: 'round',
          join: 'round'
        }
      })
      view.graphics.add(graphic)
    },
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
      // 1.先清理掉内容,再加载新的数据
      this.gisInst[view].graphics.removeAll()
      this.createGraphic(this.gisInst[view], JSON.parse(this.$store.state.onemapApplication.coordinate))
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
      // this.gisInst[view].graphics.remove(this.polygonGraphic)
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
      this.createGraphic(this.gisInst[view], JSON.parse(this.$store.state.onemapApplication.coordinate))
      // 2.循环绘制
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
    },
    // 绘制导入的项目红线数据
    drawFileGeoList(rings, view) {
      // console.log('绘制导入的项目红线数据', rings)
      // 判断是哪个坐标系,因为有两套坐标系，目前暂时使用这种方式进行判断
      let polygon = {
        type: 'polygon',
        rings: rings,
        spatialReference: this.gisInst.view.spatialReference
      }
      let lineSymbol = {
        type: 'simple-fill',
        color: [0, 0, 0, 0],
        outline: {
          color: 'red',
          width: 2
        }
      }
      this.redLinePolygon = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: lineSymbol
      })

      this.gisInst[view].graphics.add(this.redLinePolygon)
    }
  },
  computed: {},
  watch: {
    mapList: {
      handler(newVal, oldVal) {
        this.highlightList = newVal
        // console.log('选择多屏：' + JSON.stringify(newVal))
        if (newVal.length === 1) {
          this.oneType = true
          this.threeType = false
          this.changeMapLayer('map1', newVal[0].layerUrl, 'view1')
        } else if (newVal.length === 2) {
          this.oneType = false
          this.threeType = false
          this.changeMapLayer('map1', newVal[0].layerUrl, 'view1')
          this.changeMapLayer('map2', newVal[1].layerUrl, 'view2')
        } else if (newVal.length === 3) {
          this.oneType = false
          this.threeType = true
          this.changeMapLayer('map1', newVal[0].layerUrl, 'view1')
          this.changeMapLayer('map2', newVal[1].layerUrl, 'view2')
          this.changeMapLayer('map3', newVal[2].layerUrl, 'view3')
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.map-spvisible {
  width: 100%;
  height: 100%;
  position: relative;
  .map-frist {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .half-height {
    height: 50%;
  }
  .map-bottom {
    height: 50%;
    width: 100%;
    position: relative;
    display: flex;
    .map-second {
      height: calc(100% - 1px);
      width: 100%;
      position: relative;
      border-top: 1px solid #6a82f0;
    }
    .half-width {
      width: 50%;
    }
    .map-third {
      height: calc(100% - 1px);
      width: calc(50% - 1px);
      border-top: 1px solid #6a82f0;
      border-left: 1px solid #6a82f0;
      position: relative;
    }
  }
  .map-div {
    width: 100%;
    height: 100%;
    // background-color: $header-backgroud-color;
    background-color: #25347a;
    position: relative;
    .titile {
      width: 160px;
      height: 34px;
      line-height: 34px;
      border: 1px solid #5d7dec;
      font-size: 14px;
      color: #00effe;
      position: absolute;
      background-color: #19286F;
      i {
        padding-right: 10px;
      }
    }
    .titile-frist {
      top: 15px;
      right: 50px;
    }
    .titile-other {
      top: 20px;
      right: 20px;
    }
  }
}
</style>
