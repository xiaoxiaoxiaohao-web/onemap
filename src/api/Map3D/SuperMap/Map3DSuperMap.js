import { Map3DSnapot } from './Map3DSnapot'
import { Map3DDrawHelper } from './Map3DDrawHelper'
import { Map3DHumanView } from './Map3DHumanView'

let Map3DSuperMap = {
  /**
   * 初始化三维场景
   * 作者：吴俊
   * 时间：2019.12.18
   * @param {String} div 承载三维地图的html元素
   * @returns
   */
  init3DMap: function(div) {
    var singleImage = new Cesium.SingleTileImageryProvider({
      url: require('./world.jpg'),
      rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
    })
    //console.log(singleImage)
    let viewer = new Cesium.Viewer(div, {
      navigation: false,
      baseLayerPicker: false,
      imageryProvider: singleImage,

      animation: false, //动画控制，默认true
      geocoder: false, //村名查找,默认true
      timeline: false, //时间线,默认true
      //terrainShadows: Cesium.ShadowMode.ENABLED,
      // shadows:true,//阴影
      //terrainShadows:Cesium.ShadowMode.ENABLED,
      homeButton: false, //主页按钮，默认true
      fullscreenButton: false, //全屏按钮,默认显示true
      infoBox: false, //点击要素之后显示的信息,默认true
      //requestRenderMode : true,
      maximumRenderTimeChange: 1,
      navigationHelpButton: false, //导航帮助说明,默认true
      navigationInstructionsInitiallyVisible: false,
      scene3DOnly: true,
      sceneModePicker: false,
      selectionIndicator: false
    })

    //设置场景时间
    var date = new Date()
    date.setHours(13)
    viewer.cesiumWidget.clock.currentTime = new Cesium.JulianDate.fromDate(date)
    viewer._cesiumWidget._creditContainer.style.display = 'none'

    //删除第一个影像图层
    //viewer.imageryLayers.removeAll(true);

    return viewer
  },
  /**
   * 初始化三维数据
   * 作者：吴俊
   * 时间：2019.1.8
   * @param {Object} map3d viewer
   * @param {String} dataPath 场景地址
   * @returns
   */
  init3DData: function(map3d, dataPath) {},

  addImageLayer: function(map3d, layerName, imageUrl, visibility) {
    if (imageUrl == '') return
    var layerLength = map3d.imageryLayers.length
    for (var i = 0; i < layerLength; i++) {
      var imgLayer = map3d.imageryLayers.get(i)
      if (imgLayer.name == layerName) {
        return imgLayer
      }
    }
    let layer = map3d.imageryLayers.addImageryProvider(
      new Cesium.SuperMapImageryProvider({
        url: imageUrl,
        name: layerName,
        show: visibility
      }),
      1
    )
    layer.transperantBackColor = Cesium.Color.BLACK
    layer.transperantBackColorTolerance = 0.02 //去除黑边
    return layer
  },
  getLocations: function(map3d, xmove, ymove) {
    //console.log("高程：",height)
    var cartographic = map3d.scene.camera.positionCartographic
    var longitude = Cesium.Math.toDegrees(cartographic.longitude)
    var latitude = Cesium.Math.toDegrees(cartographic.latitude)
    var height = cartographic.height
    // console.log(west, south, east, north);
    var cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)
    //指北
    map3d.scene.camera.setView({
      destination: cartesian3,
      orientation: {
        heading: Cesium.Math.toRadians(0.0), //north
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0.0)
      }
    })

    //获取当前视窗大小、获取左上角和右下角坐标
    var extend = map3d.scene.camera.computeViewRectangle()
    var north = Cesium.Math.toDegrees(extend.north)
    var south = Cesium.Math.toDegrees(extend.south)
    var west = Cesium.Math.toDegrees(extend.west)
    var east = Cesium.Math.toDegrees(extend.east)

    var minx = west
    var miny = south
    var maxx = east
    var maxy = north
    if (xmove) {
      minx = minx - xmove
      maxx = maxx - xmove
    }
    if (ymove) {
      miny = miny - ymove
      maxy = maxy - ymove
    }

    var fullExtent = {
      xmin: minx,
      ymin: miny,
      xmax: maxx,
      ymax: maxy,
      scale: height
    }
    return fullExtent
  },
  goToPosition: function(map3d, locations) {
    // console.log('定位：' + locations.xmin)
    // console.log('定位：' + locations.ymin)
    // console.log('定位：' + locations.xmax)
    // console.log('定位：' + locations.ymax)
    map3d.scene.camera.setView({
      // destination: Cesium.Cartesian3.fromDegrees(
      //   position.x,
      //   position.y,
      //   position.z
      // ),
      // orientation: {
      //   heading: Cesium.Math.toRadians(position.heading),
      //   pitch: Cesium.Math.toRadians(position.pitch),
      //   roll: Cesium.Math.toRadians(position.roll)
      // }
      destination: Cesium.Rectangle.fromDegrees(
        locations.xmin,
        locations.ymin,
        locations.xmax,
        locations.ymax
      ), //(west, south, east, north)
      orientation: {
        heading: Cesium.Math.toRadians(0.0), //north
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0.0)
      }
    })
  },
  flyToPosition: function(map3d, position) {
    map3d.scene.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(
        position.x,
        position.y,
        position.z
      ),
      orientation: {
        heading: window.Cesium.Math.toRadians(position.heading),
        pitch: window.Cesium.Math.toRadians(position.pitch),
        roll: window.Cesium.Math.toRadians(position.roll)
      }
    })
  },
  clear: function(map3d) {
    Map3DDrawHelper.clearDrawDatas(map3d)
  },
  getLayer: function(map3d, layerName, layerType) {
    if (layerType == '101') {
      var layerLength = map3d.imageryLayers.length
      for (var i = 0; i < layerLength; i++) {
        var imgLayer = map3d.imageryLayers.get(i)
        if (!imgLayer.imageryProvider) continue
        if (imgLayer.imageryProvider.name == layerName) {
          return imgLayer
        }
      }
    } else if (layerType == '201' || layerType == '301') {
      var cLayers = map3d.scene.layers
      var s3mTilesLayer = cLayers.find(layerName)
      if (s3mTilesLayer) return s3mTilesLayer
    }
    return null
  },
  removeLayer: function(map3d, layerName, layerType) {},
  addModelLayer: function(
    map3d,
    layerName,
    mdoelType,
    layerUrl,
    options,
    queryParameter
  ) {
    //超图模型图层都是s3m，不存在模型是人工建模还是倾斜区别
    var cLayers = map3d.scene.layers
    var s3mTilesLayer = cLayers.find(layerName)
    if (s3mTilesLayer) return s3mTilesLayer
    var promise
    if (options) {
      promise = map3d.scene.addS3MTilesLayerByScp(layerUrl, {
        name: layerName
      })
      var _this = this
      promise.then(function(layer) {
        //layer.visible = false;
        //layer.selectEnabled = false
        // layer.style3D.fillForeColor.alpha = options.alpha;
        if (options.layerAltitude) {
          //设置高度
          var style3d = _this._createLayerStyle(
            1,
            options.layerAltitude,
            1,
            1,
            1,
            1
          )
          layer.style3D = style3d
        }
        layer.maxVisibleAltitude = options.maxVisibleAltitude
        layer.visibleDistanceMax = options.visibleDistanceMax
        layer.visible = options.visibility
        layer.selectEnabled = options.selected
        if (queryParameter) {
          //查询参数
          layer.setQueryParameter({
            //设置查询参数
            url: queryParameter.url,
            dataSourceName: queryParameter.dataSourceName,
            dataSetName: queryParameter.dataSetName,
            keyWord: 'SMID',
            hasGeometry: true
          })
        }
        layer.refresh()
        return layer
      })
    } else {
      promise = map3d.scene.addS3MTilesLayerByScp(layerUrl, {
        name: layerName
      })
      promise.then(function(layer) {
        // var layerBounds = layer.layerBounds;
        // var x = (layerBounds.east + layerBounds.west) * 0.5;
        // var y = (layerBounds.south + layerBounds.north) * 0.5;
        // console.log("X:" + x + "Y:" + y);
        if (queryParameter) {
          //查询参数
          layer.setQueryParameter({
            //设置查询参数
            url: queryParameter.url,
            dataSourceName: queryParameter.dataSourceName,
            dataSetName: queryParameter.dataSetName,
            keyWord: 'SMID',
            hasGeometry: true
          })
        }
        return layer
      })
    }
  },
  _createLayerStyle: function(altMode, altitude, red, green, blue, alpha) {
    var style3D = new Cesium.Style3D()
    style3D.altitudeMode = altMode
    style3D.bottomAltitude = altitude
    var color = new Cesium.Color(red, green, blue, alpha)
    style3D.fillForeColor = color
    return style3D
  },
  north: function(map3d) {
    let scene = map3d.scene
    let camera = scene.camera

    //相机位置
    let cartographic = camera.positionCartographic
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    let height = cartographic.height
    let cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

    let headingAngle = Cesium.Math.toDegrees(0)

    camera.flyTo({
      destination: cartesian3,
      orientation: {
        heading: Cesium.Math.toRadians(headingAngle),
        pitch: camera.pitch,
        roll: camera.roll
      }
    })
  },
  rotate: function(map3d, state) {
    let scene = map3d.scene
    let camera = scene.camera
    if (!state) {
      camera.stopFlyCircle()
      return
    }
    //相机位置
    let cartographic = camera.positionCartographic
    let longitude = Cesium.Math.toDegrees(cartographic.longitude)
    let latitude = Cesium.Math.toDegrees(cartographic.latitude)
    let height = cartographic.height
    let cartesian3 = Cesium.Cartesian3.fromDegrees(longitude, latitude, height)

    camera.flyCircle(cartesian3)
  },
  humanView: function(map3d, state, deactiveTool) {
    if (state) {
      //开始人视角
      Map3DHumanView.startHumanView(map3d, deactiveTool)
    } else {
      //结束人视角
      Map3DHumanView.stopHumanView(map3d, deactiveTool)
    }
  },
  snapot: function(map3d) {
    Map3DSnapot.exportPic(map3d)
  },
  disMeasure: function(map3d, state) {
    if (state) {
      Map3DDrawHelper.startHorMeasure(map3d)
    } else {
      //Map3DDrawHelper.stopHorMeasure()
    }
  },
  heightMeasure: function(map3d, state) {
    if (state) {
      Map3DDrawHelper.startHeightMeasure(map3d)
    } else {
      //Map3DDrawHelper.stopHeightMeasure(map3d)
    }
  },
  areaMeasure: function(map3d, state) {
    if (state) {
      Map3DDrawHelper.startAreaMeasure(map3d)
    } else {
      // Map3DDrawHelper.stopAreaMeasure(map3d)
    }
  },
  identifyQuery: function(map3d, state, setFeatureInfo, setSite, emptyWhoShow) {
    if (state) {
      Map3DDrawHelper.startIndentify(
        map3d,
        setFeatureInfo,
        setSite,
        emptyWhoShow
      )
    } else {
      Map3DDrawHelper.stopIdentify(map3d, emptyWhoShow)
    }
  }
}
export { Map3DSuperMap }
