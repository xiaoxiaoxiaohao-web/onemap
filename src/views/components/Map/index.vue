<template>
  <div class="map-view">
    <!-- <map2d id="arcgisMap2d" ref="Map2D" v-show="!is3D" />
    <map3d id="arcgisMap3d" ref="Map3D" v-show="is3D" /> -->
    <keep-alive>
      <component :is="mapCom" ref="curMapIns" :id="is3D?'arcgisMap3d':'arcgisMap2d'" />
    </keep-alive>
    <div class="mapType">
      <div
        v-for="(item, index) in mapList"
        :key="index"
        @click="changeBasemap(item.value, item)"
        :class="item.calss"
      ></div>
    </div>
    <div class="extra-div-left">
      <slot name="mapSlotLeft"></slot>
    </div>
    <div class="extra-div-right">
      <slot name="mapSlotRight"></slot>
    </div>
    <iframe id="print-iframe" class="iframe-class"></iframe>
  </div>
</template>
<script>
import { loadModules } from 'esri-loader'
import map2d from './Map2d'
import map3d from '../Map3D/Map3D'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
export default {
  name: 'MapView',
  mixins: [executeMixin],
  components: {
    map2d,
    map3d
  },
  created() {},
  data() {
    return {
      mapList: [
        // {
        //   name: '影像地图',
        //   calss: 'mapType-image',
        //   value: 'yxMap'
        // },
        {
          name: '3D地图',
          calss: 'mapType-3d',
          value: '3dMap'
        },
        {
          name: '电子地图',
          calss: 'mapType-normal',
          value: 'dzdtMap'
        }
      ]
      // is3d: false
    }
  },
  mounted() {},
  methods: {
    changeBasemap(value, item) {
      if (value === this.mapTypeVal) {
        return
      }
      if (value === '3dMap') {
        //保存二维坐标
        let location2d = this.$refs.curMapIns.coordinateTransfromTo4326()
        // console.log(
        //   '2DLocation:' +
        //     location2d.xmin +
        //     ',' +
        //     location2d.ymin +
        //     ',' +
        //     location2d.xmax +
        //     ',' +
        //     location2d.ymax +
        //     ',' +
        //     location2d.scale
        // )
        this.$store.commit('onemapApplication/setLocations', location2d)
      } else {
        //如果当前是三维地图
        //保存三维坐标
        //调用Map3D组件的方法
        var locations3d = this.$refs.curMapIns.getLocations3D()
        // console.log(
        //   '3DLocation:' +
        //     locations3d.xmin +
        //     ',' +
        //     locations3d.ymin +
        //     ',' +
        //     locations3d.xmax +
        //     ',' +
        //     locations3d.ymax +
        //     ',' +
        //     locations3d.scale
        // )
        this.$store.commit('onemapApplication/setLocations', locations3d)
      }
      this.$store.commit('onemapApplication/setMapTypeVal', value)
    }
  },
  computed: {
    is3D() {
      return this.$store.getters['onemapApplication/is3D']
    },
    mapCom() {
      return this.is3D ? 'map3d' : 'map2d'
    },
    mapTypeVal() {
      return this.$store.state.onemapApplication.mapTypeVal
    }
  },
  watch: {}
}
</script>

<style lang="scss" scope>
.map-view {
  #arcgisMap2d {
    // background-color: $header-backgroud-color;
    background-color: white;
  }
  #arcgisMap3d {
    background-color: $header-backgroud-color;
  }
  .extra-div-left {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
  }
  .extra-div-right {
    position: absolute;
    top: 0;
    right: 0;
    text-align: center;
  }
  .iframe-class {
    display: none;
  }
  .mapType {
    height: 60px;
    width: 72px;
    position: absolute;
    bottom: 8px;
    right: 10px;
    z-index: 20;
    div {
      position: absolute;
      bottom: 0;
      width: 72px;
      height: 100%;
      border: 1px solid rgba(125, 125, 125, 1);
      border-radius: 4px;
    }
    .mapType-image {
      width: 72px;
      height: 60px;
      right: 8px;
      background: url('./images/yxt-1.png') no-repeat 0% 0%;
      background-size: 100% 100%;
      // z-index: 5;
      &:hover {
        background: url('./images/yxt-2.png') no-repeat 0% 0%;
        background-size: 100% 100%;
      }
    }
    .mapType-3d {
      position: absolute;
      right: 4px;
      background: url('./images/3D-1.png') no-repeat 0% 0%;
      background-size: 100% 100%;
      // z-index: 10;
      &:hover {
        background: url('./images/3D-2.png') no-repeat 0% 0%;
        background-size: 100% 100%;
      }
    }
    .mapType-normal {
      position: absolute;
      right: 0;
      background: url('./images/dt-1.png') no-repeat 0% 0%;
      background-size: 100% 100%;
      // z-index: 20;
      &:hover {
        background: url('./images/dt-2.png') no-repeat 0% 0%;
        background-size: 100% 100%;
      }
    }
    &:hover {
      width: 200px;
      .mapType-image {
        right: 156px;
      }
      .mapType-3d {
        right: 78px;
      }
    }
  }
}
</style>
