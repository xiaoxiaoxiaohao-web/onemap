<template>
  <div class="suitability">
    <!-- <div class="suitability-left">
      <TPAAside />
    </div> -->
    <LeftPanel class="suitability-left" :show="leftPanelShow" ref="suitabilityLeftPanel">
      <TPAAside/>
    </LeftPanel>
    <RightPanel :show="rightPanelShow" ref="suitabilityRightPanel">
      <EvaluationResults></EvaluationResults>
    </RightPanel>
  </div>
</template>
<script>
import RightPanel from '@/views/components/RightPanel'
import rightPanelMixin from '@/views/components/RightPanel/mixin/hasRightPanel'
import TPAAside from './Aside'
import EvaluationResults from './EvaluationResults'
import LeftPanel from '@/views/components/LeftPanel'
import leftPanelMixin from '@/views/components/LeftPanel/mixin/hasLeftPanel'
export default {
  name: 'Suitability',
  components: {
    RightPanel,
    LeftPanel,
    TPAAside,
    EvaluationResults
  },
  mixins: [rightPanelMixin, leftPanelMixin],
  props: [],
  data() {
    return {
      // 右侧面板需要的store变量
      rightPanelNameSpace: 'territorialPlanEvaluate',
      rightPanelShowKey: 'suitabilityRightPanelShow',
      rightPanelWidthKey: 'suitabilityRightPanelWidth',
      //右侧面板显示隐藏需要修改store里的setSuitabilityRightPanelShow变量
      setRightPanelShowKey: 'setSuitabilityRightPanelShow',
      setRightPanelWidthKey: 'setSuitabilityRightPanelWidth',
      // 左侧面板
      leftPanelNameSpace: 'territorialPlanEvaluate',
      leftPanelShowKey: 'suitabilityLeftPanelShow',
      leftPanelWidthKey: 'suitabilityLeftPanelWidth',
      setLeftPanelShowKey: 'setSuitabilityLeftPanelShow',
      setLeftPanelWidthKey: 'setSuitabilityLeftPanelWidth'
    }
  },
  created() { },
  mounted() {
    this.setLeftPanelWidth(this.getLeftPanelWidth())
    this.setLeftPanelShow(true)
    this.setRightPanelWidth(this.getRightPanelWidth())
    this.setRightPanelShow(true)
  },
  methods: {
    // 取得右侧面板宽度
    getRightPanelWidth() {
      return this.$refs.suitabilityRightPanel.$el.offsetWidth
    },
    // 取得左侧面板宽度
    getLeftPanelWidth() {
      return this.$refs.suitabilityLeftPanel.$el.offsetWidth
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>

</style>
