<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-19 09:34:29
 -->
<template>
  <RightPanel :show="rightPanelShow" ref="HDLToolRightPanel">
    <div class="HDLTool-body">
      <div class="tool-div">
        <div class="tool-option">
          <tool-option ref="option"></tool-option>
        </div>
      </div>
    </div>
  </RightPanel>
</template>

<script>
// @ is an alias to /src
import RightPanel from '@/views/components/RightPanel'
import rightPanelMixin from '@/views/components/RightPanel/mixin/hasRightPanel'
import toolOption from './option'
export default {
  name: 'HDLTool',
  components: {
    toolOption,
    RightPanel
  },
  mixins: [rightPanelMixin],
  data() {
    return {
      drawContorl: false,
      // 右侧面板需要的store变量
      rightPanelNameSpace: 'onemapApplication',
      rightPanelShowKey: 'HDLToolRightPanelShow',
      rightPanelWidthKey: 'HDLToolRightPanelWidth',
      setRightPanelShowKey: 'setHDLToolRightPanelShow',
      setRightPanelWidthKey: 'setHDLToolRightPanelWidth'
    }
  },
  created() {
  },
  mounted() {
    // TODO 这里无法通过this.getRightPanelWidth去获得元素宽度
    this.setRightPanelWidth(550)
    this.setRightPanelShow(true)
    // this.$store.commit('onemapApplication/setLeftPanelShow', false)
  },
  methods: {
    // 取得右侧面板宽度
    getRightPanelWidth() {
      return this.$refs.HDLToolRightPanel.$el.offsetWidth
    }
  },
  watch: {
    // 切换内容的时候，重新计算宽度
    // 需要nextTick 不然会先计算，再渲染界面，这样是错误的
    // isShowResult() {
    //   this.$nextTick(() => {
    //     this.setRightPanelWidth(this.getRightPanelWidth())
    //   })
    // }
  },
  // 路由缓存时，重新激活
  activated() {
    this.$store.commit('onemapApplication/setLeftPanelShow', false)
  }
}
</script>
<style scoped>
.HDLTool-body {
  background-color: white;
  text-align: center;
  position: absolute;
  right: 0;
  height: 100%;
  width: 550px;
}
.tool-div {
  width: 550px;
  height: 100%;
  margin: auto;
  font-size: 13px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.tool-option {
  width: 550px;
  height: 100%;
}
</style>

