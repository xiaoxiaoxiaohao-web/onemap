export default {
  state: {
    // 空间分析右侧面板
    spatialAnalysisRightPanelShow: false,
    spatialAnalysisRightPanelWidth: 0,
    // 空间分析高亮内容
    SAHighlightRings: null,
    SAExecuteMehod: null // SpatialAnalysis分屏执行的方法名称
  },
  mutations: {
    // 空间分析右侧面板
    setSpatialAnalysisRightPanelShow(state, show) {
      state.spatialAnalysisRightPanelShow = show
    },
    setSpatialAnalysisRightPanelWidth(state, width) {
      state.spatialAnalysisRightPanelWidth = width
    },
    // 空间分析高亮内容
    setSAHighlightRings(state, rings) {
      state.SAHighlightRings = rings
    },
    setSAExecuteFunName(state, methodProxy) {
      state.SAExecuteMehod = methodProxy
    }
  }
}
