export default {
  state: {
    //通用查询(年份)
    getAllYearData: {},
    //通用查询(区域)
    getAllAreaData: {},
    //通用查询手动添加部分
    getQueryHandUrl: '',
    //通用查询自定义部分
    // getQueryCustom: [],
    //通用查询条件字段部分
    getQueryField: {},
    //通用查询结果部分
    getQueryRealutVal: {},
    //通用查询导出部分
    getQueryExportVal: '',
    getQueryExportObjectVal: {},
    getQueryListChangeVal: '',
    getQueryResultCustomVal: '',
    setStateResultShow: '',
    publicQueryPicLastNameVal: '',
    publicQuerySpecialFieldVal: [],
    //右侧面板
    onemapRightPanelShow: false,
    onemapRightPanelWidth: 0,
    // 通用查询右侧查询结果面板
    showResultPanel: false,
    addResultPanel: false,
    // 左侧面板
    onemapLeftPanelShow: false,
    onemapLeftPanelWidth: 0,
    // 图层叠加操作
    layerOperate: {
      type: 'add', //or 'remove'
      layers: []
    },
    // 专题叠加操作
    subjectOperate: {
      type: 'add', //or 'remove'
      layers: []
    },
    // 已经叠加的图层
    layerAddedKeys: [],
    // 已经叠加的专题
    subjectAddedKeys: [],
    //选中的查询结果
    resultItem: {},
    fieldAliases: {},
    coordinatesShow: '',
    scale: 0
  },
  mutations: {
    setResultPanelShow(state, show) {
      state.showResultPanel = show
    },
    setResultPanelAdd(state, add) {
      state.addResultPanel = add
    },
    //通用查询(年份)
    publicQueryYear(state, val) {
      state.getAllYearData = val
    },
    //通用查询(区域)
    publicQueryArea(state, val) {
      state.getAllAreaData = val
    },
    //通用查询手动添加部分
    publicQueryHand(state, val) {
      state.getQueryHandUrl = val
    },
    //通用查询自定义部分
    // publicQueryCustom(state, val) {
    //   state.getQueryCustom = val
    // },
    //通用查询条件字段部分
    publicQueryResultField(state, val) {
      state.getQueryField = val
    },
    //通用查询结果部分
    publicQueryRealut(state, val) {
      state.getQueryRealutVal = val
    },
    //通用查询导出部分
    publicQueryExportObject(state, val) {
      state.getQueryExportObjectVal = val
    },
    publicQueryExport(state, val) {
      state.getQueryExportVal = val
    },
    //通用查询QueryList切换的当前值
    publicQueryListChange(state, val) {
      state.getQueryListChangeVal = val
    },
    //通用查询QueryList默认的当前值
    publicQueryResultCustom(state, val) {
      state.getQueryResultCustomVal = val
    },
    publicQueryPicNamelast(state, val) {
      state.publicQueryPicLastNameVal = val
    },
    publicSpecialField(state, val) {
      state.publicQuerySpecialFieldVal = val
    },
    setResult(state, val) {
      state.setStateResultShow = val
    },
    //通用查询右侧面板
    setOnemapRightPanelShow(state, show) {
      state.onemapRightPanelShow = show
    },
    setOnemapRightPanelWidth(state, width) {
      state.onemapRightPanelWidth = width
    },
    // 左侧面板
    setOnemapLeftPanelShow(state, show) {
      state.onemapLeftPanelShow = show
    },
    setOnemapLeftPanelWidth(state, width) {
      state.onemapLeftPanelWidth = width
    },
    // 图层叠加或者取消
    setLayerOperate(state, data) {
      // 排除重复项
      if (data.type === 'add') {
        const filteredData = data.layers.filter(layer => !state.layerAddedKeys.includes(layer._element_key))
        state.layerAddedKeys = state.layerAddedKeys.concat(filteredData.map(fd => fd._element_key))
        state.layerOperate = { type: data.type, layers: filteredData }
      } else if (data.type === 'remove') {
        data.layers.forEach(layer => {
          const index = state.layerAddedKeys.indexOf(layer._element_key)
          index > -1 && state.layerAddedKeys.splice(index, 1)
        })
        state.layerOperate = { type: data.type, layers: data.layers }
      }
    },
    setSubjectOperate(state, data) {
      // 排除重复项
      if (data.type === 'add') {
        const filteredData = data.layers.filter(layer => !state.subjectAddedKeys.includes(layer.Url))
        state.subjectAddedKeys = state.subjectAddedKeys.concat(filteredData.map(fd => fd.Url))
        state.subjectOperate = { type: data.type, layers: filteredData }
      } else if (data.type === 'remove') {
        data.layers.forEach(layer => {
          const index = state.subjectAddedKeys.indexOf(layer.Url)
          index > -1 && state.subjectAddedKeys.splice(index, 1)
        })
        state.subjectOperate = { type: data.type, layers: data.layers }
      }
    },
    setResultItem(state, val) {
      state.resultItem = val
    },
    setFieldAliases(state, val) {
      state.fieldAliases = val
    },
    setCoordinatesShow(state, val) {
      state.coordinatesShow = val
    },
    setScale(state, val) {
      state.scale = val
    }
  }
}
