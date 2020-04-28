export default {
  state: {
    // 核地类部分
    allMapServer: [], // 后台获取的所有图层服务数据
    mapServerObjData: {}, // 当前年份底图数据
    geometry: '', // 高亮geo范围
    coordinate: [], // 获取后台数据参数
    geoList: [], // 导入的内容
    nowYear: '2018', // 地块追溯当前选择年份
    buildLand: '',
    headerContorl: true, // 头部字体显示控制--导出部分需要
    // 核地类右侧面板
    HDLToolRightPanelShow: false,
    HDLToolRightPanelWidth: 0,
    // 核地类部分
    // 核地类测试部分
    geoListMultiples: [], // 导入的多个内容
    HDLTestStartTime: 0,
    HDLTestEndTime: 0,
    HDLUseTime: 0
    // 核地类测试部分
  },
  mutations: {
    setAllMapServer(state, data) {
      state.allMapServer = data
    },
    // 当前年份底图数据--地类图斑和线状地物
    changeMapServerObjData(state, data) {
      state.mapServerObjData = data
    },
    changeGeometry(state, data) {
      state.geometry = data
    },
    setCoordinate(state, data) {
      state.coordinate = data
    },
    setGeoList(state, data) {
      state.geoList = data
    },
    // 地块追溯当前年
    changeNowYear(state, data) {
      state.nowYear = data
    },
    // 地块追溯--年份切换时，需要绘制的内容
    changeBuildLand(state, data) {
      state.buildLand = data
    },
    changeHeaderContorl(state, data) {
      state.headerContorl = data
    },
    // 核地类右侧面板
    setHDLToolRightPanelShow(state, show) {
      state.HDLToolRightPanelShow = show
    },
    setHDLToolRightPanelWidth(state, width) {
      state.HDLToolRightPanelWidth = width
    },
    // 核地类测试部分
    setGeoListMultiples(state, data) {
      state.geoListMultiples = data
    },
    setHDLTestStartTime(state, date) {
      state.HDLTestStartTime = date
    },
    setHDLTestEndTime(state, date) {
      state.HDLTestEndTime = date
    },
    setHDLUseTime(state, date) {
      state.HDLUseTime = date
    }
    // 核地类测试部分
  }
}
