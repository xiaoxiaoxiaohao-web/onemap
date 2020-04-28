<template>
  <div id="map3dContainer">
    <object-properties3d
      :obj="Obj1"
      v-show="getShowHow == 'ObjectProperties3d'"
      :bottom="labelButtom"
      :right="labelRight"
      @showHow="showHow"
      :hasBtn="hasBtn"
    />
    <Map3DToolbar @identifyQuery="identifyQuery"></Map3DToolbar>
    <div id="map3d"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Map3D } from '../../../api/Map3D/Map3D'
import Map3DToolbar from './Map3DToolbar'
import ObjectProperties3d from './ObjectProperties3d'
export default {
  name: 'Map3DInfo',
  data() {
    return {
      // msg: "这是一个三维地图"
      labelButtom: 300,
      labelRight: 300,
      Obj1: {},
      getShowHow: '',
      //routername: '2d',
      hasBtn: false //,
      //xmove: 5.32853314603275,
      // ymove: 34.1806802927795
    }
  },
  components: {
    //工具栏组件
    Map3DToolbar,
    ObjectProperties3d
    //图层树组件
  },
  created() {
    // this.$bus.on('to3d', (v, s) => {
    //   console.log('toolName:' + v)
    // })
  },
  mounted() {
    this.$nextTick(() => {
      //初始化三维地图
      //console.log('maptype:' + window.Map3DConfig.mapType)
      Map3D.init3DMap('map3d', window.Map3DConfig.mapType)
      if (Map3D.map3DObject) {
        //加载影像

        //定位

        var defaultPosition = window.Map3DConfig.defaultPosition
        Map3D.flyToPosition(Map3D.map3DObject, defaultPosition)
        //
        // var locations = this.$store.state.onemapApplication.locations
        // // console.log('需要重定位' + locations)
        // if (locations && locations.xmin) {
        //   //console.log('需要重定位222')
        //   // var lx = (locations.xmin + locations.xmax) * 0.5
        //   // var ly = (locations.ymin + locations.ymax) * 0.5
        //   // lx = lx + this.xmove
        //   // ly = ly + this.ymove

        //   // var position = {
        //   //   x: lx,
        //   //   y: ly,
        //   //   z: locations.scale,
        //   //   heading: 0,
        //   //   pitch: -60,
        //   //   roll: 0
        //   // }
        //   var xmove = 5.32853314603275
        //   var ymove = 34.1806802927795
        //   locations.xmin = locations.xmin + xmove
        //   locations.ymin = locations.ymin + ymove
        //   locations.xmax = locations.xmax + xmove
        //   locations.ymax = locations.ymax + ymove
        //   Map3D.goToPosition(Map3D.map3DObject, locations)
        // } else {
        //   Map3D.flyToPosition(Map3D.map3DObject, defaultPosition)
        // }

        var themeList = window.Map3DConfig.mapTheme3D
        //console.log('thiemeList;' + themeList)
        for (var i = 0; i < themeList.length; i++) {
          var themeConfig = themeList[i]
          var dataList = themeConfig.children
          for (var j = 0; j < dataList.length; j++) {
            var layerConfig = dataList[j]
            var layerName = layerConfig.layerName
            var layerUrl = layerConfig.dataUrl
            var layerType = layerConfig.layerType
            if (layerType === '101') {
              Map3D.addImageLayer(
                Map3D.map3DObject,
                layerName,
                layerUrl,
                layerConfig.visibility
              )
            } else if (layerType === '201' || layerType === '301') {
              var options = layerConfig.options
              if (options.visibility) {
                Map3D.addModelLayer(
                  Map3D.map3DObject,
                  layerName,
                  'model',
                  layerUrl,
                  options,
                  layerConfig.queryParameter
                )
              }
            }
          }
        }
      }
    })
  },
  // 每次激活此组件时执行
  activated() {
    this.$nextTick(() => {
      var locations = this.mapLocation
      if (locations && locations.xmin) {
        var xmove = 5.32853314603275
        var ymove = 34.1806802927795
        locations.xmin = locations.xmin + xmove
        locations.ymin = locations.ymin + ymove
        locations.xmax = locations.xmax + xmove
        locations.ymax = locations.ymax + ymove
        Map3D.goToPosition(Map3D.map3DObject, locations)
      }
    })
  },
  methods: {
    //需要与界面交互的内容，通过父组件来调用
    identifyQuery(state) {
      //console.log('startquery父组件')
      //var locations = this.$store.state['onemapApplication/locations']
      //console.log('需要重定位' + locations)
      Map3D.identifyQuery(
        state,
        this.setFeatureInfo,
        this.setSite,
        this.emptyWhoShow
      )
    },

    //=========================================
    // // 倾斜查询窗体位置调整
    setSite(l, t) {
      //console.log('l:' + l + ';t:' + t)
      this.labelRight = l
      this.labelButtom = t
    },
    // 倾斜查询结果窗体显示控制
    emptyWhoShow(tableName) {
      this.getShowHow = tableName
      //console.log('窗体：' + tableName)
    },
    // 倾斜查询结果窗体内容设置
    setFeatureInfo(l, t, cFeatureInfo, _hasBtn, tabelName) {
      this.labelRight = l
      this.labelButtom = t
      // this.labelRight = '500'
      // this.labelButtom = '500'
      this.hasBtn = _hasBtn
      if (tabelName === 'ObjectProperties3d') {
        this.getShowHow = 'ObjectProperties3d'
        this.Obj1 = cFeatureInfo
        this.emptyWhoShow(tabelName)
      }
    },
    showHow(isShow) {
      if (!isShow) {
        this.getShowHow = ''
      }
    },
    //====点击查询==========
    getLocations3D: function() {
      //获取当前三维位置信息
      var xmove = 5.32853314603275
      var ymove = 34.1806802927795
      //手动偏移参数
      var locations
      if (Map3D.map3DObject) {
        locations = Map3D.getLocations(Map3D.map3DObject, xmove, ymove)
      }
      return locations
      //console.log('获取当前三维位置信息')
    }
  },
  computed: {
    mapLocation() {
      return this.$store.state.onemapApplication.locations
    }
  },
  watch: {
    // mapLocation(newvalue, oldvalue) {
    //   console.log('store location变了')//监听变化
    //   var locations = newvalue
    //   if (locations && locations.xmin) {
    //     var xmove = 5.32853314603275
    //     var ymove = 34.1806802927795
    //     locations.xmin = locations.xmin + xmove
    //     locations.ymin = locations.ymin + ymove
    //     locations.xmax = locations.xmax + xmove
    //     locations.ymax = locations.ymax + ymove
    //     Map3D.goToPosition(Map3D.map3DObject, locations)
    //   }
    // }
  }
}
</script>

<style scoped>
#map3dContainer {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#map3d {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  overflow: hidden;
}
</style>
