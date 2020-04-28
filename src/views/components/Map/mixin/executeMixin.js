const executeMixin = {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    excuteMapMethod(name, ...params) {
      // console.log(params)
      const methodProxy = {
        method: name,
        params
      }
      this.$store.commit('onemapApplication/setExecuteFunName', methodProxy)
    }
  },
  computed: {
  },
  watch: {
  }
}
export default executeMixin
