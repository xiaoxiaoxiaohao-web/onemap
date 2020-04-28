let Map3DMeasure = {
  horMesaureHandler: null,
  heightMeasureHandler: null,
  areaMeasureHandler: null,
  startHorMeasure: function(map3d) {
    if (!this.horMeasureHandler) {
      this.horMeasureHandler = new Cesium.MeasureHandler(
        map3d,
        Cesium.MeasureMode.Distance,
        0
      )
    }
    var _this = this
    this.horMeasureHandler.measureEvt.addEventListener(this.horMeasureEvent)
    this.horMeasureHandler.activate()
  },
  stopHorMeasure: function() {
    if (this.horMeasureHandler) {
      this.horMeasureHandler.clear()
      this.horMeasureHandler.deactivate()
      this.horMeasureHandler.measureEvt.removeEventListener(
        this.horMeasureEvent
      )
    }
  },
  horMeasureEvent: function(result) {
    var dis = parseFloat(result.distance)
    var distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + '千米' : dis.toFixed(2) + '米'

    Map3DMeasure.horMeasureHandler.disLabel.text = '距离:' + distance
    //Map3DMeasure.horMeasureHandler.activate()
  },
  startHeightMeasure: function(map3d) {
    if (!this.heightMeasureHandler) {
      this.heightMeasureHandler = new Cesium.MeasureHandler(
        map3d,
        Cesium.MeasureMode.DVH
      )
    }
    var _this = this
    this.heightMeasureHandler.measureEvt.addEventListener(
      this.heightMeasureEvent
    )
    this.heightMeasureHandler.activate()
  },
  stopHeightMeasure: function(map3d) {
    if (this.heightMeasureHandler) {
      this.heightMeasureHandler.clear()
      this.heightMeasureHandler.deactivate()
      this.heightMeasureHandler.measureEvt.removeEventListener(
        this.heightMeasureEvent
      )
    }
  },
  heightMeasureEvent: function(result) {
    var distance =
      result.distance > 1000
        ? (result.distance / 1000).toFixed(2) + '千米'
        : result.distance + '米'
    var vHeight =
      result.verticalHeight > 1000
        ? (result.verticalHeight / 1000).toFixed(2) + '千米'
        : result.verticalHeight + '米'
    var hDistance =
      result.horizontalDistance > 1000
        ? (result.horizontalDistance / 1000).toFixed(2) + '千米'
        : result.horizontalDistance + '米'
    Map3DMeasure.heightMeasureHandler.disLabel.text = '空间距离:' + distance
    Map3DMeasure.heightMeasureHandler.vLabel.text = '垂直高度:' + vHeight
    Map3DMeasure.heightMeasureHandler.hLabel.text = '水平距离:' + hDistance
  },
  startAreaMeasure: function(map3d) {
    if (!this.areaMeasureHandler) {
      this.areaMeasureHandler = new Cesium.MeasureHandler(
        map3d,
        Cesium.MeasureMode.Area,
        2
      )
    }
    this._this = this
    this.areaMeasureHandler.measureEvt.addEventListener(this.areaMeasureEvent)
    this.areaMeasureHandler.activate()
  },
  stopAreaMeasure: function(map3d) {
    if (this.areaMeasureHandler) {
      this.areaMeasureHandler.clear()
      this.areaMeasureHandler.deactivate()
      this.areaMeasureHandler.measureEvt.removeEventListener(
        this.areaMeasureEvent
      )
    }
  },
  areaMeasureEvent: function(result) {
    var area = parseFloat(result.area)
    var area2 =
      area > 1000000
        ? (area / 1000000).toFixed(2) + '平方公里'
        : area.toFixed(2) + '平方米'
    Map3DMeasure.areaMeasureHandler.areaLabel.text = '面积:' + area2
    //console.log('面积量测次数')
  }
}
export { Map3DMeasure }
