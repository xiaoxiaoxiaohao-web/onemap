//各种类型地图

import { Map3DSuperMap } from '../Map3D/SuperMap/Map3DSuperMap'

let Map3D = {
  map3DObject: null, // 三维地图场景对象
  mapType: null, // 三维地图类型，SuperMap,NewBuilder,Cesium
  /**
   * 初始化三维地图数据
   * 作者：吴俊
   * 时间：2019.1.8
   * @param {String} div 承载三维地图的html元素
   * @param {String} maptype 三维地图类型，SuperMap,NewBuilder
   * @returns {Object}三维地图场景对象
   */
  init3DMap: function(div, maptype) {
    Map3D.mapType = maptype // 三维地图类型
    switch (maptype) {
      case 'SuperMap':
        Map3D.map3DObject = Map3DSuperMap.init3DMap(div)
        break
      case 'NewBuilder':
        // Map3D.map3D = Map3DNewBuilderSpace.init3DMap(div);
        break
      case 'Skyline':
        break
      default:
        break
    }
    return Map3D.map3DObject
  },

  /**
   * 初始化三维地图数据
   * 作者：吴俊
   * 时间：2019.1.8
   * @param {Object} map3d 三维地图场景
   * @param {String} dataPath 数据路径，默认打开三维展示的数据
   */
  init3DData: function(map3d, dataPath) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        //Map3DSuperMapSpace.init3DData(map3d, dataPath);
        break
      case 'NewBuilder':
        //Map3DNewBuilderSpace.init3DData(map3d, dataPath);
        break
      default:
        break
    }
  },

  // 以下为三维场景基础操作
  /**
   * 定位到三维场景中的某个位置
   * 作者：吴俊
   * 时间：2019.1.8
   * @param {Object} map3d 三维地图场景
   * @param {Object} locations 位置信息对象
   */
  goToPosition: function(map3d, locations) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.goToPosition(map3d, locations)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  flyToPosition: function(map3d, position) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.flyToPosition(map3d, position)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   * 获取当前三维地图的范围
   * @param {*} map3d
   */
  getLocations: function(map3d, xmove, ymove) {
    if (!Map3D.mapType) {
      return
    }
    var locations = {}
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        locations = Map3DSuperMap.getLocations(map3d, xmove, ymove)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
    return locations
  },

  /**
   * 三维地图指北
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   */
  north: function() {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.north(Map3D.map3DObject)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   * 三维地图中心旋转
   * 作者：吴俊
   * 时间：2019.12.19
   * @param {Object} map3d 三维地图场景
   */
  rotate: function(state) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.rotate(Map3D.map3DObject, state)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   * 三开启人视角，可以通过键盘鼠标，上下左右，抬头低头行走
   * 作者：吴俊
   * 时间：2019.12.20
   * @param {Object} map3d 三维地图场景
   */
  humanView: function(state, deactiveTool) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.humanView(Map3D.map3DObject, state, deactiveTool)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   * 当前三维场景截图
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   */
  snapot: function() {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.snapot(Map3D.map3DObject)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   *
   * @param {object} map3d 三维地图对象
   * @param {bool} state 按钮状态
   */
  disMeasure: function(state) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.disMeasure(Map3D.map3DObject, state)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   *
   * @param {工具激活状态} state
   */
  heightMeasure: function(state) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.heightMeasure(Map3D.map3DObject, state)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   *
   * @param {工具激活状态} state
   */
  areaMeasure: function(state) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.areaMeasure(Map3D.map3DObject, state)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   *
   * @param {工具栏激活状态} state
   */
  identifyQuery: function(state, setFeatureInfo, setSite, emptyWhoShow) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.identifyQuery(
          Map3D.map3DObject,
          state,
          setFeatureInfo,
          setSite,
          emptyWhoShow
        )
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  clear: function(state) {
    if (!Map3D.mapType) {
      return
    }
    let maptype = Map3D.mapType
    switch (maptype) {
      case 'SuperMap':
        Map3DSuperMap.clear(Map3D.map3DObject)

        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },
  /**
   * 开启三维地下模式
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   */
  underGround: function() {},

  // 以下为图层操作
  /**
   * 添加影像图层
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   * @param {String} name 图层名称
   * @param {String} imgUrl 影像图层路径
   */
  addImageLayer: function(map3d, layerName, imageUrl, visibility) {
    let imgLayer = null
    let maptype = window.Map3DConfig.mapType

    switch (maptype) {
      case 'SuperMap':
        imgLayer = Map3DSuperMap.addImageLayer(
          map3d,
          layerName,
          imageUrl,
          visibility
        )
        break
      case 'NewBuilder':
        break
      case 'Cesium':
        break
      default:
        break
    }
    return imgLayer
  },

  /**
   * 添加模型图层
   * 作者：吴俊
   * 时间：2019.12.18
   * @param {Object} map3d 三维地图场景
   * @param {String} name 图层名称
   * @param {String} modelType 倾斜图层还是人工建模数据//超图模型图层都是s3m，不存在模型是人工建模还是倾斜区别
   * @param {String} layerUrl 模型图层路径
   * @returns {Object} layer/promise 返回图层对象/异步则返回promise
   */
  addModelLayer: function(
    map3d,
    name,
    mdoelType,
    layerUrl,
    options,
    queryParameter
  ) {
    let layerObject = null
    let maptype = window.Map3DConfig.mapType

    switch (maptype) {
      case 'SuperMap':
        layerObject = Map3DSuperMap.addModelLayer(
          map3d,
          name,
          mdoelType,
          layerUrl,
          options,
          queryParameter
        )
        break
      case 'NewBuilder':
        break
      default:
        break
    }
    return layerObject
  },

  /**
   * 通过图层名称获取图层
   * 作者：吴俊
   * 时间：2019.12.25
   * @param {Object} map3d 三维地图场景
   * @param {String} name 图层名称
   **/
  getLayer: function(map3d, name, layerType) {
    let layer
    let maptype = window.Map3DConfig.mapType

    switch (maptype) {
      case 'SuperMap':
        //layer = layerSP3D.GetLayerSP3D(map3d, name)
        layer = Map3DSuperMap.getLayer(map3d, name, layerType)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
    return layer
  },

  /**
   * 通过图层名称删除图层
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   * @param {String} name 图层名称
   **/
  removeLayer: function(map3d, name, layerType) {
    let maptype = window.Map3DConfig.mapType

    switch (maptype) {
      case 'SuperMap':
        //layerSP3D.RemoveLayerSP3D(map3d, name);
        break
      case 'NewBuilder':
        break
      default:
        break
    }
  },

  /**
   * 三维图层压平
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} layer 三维图层
   * @param {Array} polgyonGeo 压平范围点集
   * @returns {String} 压平名称
   */
  flatLayer: function(layer, polgyonGeo) {
    let flatLayerName = ''
    let maptype = window.Map3DConfig.mapType

    switch (maptype) {
      case 'SuperMap':
        //flatLayerName = layerSP3D.FlattenLayerSP3D(layer, polgyonGeo)
        break
      case 'NewBuilder':
        break
      default:
        break
    }
    // console.log('三维图层压平', flatLayerName)
    return flatLayerName
  },

  /**
   * 取消三维图层压平
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} layer 三维图层
   * @param {String} flatName 压平名称
   */
  removeFlatLayer: function(layer, flatName) {
    let maptype = window.Map3DConfig.mapType
    let isSuccess = false
    switch (maptype) {
      case 'SuperMap':
        if (layer) {
          isSuccess = layer.removeFlattenRegion(flatName)
        }
        break
      case 'NewBuilder':
        break
      default:
        break
    }
    return isSuccess
  },

  // 以下为三维分析，三维分析一般是调用接口直接分析
  /**
   * 两点通视分析
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   **/
  lineViewAnalysis: function() {},

  /**
   * 视域通视分析
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   **/
  viewShadAnalyisis: function() {},

  /**
   * 基于人视角下的城市天际线分析
   * 作者：吴俊
   * 时间：2019.1.16
   * @param {Object} map3d 三维地图场景
   **/
  skylineAnalysis: function() {}
}

export { Map3D }
