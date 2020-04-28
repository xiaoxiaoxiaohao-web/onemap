import HDLTool from '@/api/HDLTool'
const HDLToolMixin = {
  props: {
    drawContorl: {
      type: Boolean
    }
  },
  data() {
    return {
      ifExamine: false,
      landLayer: null, // 当前加载的地类图斑
      lineLayer: null, // 线状地物
      polygonGraphic: null, // 高亮内容
      redLinePolygon: null, // 导入的项目红线数据
      drawGraphic: null, // 手动绘制范围
      buildLand: null // 建筑用地追溯范围
    }
  },
  mounted() {
  },
  methods: {
    // 获取图层服务地址列表
    getLandLineListData() {
      HDLTool.getLandLineListData().then(res => {
        // console.log('获取图层服务地址列表', JSON.stringify(res))
        // 默认修改当前选中年份为最新的年份
        this.$store.commit('onemapApplication/changeMapServerObjData', res[0])
        // 保存内容
        this.$store.commit('onemapApplication/setAllMapServer', res)
        this.addLayerToMap()
      })
    },
    addLayerToMap() {
      console.log('初始化添加地图')
      if (this.landLayer) {
        this.gisInst.map.remove(this.landLayer)
      }
      let layerUrl = window.baseMapBaseUrl + this.$store.state.onemapApplication.mapServerObjData.landurl
      this.landLayer = new this.gisConstructor.FeatureLayer({
        url: layerUrl,
        id: 'HDLLayer'
      })
      this.gisInst.map.add(this.landLayer)
    },
    // 清除地类图斑
    removeLayer() {
      console.log('清除地类图斑图层')
      if (this.landLayer) {
        this.gisInst.map.remove(this.landLayer)
      }
    },
    // 绘图功能
    drawPolygon() {
      console.log('开始绘制')
      let createPolygonGraphic = (vertices) => {
        this.gisInst.view.graphics.removeAll()
        let polygon = {
          type: 'polygon',
          rings: vertices,
          spatialReference: this.gisInst.view.spatialReference
        }

        this.drawGraphic = new this.gisConstructor.Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-fill',
            color: [255, 255, 255, 0],
            style: 'solid',
            outline: {
              color: 'red',
              width: 2
            }
          }
        })
        this.gisInst.view.graphics.add(this.drawGraphic)
      }
      this.gisInst.view.graphics.removeAll()
      const action = this.gisInst.draw.create('polygon')
      this.gisInst.view.focus()
      action.on('vertex-add', function (evt) {
        createPolygonGraphic(evt.vertices)
      })

      action.on('vertex-remove', function (evt) {
        createPolygonGraphic(evt.vertices)
      })

      action.on('cursor-update', function (evt) {
        createPolygonGraphic(evt.vertices)
      })

      action.on('draw-complete', (evt) => {
        document.querySelector('#app').style.cursor = 'default'
        createPolygonGraphic(evt.vertices)
        this.$store.commit('onemapApplication/setCoordinate', JSON.stringify(evt.vertices))
        this.$nextTick(() => {
          this.removeContextmenu()
        })
        console.log(this.$store.state.onemapApplication.coordinate)
      })
      // 右击完成
      // document.querySelector('canvas').addEventListener('contextmenu', () => {
      //   console.log('右键点击事件')
      //   this.gisInst.draw.complete()
      // })
      document.addEventListener('contextmenu', this.contextmenuClick)
    },
    // 右键点击事件
    contextmenuClick() {
      console.log('右键点击事件')
      this.gisInst.draw.complete()
    },
    removeContextmenu() {
      // document.querySelector('canvas').removeEventListener('contextmenu', function () {
      //   console.log('去掉右键点击事件')
      // }, false)
      document.removeEventListener('contextmenu', this.contextmenuClick)
    },
    // 高亮绘制线状地物
    drawPolyline(path) {
      let newPath = path.paths
      let polyline = {
        type: 'polyline',
        paths: newPath,
        spatialReference: this.gisInst.spatialReference
      }

      let lineSymbol = {
        type: 'simple-line',
        color: [255, 215, 0, 1],
        width: 2
      }
      this.gisInst.view.graphics.remove(this.polygonGraphic)
      this.polygonGraphic = new this.gisConstructor.Graphic({
        geometry: polyline,
        symbol: lineSymbol
      })

      this.gisInst.view.graphics.add(this.polygonGraphic)
    },
    // 高亮绘制地类图斑
    drawPartPolygon(rings) {
      // console.log('绘制地类图斑', rings)
      // this.gisInst.view.graphics.remove(1)
      // 1.先清理掉内容,再加载新的数据
      this.gisInst.view.graphics.removeAll()
      this.drawFileGeoList(JSON.parse(this.$store.state.onemapApplication.coordinate))
      let polygon = new this.gisConstructor.Polygon({
        type: 'polygon',
        rings: rings,
        spatialReference: this.gisInst.view.spatialReference
      })

      let lineSymbol = {
        type: 'simple-fill',
        color: [255, 255, 0, 1],
        outline: {
          color: 'black',
          width: 1
        }
      }
      this.gisInst.view.graphics.remove(this.polygonGraphic)
      this.polygonGraphic = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: lineSymbol
      })
      let center = polygon.centroid
      this.pointGraphic = new this.gisConstructor.Graphic({
        geometry: center,
        symbol: {
          type: 'picture-marker',
          url: require('@/views/onemapApplication/OneMap/Aside/images/DW.png'),
          yoffset: '6px'
        }
      })
      this.gisInst.view.graphics.add(this.polygonGraphic)
      this.gisInst.view.graphics.add(this.pointGraphic)
      this.gisInst.view.goTo(this.polygonGraphic)
    },
    // 绘制导入的项目红线数据
    drawFileGeoList(rings) {
      // console.log('绘制导入的项目红线数据', rings)
      this.gisInst.view.graphics.remove(1)
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
      this.gisInst.view.graphics.remove(this.redLinePolygon)
      this.redLinePolygon = new this.gisConstructor.Graphic({
        geometry: polygon,
        symbol: lineSymbol
      })

      this.gisInst.view.graphics.add(this.redLinePolygon)
    },
    // 加载线状地物
    examineLineTypeField() {
      console.log('加载线状地物')
      if (this.$store.state.onemapApplication.mapServerObjData.lineurl !== null) {
        this.gisInst.map.remove(this.lineLayer)
        let layerUrl = window.baseMapBaseUrl + this.$store.state.onemapApplication.mapServerObjData.lineurl
        this.lineLayer = new this.gisConstructor.FeatureLayer({
          url: layerUrl,
          id: 'year'
        })
        this.gisInst.map.add(this.lineLayer)
      }
    },
    // 清除线状地物
    unExamineLineTypeField() {
      console.log('清除线状地物')
      if (this.landLayer) {
        this.gisInst.map.remove(this.landLayer)
      }
    },
    // 点击还原按钮,把地图上的内容清除
    reductionClick() {
      // console.log('点击还原按钮')
      // 1. 绘制时关闭绘制功能--先完成再清除内容
      this.gisInst.draw.reset()
      // 2. 清除地图上的内容
      // this.gisInst.map.remove(this.lineLayer) // 目前不需要清除线状地物
      this.gisInst.view.graphics.removeAll() // 清理高亮选择内容、清理绘制的范围
      // 3. 清除已选范围
      this.$store.commit('onemapApplication/setCoordinate', [])
      // 4. 返回控制表格加载
      this.$emit('tableReduction', false)
    },
    // 单年份核查--更换年份、加载新的地图服务
    changeYearChangeMap(examine) {
      // 1.清理内容
      this.gisInst.map.remove(this.landLayer)
      // 2.加载新的内容
      let layerUrl = window.baseMapBaseUrl + this.$store.state.onemapApplication.mapServerObjData.landurl
      let mapLayer = new this.gisConstructor.FeatureLayer({
        url: layerUrl
      })
      this.gisInst.map.layers.add(mapLayer)
      if (examine) {
        this.examineLineTypeField()
      }
    },
    // 地块追溯--更换年份--绘制追溯的建筑用地
    drawBuildLandPolyline(path) {
      // let newPath = path
      let polyline = {
        type: 'polyline',
        paths: path,
        spatialReference: this.gisInst.spatialReference
      }

      let lineSymbol = {
        type: 'simple-line',
        color: 'red',
        width: 1
      }
      this.gisInst.view.graphics.remove(this.buildLand)
      this.buildLand = new this.gisConstructor.Graphic({
        geometry: polyline,
        symbol: lineSymbol
      })

      this.gisInst.view.graphics.add(this.buildLand)
    },
    removDarwFun() {
      // 1. 绘制时关闭绘制功能--先完成再清除内容
      this.gisInst.draw.reset()
      // 2. 清除地图上的内容
      // this.gisInst.map.remove(this.lineLayer) // 目前不需要清除线状地物
      this.gisInst.view.graphics.removeAll() // 清理高亮选择内容、清理绘制的范围
      // 3. 清除已选范围
      this.$store.commit('onemapApplication/setCoordinate', [])
    }
  },
  computed: {
    getGeometry() {
      return this.$store.state.onemapApplication.geometry
    },
    getGeoList() {
      return this.$store.state.onemapApplication.geoList
    },
    getBuildLand() {
      return this.$store.state.onemapApplication.buildLand
    }
  },
  watch: {
    // 绘制图形操作
    drawContorl(val) {
      if (val) {
        this.$refs.button.click()
        // 修改内容
        this.$emit('drawPolygon', false)
      }
    },
    // 区域高亮--地图展示区域范围
    getGeometry() {
      let list = JSON.parse(this.$store.state.onemapApplication.geometry)
      console.log('区域高亮点击', JSON.stringify(list))
      if (!list.rings) {
        console.log('区域高亮点击2', JSON.stringify(list.paths))
        this.drawPolyline(list)
      } else {
        this.drawPartPolygon(list.rings)
      }
    },
    // 导入数据改变时，绘制出地图范围
    getGeoList(json) {
      // 1.先清理掉内容,再加载新的数据
      this.gisInst.view.graphics.removeAll()
      this.drawFileGeoList(json)
    },
    // 如果是最新的一年的数据，不用绘制内容
    getBuildLand(buildLand) {
      if (buildLand === '') {
        // 如果是第一年,清理地图加载的内容
        this.gisInst.view.graphics.remove(this.buildLand)
      } else {
        let list = JSON.parse(buildLand)
        // let list = this.evil(buildLand)
        // 调用函数，修改内容
        this.drawBuildLandPolyline(list.rings)
      }
      // 修改年份的时候，也要把加载上去的高亮内容清掉
      this.gisInst.view.graphics.remove(this.polygonGraphic)
    }
  }
}
export default HDLToolMixin
