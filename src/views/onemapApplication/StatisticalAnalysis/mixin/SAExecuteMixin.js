const SAExecuteMixin = {
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    SAExcuteMapMethod(name, ...params) {
      // console.log(params)
      const methodProxy = {
        method: name,
        params
      }
      this.$store.commit('onemapApplication/setSAExecuteFunName', methodProxy)
    }
  },
  computed: {
  },
  watch: {
  }
}
export default SAExecuteMixin
