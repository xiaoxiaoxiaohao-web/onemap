<!--
 * @Description: 一张图
 * @Author: your name
 * @Date: 2019-09-06 18:22:21
 -->
<template>
  <div class="onemap height100">
    <OnemapHeader />
    <div class="main-wrapper">
      <OnemapMain class="onemap-map" :style="mapStyle"></OnemapMain>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import OnemapHeader from '@/views/components/Header'
import OnemapMain from '@/views/components/Map'
import oneMapApi from '@/api/oneMap'
export default {
  name: 'OneMapApplication',
  components: {
    OnemapHeader,
    OnemapMain
  },
  props: [],
  data() {
    return {
      mapStyle: {
        width: '100%'
      }
    }
  },
  created() { },
  mounted() {
    this.refreshMapStyle()
  },
  methods: {
    refreshMapStyle() {
      let leftAndRightwidth = 0
      let left = 0
      if (this.getRightPanelShow) {
        leftAndRightwidth += this.getRightPanelWidth
      }
      if (this.getLeftPanelShow) {
        // 转换成rem TODO 当有左侧面板独立组件的时候，这里的逻辑要提出去
        leftAndRightwidth += this.getLeftPanelWidth
        left += this.getLeftPanelWidth
      }
      this.mapStyle = {
        width: leftAndRightwidth ? `calc(100% - ${leftAndRightwidth}rem)` : '100%',
        left: left + 'rem'
      }
    }
  },
  computed: {
    getRightPanelWidth() {
      return this.$store.state.onemapApplication.rightPanelWidth
    },
    getRightPanelShow() {
      return this.$store.state.onemapApplication.rightPanelShow
    },
    getLeftPanelWidth() {
      return this.$store.state.onemapApplication.leftPanelWidth
    },
    getLeftPanelShow() {
      return this.$store.state.onemapApplication.leftPanelShow
    },
    htmlFontSize() {
      return this.$store.state.global.htmlFontSize
    }
  },
  watch: {
    getRightPanelShow() {
      this.refreshMapStyle()
    },
    getRightPanelWidth() {
      this.refreshMapStyle()
    },
    getLeftPanelWidth() {
      this.refreshMapStyle()
    },
    getLeftPanelShow() {
      this.refreshMapStyle()
    },
    htmlFontSize() {
      // this.refreshMapStyle()
    }
  }
}
</script>
<style lang="scss" scoped>
.onemap {
  display: flex;
  flex-direction: column;
  .main-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  .onemap-map {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    overflow: hidden;
    transition: all 0.3s;
  }
}
</style>
