export default {
  state: {
    // 右侧面板
    suitabilityRightPanelShow: false,
    suitabilityRightPanelWidth: 0,
    suitabilityLeftPanelShow: false,
    suitabilityLeftPanelWidth: 0,

    //国土空间规划评价市区街道
    getDistrictStreet: '',
    //国土空间规划评价首次点击数据时出现条形图
    getBarShow: ''
  },
  mutations: {
    setSuitabilityRightPanelShow(state, show) {
      state.suitabilityRightPanelShow = show
    },
    setSuitabilityRightPanelWidth(state, width) {
      state.suitabilityRightPanelWidth = width
    },
    setSuitabilityLeftPanelShow(state, show) {
      state.suitabilityLeftPanelShow = show
    },
    setSuitabilityLeftPanelWidth(state, width) {
      state.suitabilityLeftPanelWidth = width
    },
    //国土空间规划评价(市区/重点)街道
    DistrictStreet(state, val) {
      state.getDistrictStreet = val
    },
    //国土空间规划评价首次点击数据时出现条形图
    evaluationDataEchart(state, val) {
      state.getBarShow = val
    }

  }
}
