<template>
  <div ref="scrollPanel" @scroll="onScroll">
    <div v-for="dom in domDatas" :ref="dom[prop]" :key="dom[prop]">
      <slot :data="dom"></slot>
    </div>
  </div>
</template>
<script>
// TODO 首次滚动到具体位置 末尾几个元素的判断
export default {
  name: 'ScollPanel',
  props: {
    domDatas: {
      type: Array,
      required: true
    },
    prop: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String]
    },
    // 触发更新value时距离顶部的距离 px
    triggerTop: Number
  },
  mounted() {
    this.scrollPanel = this.$refs.scrollPanel
    // 同步本地value与外部value
    this.selfValue = this.value
    // 激活默认值
    if (this.domDatas.length) {
      if (this.value) {
        this.scrollTo(this.value)
      } else {
        // 默认激活第一个
        this.selfValue = this.domDatas[0][this.prop]
        this.$emit('input', this.selfValue)
      }
    }
  },
  data() {
    this.timeout = null
    this.isRun = false
    this.scrollPanel = null
    this.selfValue = ''
    return {

    }
  },
  methods: {
    onScroll() {
      if (!this.isRun && this.selfValue === this.value) {
        this.isRun = true
        // 节流
        this.timeout = setTimeout(() => {
          for (let i = 0; i < this.domDatas.length; i++) {
            const item = this.domDatas[i]
            const dom = this.$refs[item[this.prop]][0]
            const top = dom.offsetTop - (dom.parentElement ? dom.parentElement.offsetTop : 0) - this.scrollPanel.scrollTop //距离div顶部的高度
            if (top <= this.triggerTop && top > -(dom.offsetHeight - this.triggerTop)) {
              // dom.style = 'outline: 1px solid black;'
              this.selfValue = this.domDatas[i][this.prop]
              if (this.selfValue !== this.value) {
                this.$emit('input', this.selfValue)
                console.log(this.domDatas.length)
              }
            } else {
              // dom.style = ''
            }
          }
          this.isRun = false
        }, 100)
      }
    },
    frameScroll(scrollNow, scrollTo, step, callback) {
      const type = scrollNow > scrollTo ? 'up' : 'down'
      if (type === 'up') {
        const distance = scrollNow - scrollTo
        scrollNow = distance > step ? scrollNow - step : scrollTo
        this.scrollPanel.scrollTop = scrollNow
      } else {
        const distance = scrollTo - scrollNow
        scrollNow = distance < step ? scrollTo : scrollNow + step
        this.scrollPanel.scrollTop = scrollNow
      }
      if (scrollNow !== scrollTo) {
        window.requestAnimationFrame(() => {
          this.frameScroll(scrollNow, scrollTo, step, callback)
        })
      } else {
        callback && callback()
      }
    },
    scrollTo(value) {
      this.isRun = true
      const dom = this.$refs[value][0]
      // this.scrollPanel.scrollTop = scrollTop
      this.$nextTick(() => {
        // 这里不使用setTimeout的话，会出现css未挂载，从而无法准确滚动至某个元素的bug
        setTimeout(() => {
          const scrollTop = dom.offsetTop - (dom.parentElement ? dom.parentElement.offsetTop : 0)
          const step = Math.abs(this.scrollPanel.scrollTop - scrollTop) / 10
          const callback = () => {
            this.$nextTick(() => {
              // 这里不使用setTimeout的话，会出现scrollIntoView之后，元素已经滚动到相应位置了但是还会触发onScroll事件
              setTimeout(() => {
                this.isRun = false
                this.selfValue = this.value
              }, 100)
            })
          }
          this.frameScroll(this.scrollPanel.scrollTop, scrollTop, step, callback)
        }, 100)
      })
    }
  },
  watch: {
    value() {
      // 证明是从外部改变的，外部滚动不要触发onscroll
      if (this.selfValue !== this.value) {
        this.scrollTo(this.value)
      }
    }
  }
}
</script>
<style lang="css" scoped>
</style>
