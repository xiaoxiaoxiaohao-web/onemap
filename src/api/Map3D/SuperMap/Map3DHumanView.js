let Map3DHumanView = {
  handlerPoint: null,
  map3DObject: null,
  humanViewDeactive: null,
  flags: {
    looking: false,
    moveForward: false, //向前
    moveBackward: false, //向后
    moveUp: false, //向上
    moveDown: false, //向下
    moveLeft: false, //向左
    moveRight: false, //向右
    lookDown: false, //摄像机低头
    lookUp: false, //摄像机抬头
    lookRight: false, //摄像机右转
    lookLeft: false //摄像机左转
  },
  _getFlagForKeyCode: function(keyCode) {
    switch (keyCode) {
      case 'W'.charCodeAt(0):
        return 'moveForward'
      case 'S'.charCodeAt(0):
        return 'moveBackward'
      case 'Q'.charCodeAt(0):
        return 'moveUp'
      case 'E'.charCodeAt(0):
        return 'moveDown'
      case 'D'.charCodeAt(0):
        return 'moveRight'
      case 'A'.charCodeAt(0):
        return 'moveLeft'
      case 38:
        return 'lookUp' //抬头
      case 40:
        return 'lookDown' //低头
      case 37:
        return 'lookLeft' //左转
      case 39:
        return 'lookRight' //右转
      default:
        return undefined
    }
  },
  _keyDownFunction: function(e) {
    // 获取键盘返回的标志
    //补充按esc退出人行模式byzhanwenrong
    if (e.keyCode == 27) {
      Map3DHumanView.stopHumanView(
        Map3DHumanView.map3DObject,
        Map3DHumanView.humanViewDeactive
      )
    } else {
      var flagName = Map3DHumanView._getFlagForKeyCode(e.keyCode)
      if (typeof flagName !== 'undefined') {
        Map3DHumanView.flags[flagName] = true
      }
    }
  },
  _keyUpFunction: function(e) {
    // 获取键盘返回的标志
    var flagName = Map3DHumanView._getFlagForKeyCode(e.keyCode)
    if (typeof flagName !== 'undefined') {
      Map3DHumanView.flags[flagName] = false
    }
  },
  startHumanView: function(map3d, deactiveTool) {
    //鼠标样式切换
    this.humanViewDeactive = deactiveTool
    map3d.enableCursorStyle = false
    map3d._element.style.cursor = ''
    this.map3DObject = map3d
    this.switchDefaultAffairs(map3d, false)

    let scene = map3d.scene
    let camera = scene.camera
    let canvas = map3d.canvas // 获取画布
    canvas.setAttribute('tabindex', '0') // 获取焦点

    // var ellipsoid = map3d.scene.globe.ellipsoid // 获取地球球体对象
    if (!this.handlerPoint) {
      this.handlerPoint = new Cesium.DrawHandler(map3d, Cesium.DrawMode.Point)
    }
    this.handlerPoint.activeEvt.addEventListener(this.activeTool)
    this.handlerPoint.drawEvt.addEventListener(this.drawEventHandler)
    this.handlerPoint.activate()

    // 监听键盘按下事件
    document.addEventListener('keydown', this._keyDownFunction, false)

    // 监听键盘弹起时间
    document.addEventListener('keyup', this._keyUpFunction, false)

    // 对onTick事件进行监听
    map3d.clock.onTick.addEventListener(this._onTick)
  },
  activeTool: function(isActive) {
    if (isActive == true) {
      Map3DHumanView.map3DObject.enableCursorStyle = false
    } else {
      Map3DHumanView.map3DObject.enableCursorStyle = true
    }
  },
  drawEventHandler: function(result) {
    let scene = Map3DHumanView.map3DObject.scene
    let camera = scene.camera
    var position = result.object.position
    var cartographic = Cesium.Cartographic.fromCartesian(position)
    var longitude = Cesium.Math.toDegrees(cartographic.longitude)
    var latitude = Cesium.Math.toDegrees(cartographic.latitude)
    var height = cartographic.height + 1.7 //当前高度加上人的高度

    let cameraPosition = Cesium.Cartesian3.fromDegrees(
      longitude,
      latitude,
      height
    )

    var headingAngle = camera.heading //获取当前用户所在的方位角
    var pitchAngle = 0 //默认平视
    var rollAngle = 0
    camera.setView({
      destination: cameraPosition,
      orientation: {
        pitch: Cesium.Math.toRadians(pitchAngle),
        heading: Cesium.Math.toRadians(headingAngle),
        roll: Cesium.Math.toRadians(rollAngle)
      }
    })

    Map3DHumanView.handlerPoint.clear()
    Map3DHumanView.handlerPoint.deactivate()
  },
  _onTick: function() {
    // 获取实例的相机对象
    let scene = Map3DHumanView.map3DObject.scene
    let camera = scene.camera
    // 获取相机高度
    // cartesianToCartographic(): 将笛卡尔坐标转化为地图坐标，方法返回Cartographic对象，包含经度、纬度、高度
    var cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(
      camera.position
    ).height

    var moveRate = (cameraHeight / 100.0) * 8

    //var turnfactor=0.03;
    var perRadian = (10 * Math.PI) / 180.0
    var taitpifactor = 0.01

    // 如果按下键盘就移动
    var flags = Map3DHumanView.flags
    //w
    if (flags.moveForward) {
      //camera.moveForward(moveRate);
      camera.moveBackward(-moveRate)
    }
    //s
    if (flags.moveBackward) {
      camera.moveBackward(moveRate)
    }
    //q
    if (flags.moveUp) {
      camera.moveUp(moveRate)
    }
    //e
    if (flags.moveDown) {
      camera.moveDown(moveRate)
    }
    //a
    if (flags.moveLeft) {
      camera.moveLeft(0.005)
    }
    //d
    if (flags.moveRight) {
      camera.moveRight(0.005)
    }
    if (flags.lookUp) {
      camera.lookUp(taitpifactor)
    }
    if (flags.lookDown) {
      camera.lookDown(taitpifactor)
    }
    if (flags.lookLeft) {
      let cartographic = camera.positionCartographic
      let longitude = Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = Cesium.Math.toDegrees(cartographic.latitude)
      let height = cartographic.height
      let cameraPosition = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      )
      camera.rotate(cameraPosition, -perRadian)
      //camera.lookLeft(turnfactor);
    }
    if (flags.lookRight) {
      let cartographic = camera.positionCartographic
      let longitude = Cesium.Math.toDegrees(cartographic.longitude)
      let latitude = Cesium.Math.toDegrees(cartographic.latitude)
      let height = cartographic.height
      let cameraPosition = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      )

      camera.rotate(cameraPosition, perRadian)
      //camera.lookRight(turnfactor);
    }
    //console.log(Cesium.Math.toDegrees(camera.pitch),Cesium.Math.toDegrees(camera.heading),Cesium.Math.toDegrees(camera.roll))
  },
  stopHumanView: function(map3d, deactiveTool) {
    if (this.handlerPoint) {
      this.handlerPoint.activeEvt.removeEventListener(this.activeTool)
      this.handlerPoint.drawEvt.removeEventListener(this.drawEventHandler)
    }
    this.switchDefaultAffairs(map3d, true)
    map3d.enableCursorStyle = true
    if (deactiveTool) {
      deactiveTool()
    }
    map3d.clock.onTick.removeEventListener(this._onTick)

    //键盘事件取消
    // 监听键盘按下事件
    document.removeEventListener('keydown', this._keyDownFunction, false)
    // 监听键盘弹起时间
    document.removeEventListener('keyup', this._keyUpFunction, false)
  },
  switchDefaultAffairs: function(map3d, ifOpen) {
    //切换视角模式
    let scene = map3d.scene
    // 如果为真，则允许用户旋转相机。如果为假，相机将锁定到当前标题。此标志仅适用于2D和3D。
    scene.screenSpaceCameraController.enableRotate = ifOpen
    // 如果为true，则允许用户平移地图。如果为假，相机将保持锁定在当前位置。此标志仅适用于2D和Columbus视图模式。
    scene.screenSpaceCameraController.enableTranslate = ifOpen
    // 如果为真，允许用户放大和缩小。如果为假，相机将锁定到距离椭圆体的当前距离
    scene.screenSpaceCameraController.enableZoom = ifOpen
    // 如果为真，则允许用户倾斜相机。如果为假，相机将锁定到当前标题。这个标志只适用于3D和哥伦布视图。
    scene.screenSpaceCameraController.enableTilt = ifOpen
    // 如果为true，则允许用户使用免费外观。如果错误，摄像机视图方向只能通过转换或旋转进行更改。此标志仅适用于3D和哥伦布视图模式。
    scene.screenSpaceCameraController.enableLook = ifOpen
    // console.log("_switchDefaultAffairs",ifOpen)
  }
}
export { Map3DHumanView }
