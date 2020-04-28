<template>
  <div>
    <div class="one-map-left">
      <LeftPanel :show="leftPanelShow" ref="onemapLeftPanel">
        <!-- <OnemapAside3D v-show="is3D"/>
        <OnemapAside v-show="!is3D"/> -->
        <keep-alive>
          <component :is="mapAside" />
        </keep-alive>
      </LeftPanel>
    </div>
    <div class="one-map-right">
      <RightPanel :show="rightPanelShow" ref="onemapRightPanel">
        <QueryPanelResult />
        <!-- 题头卡 -->
        <div class="header-card" @click.stop="contorlHeaderCard" v-show="showResultPanel">
          <span class="header-span">查询结果</span>
          <i class="el-icon-close" @click.stop="closeHeaderCard"></i>
        </div>
      </RightPanel>
    </div>
  </div>
</template>
<script>
import OnemapAside from './Aside'
import OnemapAside3D from './Aside3D'
import LeftPanel from '@/views/components/LeftPanel'
import leftPanelMixin from '@/views/components/LeftPanel/mixin/hasLeftPanel'
import RightPanel from '@/views/components/RightPanel'
import rightPanelMixin from '@/views/components/RightPanel/mixin/hasRightPanel'
import QueryPanelResult from './QueryPanelResult.vue'
export default {
  name: 'OneMap',
  components: { OnemapAside, OnemapAside3D, LeftPanel, RightPanel, QueryPanelResult },
  mixins: [rightPanelMixin, leftPanelMixin],
  data() {
    return {
      // 右侧面板需要的store变量
      rightPanelNameSpace: 'onemapApplication',
      rightPanelShowKey: 'onemapRightPanelShow',
      rightPanelWidthKey: 'onemapRightPanelWidth',
      setRightPanelShowKey: 'setOnemapRightPanelShow',
      setRightPanelWidthKey: 'setOnemapRightPanelWidth',
      // 左侧面板需要的store变量
      leftPanelNameSpace: 'onemapApplication',
      leftPanelShowKey: 'onemapLeftPanelShow',
      leftPanelWidthKey: 'onemapLeftPanelWidth',
      setLeftPanelShowKey: 'setOnemapLeftPanelShow',
      setLeftPanelWidthKey: 'setOnemapLeftPanelWidth'
    }
  },
  mounted() {
    this.setLeftPanelWidth(this.getLeftPanelWidth())
    this.setLeftPanelShow(true)
    this.setRightPanelWidth(this.getRightPanelWidth())
    this.setRightPanelShow(false)
  },
  methods: {
    // 取得右侧面板宽度
    getRightPanelWidth() {
      return this.$refs.onemapRightPanel.$el.offsetWidth
    },
    getLeftPanelWidth() {
      return this.$refs.onemapLeftPanel.$el.offsetWidth
    },
    contorlHeaderCard() {
      this.setRightPanelShow(!this.rightPanelShow)
    },
    closeHeaderCard() {
      this.$store.commit('onemapApplication/setResultPanelShow', false)
      this.setRightPanelShow(false)
    }
  },
  computed: {
    showResultPanel() {
      return this.$store.state.onemapApplication.showResultPanel
    },
    addResultPanel() {
      return this.$store.state.onemapApplication.addResultPanel
    },
    mapAside () {
      return this.$store.getters['onemapApplication/is3D'] ? 'OnemapAside3D' : 'OnemapAside'
    }
  },
  // 缓存路由激活
  activated() {
    this.$store.commit('onemapApplication/setRightPanelShow', this.rightPanelShow)
    this.$store.commit('onemapApplication/setLeftPanelShow', this.leftPanelShow)
  }
}
</script>
<style lang='scss' scoped>
.one-map-left {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 50;
  height: 100%;
}
.one-map-right {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  .header-card {
    position: absolute;
    left: -37px;
    top: 13px;
    width: 17px;
    height: 92px;
    background: linear-gradient(180deg, rgba(92, 104, 255, 1), rgba(33, 189, 202, 1));
    border: 2px solid;
    border-image: linear-gradient(180deg, rgba(138, 147, 255, 1), rgba(31, 224, 240, 1)) 2 2;
    opacity: 0.95;
    border-radius: 5px 0px 0px 5px;
    font-size: 14px;
    padding: 16px 8px;
    word-wrap: break-word;
    color: white;
    cursor: pointer;
    &:hover {
      color: aqua;
      i {
        color: white;
      }
    }
    i {
      padding-top: 12px;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
}
</style>
