const SASubscribeMixin = {
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
      return this.$store.state.onemapApplication.SAExecuteMehod
    }
  },
  watch: {
    getExecuteFunName(val) {
      if (val) {
        this[val.method](...val.params)
        this.$store.commit('onemapApplication/setSAExecuteFunName', null)
      }
    }
  }
}
export default SASubscribeMixin
