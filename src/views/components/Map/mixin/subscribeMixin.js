const subscribeMixin = {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  },
  computed: {
    getExecuteFunName() {
      return this.$store.state.onemapApplication.executeMehod
    }
  },
  watch: {
    getExecuteFunName(val) {
      if (val) {
        this[val.method](...val.params)
        this.$store.commit('onemapApplication/setExecuteFunName', null)
      }
    }
  }
}
export default subscribeMixin
