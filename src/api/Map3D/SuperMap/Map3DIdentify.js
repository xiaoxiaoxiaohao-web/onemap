let Map3DIdentify = {
  identifyHandler: null,
  viewer: null,
  setBubbleContent: null, // 气泡内容设置回调方法
  setBubbleSite: null, // 气泡位置设置回调方法
  setBubbleVisible: null, // 气泡显示设置回调方法
  scenePosition: null,
  canvasHeight: 0,
  startIdentify: function(
    map3d,
    _setBubbleContent,
    _setBubbleSite,
    _setBubbleVisible
  ) {
    if (!this.identifyHandler) {
      this.identifyHandler = new Cesium.ScreenSpaceEventHandler(
        map3d.scene.canvas
      )
    }

    this.setBubbleContent = _setBubbleContent
    this.setBubbleSite = _setBubbleSite
    this.setBubbleVisible = _setBubbleVisible
    this.viewer = map3d
    // this.identifyHandler.setInputAction(
    //   this.clickEvent,
    //   Cesium.ScreenSpaceEventType.LEFT_DOWN
    // )
    this.setBubbleVisible('')
    map3d.pickEvent.addEventListener(this.queryEvent)
    map3d.scene.postRender.addEventListener(this._changeInfoWinPos)
  },
  stopIdentify: function(map3d, _setBubbleVisible) {
    // this.identifyHandler.removeInputAction(
    //   this.clickEvent,
    //   Cesium.ScreenSpaceEventType.LEFT_DOWN
    // )

    map3d.pickEvent.removeEventListener(this.queryEvent)
    map3d.scene.postRender.removeEventListener(this._changeInfoWinPos)
    this.setBubbleVisible = _setBubbleVisible
    this.scenePosition = null
    this.setBubbleVisible('')
  },
  clickEvent: function(click) {
    var selLayer = Map3DIdentify.viewer.scene.layers.getSelectedLayer()
    console.log('选中图层名称:' + selLayer.name)
  },
  queryEvent: function(feature) {
    var selLayer = Map3DIdentify.viewer.scene.layers.getSelectedLayer()
    //console.log('选中图层名称1:' + selLayer1.name + feature.SMID)
    var infoObj = {
      name: selLayer.name,
      list: [
        { name: '编号', value: feature.OBJECTID },
        { name: '代码', value: feature.CODE },
        { name: '要素名称', value: feature.YSMC },
        { name: '行政区域', value: feature.XZQY },
        { name: '项目编号', value: feature.XMBH },
        { name: '项目名称', value: feature.XMMC },
        { name: '用地性质', value: feature.YDXZ },
        { name: '用地代码', value: feature.YDDM }
      ]
    }
    var bounbox = feature.geometry.boundingBox
    var centerx = (bounbox.lower.x + bounbox.upper.x) * 0.5
    var centery = (bounbox.lower.y + bounbox.upper.y) * 0.5
    var windowPosition = Map3DIdentify._degreesToScreen(
      Map3DIdentify.viewer,
      centerx,
      centery,
      10
    )
    var right = Map3DIdentify.viewer.scene.canvas.width - windowPosition.x,
      buttom = Map3DIdentify.viewer.scene.canvas.height - windowPosition.y
    Map3DIdentify.setBubbleContent(
      right,
      buttom,
      infoObj,
      false,
      'ObjectProperties3d'
    )
  },
  _degreesToScreen: function(map3d, x, y, z) {
    var ellipsoid = map3d.scene.globe.ellipsoid
    var cartographic = Cesium.Cartographic.fromDegrees(x, y, z)
    var cartesian3 = ellipsoid.cartographicToCartesian(cartographic)
    Map3DIdentify.scenePosition = cartesian3
    //console.log("_degreesToScreen", cartesian3, x, y, z);
    var screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      map3d.scene,
      cartesian3
    )
    //console.log("_degreesToScreen1");
    return screenPosition
  },
  _changeInfoWinPos: function() {
    // 每一帧都去计算气泡的正确位置
    var scene = Map3DIdentify.viewer.scene
    //var scenePosition = Map3DIdentify.scenePosition
    if (Map3DIdentify.scenePosition) {
      var screenPosition = new Cesium.Cartesian2()
      var screenPositionDrawBuffer = new Cesium.Cartesian2()
      Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        scene,
        Map3DIdentify.scenePosition,
        screenPosition
      )
      Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
        scene,
        Map3DIdentify.scenePosition,
        screenPositionDrawBuffer
      )
      if (screenPosition) {
        // scene.canvas.height;
        if (Map3DIdentify.canvasHeight != scene.canvas.height) {
          //console.log(scene.canvas.height, "canvasHeight:", canvasHeight);
          Map3DIdentify.canvasHeight = scene.canvas.height
        }
        // console.log(scene.canvas.width - screenPosition.x,scene.canvas.height - screenPosition.y);
        Map3DIdentify.setBubbleSite(
          scene.canvas.width - screenPosition.x,
          scene.canvas.height - screenPosition.y
        )
      }
    }
  }
}
export { Map3DIdentify }
