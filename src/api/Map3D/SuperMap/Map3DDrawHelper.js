import { Map3DMeasure } from './Map3DMeasure'
import { Map3DIdentify } from './Map3DIdentify'
let Map3DDrawHelper = {
  //清除地图上的绘制内容
  clearDrawDatas: function(map3d) {
    Map3DMeasure.stopHorMeasure()
    Map3DMeasure.stopHeightMeasure(map3d)
    Map3DMeasure.stopAreaMeasure(map3d)
  },

  startHorMeasure: function(map3d) {
    Map3DMeasure.startHorMeasure(map3d)
  },
  stopHorMeasure: function() {
    Map3DMeasure.stopHorMeasure()
  },
  startHeightMeasure: function(map3d) {
    Map3DMeasure.startHeightMeasure(map3d)
  },
  stopHeightMeasure: function(map3d) {
    Map3DMeasure.stopHeightMeasure(map3d)
  },
  startAreaMeasure: function(map3d) {
    Map3DMeasure.startAreaMeasure(map3d)
  },
  stopAreaMeasure: function(map3d) {
    Map3DMeasure.stopAreaMeasure(map3d)
  },
  startIndentify: function(map3d, setFeatureInfo, setSite, emptyWhoShow) {
    Map3DIdentify.startIdentify(map3d, setFeatureInfo, setSite, emptyWhoShow)
  },
  stopIdentify: function(map3d, emptyWhoShow) {
    Map3DIdentify.stopIdentify(map3d, emptyWhoShow)
  }
}
export { Map3DDrawHelper }
