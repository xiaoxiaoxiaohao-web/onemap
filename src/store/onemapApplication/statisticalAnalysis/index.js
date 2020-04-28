export default {
  state: {
    btnName: '',
    areaCondition: {}
  },
  mutations: {
    setButtonName (state, val) {
      state.btnName = val
    },
    setAreaCondition (state, val) {
      state.areaCondition = val
    }
  }
}
