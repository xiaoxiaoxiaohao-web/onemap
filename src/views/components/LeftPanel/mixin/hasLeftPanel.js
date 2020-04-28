/*
 * 当某个路由中含有leftPanel的时候，需要在路由展示的根组件中引入本mixin，使用方式：
 *   1、路由展示的根组件引入mixin
 *   2、在引入的组件data函数中设置mixin需要的变量
 *     需要在data中设置五个变量，分别是
 *     a)leftPanelNameSpace 组件的数据在store中的模块
 *     b)leftPanelShowKey state中存放左侧面板是否显示的key
 *     c)leftPanelWidthKey state中存放左侧面板的宽度的key
 *     d)setLeftPanelShowKey mutation中设置左侧面板是否显示的方法key
 *     e)setLeftPanelWidthKey mutation中设置左侧面板的宽度的方法key
 *   3、在store中该组件存放数据的模块中，在state中添加leftPanelShowKey,leftPanelWidthKey,mutaion中添加setLeftPanelShowKey,setLeftPanelWidthKey为对应的设置前两个变量的方法
 *   4、在路由展示的根组件中，需要自己写获取leftPanel宽度的方法
 *   5、在路由展示的根组件中，需要自己监听leftPanel插槽中组件变化，在方法中调用this.setLeftPanelWidth(自定义的获取leftPanel宽度的方法的返回值)。注意一定要包裹在nextTick中
 *   6、在路由展示的根组件中，需要自己监听路由的actived事件，来控制keep-alive的路由左侧面板是否显示
 *   7、完整示例参考views/onemapApplication/SpatialAnalysis
 *   注意！！！！！！！！！！
 *   存储的宽度需要是rem，因为要适配window.resize事件
 *   另外，1920px是 VUE_APP_DISIGN_WIDTH 设置的
 *   其余时候，用js方法获取组件宽度调用this.setLeftPanelWidth(width即可)
 */

export default {
  data() {
    return {
      // 组件是否被缓存
      isDeactivated: false
    }
  },
  methods: {
    // 设置左侧面板是否显示
    setLeftPanelShow(show) {
      this.$store.commit(`${this.leftPanelNameSpace}/${this.setLeftPanelShowKey}`, show)
    },
    // 存储左侧面板宽度到store.onemapApplication 存储的是rem
    setLeftPanelWidth(width) {
      // 把一些手动设置的初始px转换成当浏览器宽度不是1920px时的px，因为开发的时候都是1920px的，要转换成当前的基数
      // const pxNow = width * (this.htmlFontSize / process.env.VUE_APP_ROOT_VALUE)
      // 转换成rem单位
      const remWidth = width / this.htmlFontSize
      this.$store.commit(`${this.leftPanelNameSpace}/${this.setLeftPanelWidthKey}`, remWidth)
    }
  },
  computed: {
    leftPanelShow() {
      return this.$store.state[this.leftPanelNameSpace][this.leftPanelShowKey]
    },
    leftPanelWidth() {
      return this.$store.state[this.leftPanelNameSpace][this.leftPanelWidthKey]
    },
    // 根字体
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    }
  },
  watch: {
    // 当show改变的时候，提交store
    leftPanelShow() {
      this.$store.commit(this.leftPanelNameSpace + '/setLeftPanelShow', this.leftPanelShow)
    },
    // 当左侧面板宽度改变的时候，提交store
    leftPanelWidth() {
      this.$store.commit(this.leftPanelNameSpace + '/setLeftPanelWidth', this.leftPanelWidth)
    }
  },
  // 路由激活的时候，把保存的局部panel状态同步到全局状态
  activated () {
    // 做判断，当路由首次加载的时候，也会触发这个activated周期函数，有点浪费
    if (this.isDeactivated) {
      this.$store.commit(this.leftPanelNameSpace + '/setLeftPanelShow', this.leftPanelShow)
      this.$store.commit(this.leftPanelNameSpace + '/setLeftPanelWidth', this.leftPanelWidth)
    }
  },
  // 路由缓存的时候
  deactivated () {
    this.isDeactivated = true
  }
}
