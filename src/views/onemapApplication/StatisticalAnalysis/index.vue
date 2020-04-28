<template>
  <RightPanel :show="rightPanelShow" ref="spatialAnalysisRightPanel">
    <div :class="isShowResult?'spatial-analysis-r':'spatial-analysis-q'">
      <!-- <div></div> -->
      <Query v-show="!isShowResult" @changeIsShowResult="changeIsShowResult"></Query>
      <Result ref="SAResult" v-if="isShowResult" @changeIsShowResult="returnQuery"
      :isShowContorl="isShowContorl"></Result>
    </div>
    <Loading :isLoading="loading" />
    <!-- 题头卡 -->
    <div class="header-card" @click.stop="contorlHeaderCard">
      <!-- <span class="header-span">{{isShowResult?'分析结果':'分析模型'}}</span> -->
      <span class="header-span">统计分析</span>
      <!-- <i class="el-icon-close" @click.stop="closeHeaderCard"></i> -->
    </div>
  </RightPanel>
</template>
<script>
import { arcgisToGeoJSON, geojsonToArcGIS } from '@esri/arcgis-to-geojson-utils'
import RightPanel from '@/views/components/RightPanel'
import rightPanelMixin from '@/views/components/RightPanel/mixin/hasRightPanel'
import Query from './Query'
import Result from './Result'
import Loading from '@/components/Loading'
export default {
  name: 'StatisticalAnalysis',
  components: {
    Query,
    Result,
    RightPanel,
    Loading
  },
  mixins: [rightPanelMixin],
  props: [],
  data() {
    return {
      isShowResult: false,
      loading: false, // 获取数据时的加载
      tableDataList: [], // 表格展示数据
      // 右侧面板需要的store变量
      rightPanelNameSpace: 'onemapApplication',
      rightPanelShowKey: 'spatialAnalysisRightPanelShow',
      rightPanelWidthKey: 'spatialAnalysisRightPanelWidth',
      setRightPanelShowKey: 'setSpatialAnalysisRightPanelShow',
      setRightPanelWidthKey: 'setSpatialAnalysisRightPanelWidth',
      isShowContorl: true, // 收缩控制
      chartData: [],
      allGetData: {}
    }
  },
  created() { },
  mounted() {
    // TODO 这里无法通过this.getRightPanelWidth去获得元素宽度
    this.setRightPanelWidth(this.getRightPanelWidth())
    this.setRightPanelShow(true)
    // activated声明周期中也有设置
    // this.$store.commit('onemapApplication/setLeftPanelShow', false)
  },
  methods: {
    // 取得右侧面板宽度
    getRightPanelWidth() {
      return this.$refs.spatialAnalysisRightPanel.$el.offsetWidth
    },
    // 右侧面板内容切换,结果内容填充
    changeIsShowResult(res) {
      this.isShowResult = res
    },

    // 返回查询
    returnQuery() {
      this.isShowResult = false
    },
    // 返回结果
    returnResult() {
      this.isShowResult = true
    },
    // 改变加载控制
    changLoading(val) {
      this.loading = val
    },
    // 收缩控制
    contorlHeaderCard() {
      // console.log('点击显隐')
      this.isShowContorl = !this.isShowContorl
      this.setRightPanelShow(this.isShowContorl)
    }
  },
  watch: {
    // 切换内容的时候，重新计算宽度
    // 需要nextTick 不然会先计算，再渲染界面，这样是错误的
    isShowResult() {
      this.$nextTick(() => {
        this.setRightPanelWidth(this.getRightPanelWidth())
      })
    }
  },
  // 路由缓存时，重新激活
  activated() {
    this.$store.commit('onemapApplication/setLeftPanelShow', false)
  }
}
</script>
<style lang='scss' scoped>
.spatial-analysis-q {
  height: 100%;
  // width: 500px;
  transition: all 0.3s;
}
.spatial-analysis-r {
  height: 100%;
  // width: 845px;
}
.header-card {
  position: absolute;
  left: -37px;
  top: 13px;
  width: 17px;
  // height: 72px;
  background: linear-gradient(
    180deg,
    rgba(92, 104, 255, 1),
    rgba(33, 189, 202, 1)
  );
  border: 2px solid;
  border-image: linear-gradient(
      180deg,
      rgba(138, 147, 255, 1),
      rgba(31, 224, 240, 1)
    )
    2 2;
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
</style>
