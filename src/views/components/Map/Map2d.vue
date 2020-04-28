<template>
  <div class="arcgisMap2d">
    <div id="arcgisMap"></div>
    <toolbar class="toolbar-class" />
    <div class="cooridnate" title="坐标">{{ coordinates }}</div>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import Toolbar from './Toolbar'
import onemapMixin from '@/views/onemapApplication/OneMap/mixin/onemapMixin'
import toolbarMixin from './mixin/toolbarMixin'
import HDLToolMixin from '@/views/onemapApplication/HDLTool/mixin/HDLToolMixin'
import subscribeMixin from '@/views/components/Map/mixin/subscribeMixin'
import SpatialAnalysisMixin from '@/views/onemapApplication/SpatialAnalysis/mixin/SpatialAnalysis'
import suitabilityMinxin from '@/views/territorialPlanEvaluate/Suitability/mixin/suitabilityMinxin'
import Proj4 from 'proj4'
export default {
  name: 'MapView',
  mixins: [
    onemapMixin,
    HDLToolMixin,
    subscribeMixin,
    SpatialAnalysisMixin,
    suitabilityMinxin,
    toolbarMixin
  ],
  components: {
    Toolbar
  },
  created() { },
  data() {
    return {
      gisConstructor: [],
      gisModules: [
        'esri/Map',
        'esri/views/MapView',
        'esri/geometry/Extent',
        'esri/geometry/Point',
        'esri/geometry/Polygon',
        'esri/geometry/Polyline',
        'esri/geometry/geometryEngine',
        'esri/layers/support/TileInfo',
        'esri/layers/TileLayer',
        'esri/layers/GeoJSONLayer',
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
        'esri/tasks/support/Query',
        'esri/tasks/QueryTask',
        'esri/tasks/IdentifyTask',
        'esri/tasks/support/IdentifyParameters'
      ],
      gisInst: {},
      layers: [],
      isHeaderCard: true, // 右侧是否有题头卡
      coordinates: ''
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (this.gisInst.view && Object.keys(this.locations).length > 0) {
      this.coordinateTransfromTo2381(this.locations)
    }
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
        url: window.baseMapBaseUrl
      })
      this.gisInst.basemap = basemap
      //地方坐标
      const XiAnspatialReference = new this.gisConstructor.SpatialReference({
        wkt:
          'PROJCS["Xian 1980 / 3-degree Gauss-Kruger CM 108E",GEOGCS["Xian 1980",DATUM["Xian_1980",SPHEROID["IAG 1975",6378140,298.257,AUTHORITY["EPSG","7049"]],AUTHORITY["EPSG","6610"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4610"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",108],PARAMETER["scale_factor",1],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","2381"]]'
      })
      this.gisInst.spatialReference = XiAnspatialReference
      const map = new this.gisConstructor.Map({
        layers: basemap
      })
      this.gisInst.map = map
      const extent = new this.gisConstructor.Extent({
        xmin: -163899.07166666666,
        ymin: -78909.13716666665,
        xmax: 143864.26166666666,
        ymax: 86190.86283333335,
        spatialReference: {
          wkid: 2381
        }
      })
      const digitalMapExtent = new this.gisConstructor.Extent({
        xmin: -106780.605,
        ymin: -53453.987,
        xmax: 93095.795,
        ymax: 62429.04600000195,
        spatialReference: {
          wkid: 2381
        }
      })
      this.gisInst.extent = extent
      // const lods = [
      //   { level: 0, resolution: 211.66666666666666, scale: 755952.3809523808 },
      //   { level: 1, resolution: 105.83333333333333, scale: 377976.1904761904 },
      //   { level: 2, resolution: 52.916666666666664, scale: 188988.0952380952 },
      //   { level: 3, resolution: 26.458333333333332, scale: 94494.0476190476 },
      //   { level: 4, resolution: 13.229166666666666, scale: 47247.0238095238 },
      //   { level: 5, resolution: 5.291666666666667, scale: 18898.809523809523 },
      //   { level: 6, resolution: 2.6458333333333335, scale: 9449.404761904761 },
      //   { level: 7, resolution: 1.3229166666666667, scale: 4724.702380952381 },
      //   { level: 8, resolution: 0.5291666666666667, scale: 1889.8809523809523 },
      //   { level: 9, resolution: 0.26458333333333334, scale: 944.9404761904761 }
      // ]
      const lods = [
        { level: 0, resolution: 211.66666666666666, scale: 800000 },
        { level: 1, resolution: 105.83333333333333, scale: 400000 },
        { level: 2, resolution: 52.916666666666664, scale: 200000 },
        { level: 3, resolution: 26.458333333333332, scale: 100000 },
        { level: 4, resolution: 13.229166666666666, scale: 50000 },
        { level: 5, resolution: 5.291666666666667, scale: 20000 },
        { level: 6, resolution: 2.6458333333333335, scale: 10000 },
        { level: 7, resolution: 1.3229166666666667, scale: 5000 },
        { level: 8, resolution: 0.5291666666666667, scale: 2000 }
      ]
      const view = new this.gisConstructor.MapView({
        map: map,
        constraints: {
          lods: lods
        },
        extent: digitalMapExtent,
        scale: 377976.1904761904,
        // spatialReference: { wkid: 2381 },
        container: 'arcgisMap'
      })
      this.gisInst.view = view
      // remove 'power by esri'
      view.ui._removeComponents(['attribution'])

      // eslint-disable-next-line no-undef
      this.gisConstructor.watchUtils.when(view, 'animation', function (
        animation
      ) {
        animation.finish()
        // eslint-disable-next-line no-shadow
        animation
          // eslint-disable-next-line no-shadow
          .when(function (animation) { })
          // eslint-disable-next-line no-shadow
          .catch(function (animation) { })
      })
      let draw = new this.gisConstructor.Draw({
        view: view
      })
      this.gisInst.draw = draw
      // configurate tileinfo
      const tileInfo = new this.gisConstructor.TileInfo({
        dpi: 96,
        format: 'image/png',
        spatialReference: { wkid: 2381 },
        size: [256, 256],
        origin: [-106780.605, 62429.046],
        lods: lods
      })
      this.gisInst.tileInfo = tileInfo
      // add widgets
      const compass = new this.gisConstructor.Compass({
        view: view
      })
      view.ui.add(compass, 'top-right')

      const home = new this.gisConstructor.Home({
        view: view
      })
      view.ui.add(home, 'top-left')

      const scaleBar = new this.gisConstructor.ScaleBar({
        unit: 'metric',
        view: view
      })
      view.ui.add(scaleBar, 'bottom-left')

      this.changeMapStyle(this.$store.state.global.routerPath)
      //鼠标移动事件
      this.gisInst.view.on('pointer-move', evt => {
        this.showCoordinates(this.gisInst.view.toMap({ x: evt.x, y: evt.y }))
      })

      // 地图已加载完成
      this.$store.commit('onemapApplication/setInitMapDone', true)
      // 加载完地图后执行的回调函数
      this.initMapCallBackArr.map(event => event())
    },
    changeMapStyle(val) {
      this.isHeaderCard = false
      if (val === '/onemapApplication/HDLTool') {
        this.getLandLineListData(this.excuteMapMethod)
      } else if (val === '/onemapApplication/SpatialAnalysis') {
        this.isHeaderCard = true
        // 清空地图
        this.removeLayer()
        this.unExamineLineTypeField()
        if (this.landLayer) {
          this.reductionClick()
        }
      } else {
        // 清空地图
        this.isHeaderCard = true
        this.removeLayer()
        this.unExamineLineTypeField()
        if (this.landLayer) {
          this.reductionClick()
        }
      }
    },
    showCoordinates(pt) {
      this.coordinates =
        'X:\xa0' + pt.x.toFixed(3) + '\xa0\xa0\xa0Y:\xa0' + pt.y.toFixed(3)
    },
    coordinateTransfromTo4326() {
      let firstProj =
        'PROJCS["Xian 1980 / 3-degree Gauss-Kruger CM 108E",GEOGCS["Xian 1980",DATUM["Xian_1980",SPHEROID["IAG 1975",6378140,298.257,AUTHORITY["EPSG","7049"]],AUTHORITY["EPSG","6610"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4610"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",108],PARAMETER["scale_factor",1],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","2381"]]'
      let secondProj =
        'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]'
      let min = Proj4(firstProj, secondProj, [
        this.gisInst.view.extent.xmin,
        this.gisInst.view.extent.ymin
      ])
      let max = Proj4(firstProj, secondProj, [
        this.gisInst.view.extent.xmax,
        this.gisInst.view.extent.ymax
      ])
      let location2d = {
        xmin: min[0],
        ymin: min[1],
        xmax: max[0],
        ymax: max[1],
        scale: this.gisInst.view.scale
      }
      return location2d
    },
    coordinateTransfromTo2381(location3d) {
      let secondProj =
        'PROJCS["Xian 1980 / 3-degree Gauss-Kruger CM 108E",GEOGCS["Xian 1980",DATUM["Xian_1980",SPHEROID["IAG 1975",6378140,298.257,AUTHORITY["EPSG","7049"]],AUTHORITY["EPSG","6610"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4610"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",108],PARAMETER["scale_factor",1],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AUTHORITY["EPSG","2381"]]'
      let firstProj =
        'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]'
      let min = Proj4(firstProj, secondProj, [location3d.xmin, location3d.ymin])
      let max = Proj4(firstProj, secondProj, [location3d.xmax, location3d.ymax])
      this.gisInst.view.extent.xmin = min[0]
      this.gisInst.view.extent.ymin = min[1]
      this.gisInst.view.extent.xmax = max[0]
      this.gisInst.view.extent.ymax = max[1]
      this.gisInst.view.scale = location3d.scale * 3
    }
  },
  computed: {
    getMapStyle() {
      return this.$store.state.global.routerPath
    },
    locations() {
      return this.$store.state.onemapApplication.locations
    },
    initMapCallBackArr() {
      return this.$store.state.onemapApplication.initMapCallBackArr
    }
  },
  watch: {
    // 样式修改
    getMapStyle(val) {
      this.changeMapStyle(val)
    }
  }
}
</script>

<style lang="scss" scope>
.arcgisMap2d {
  height: 100%;
  width: 100%;
  #arcgisMap {
    height: 100%;
    width: 100%;
  }
  .toolbar-class {
    position: absolute;
    right: 20px;
    top: 170px;
    text-align: center;
    z-index: 20;
  }
  .cooridnate {
    position: absolute;
    left: 250px;
    bottom: 30px;
    font-size: 16px;
    z-index: 20;
    text-shadow: 0px 3px 4px rgba(0, 0, 0, 1);
    // -webkit-text-stroke: 1px white;
    color: black;
  }
}
</style>
