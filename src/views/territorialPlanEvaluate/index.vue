<!--
 * @Description: 国土空间规划分析评价
 * @Author: your name
 * @Date: 2019年10月9日14:47:02
 -->
<template>
  <div class="TP-evaluate height100">
    <Header />
    <div class="main-wrapper">
      <MapMain class="TP-evaluate-map" :style="mapStyle" :mapType="mapType">
        <!-- 范围与区域选择 -->
        <template v-slot:mapSlotLeft>
          <div class="TP-evaluate-left">
            <div class="left-one">
              <div class="left-one-left">中山市</div>
              <div class="left-one-right">
                <el-select v-model="district" placeholder="请选择" :popper-class="'TP-evaluate-select'">
                  <el-option v-for="(item,index) in districtList" :key="index" :label="item.attributes.ZM" :value="item.attributes.ZM" @click.native="onDistrictClick(item,index)">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="left-two">
              <div class="left-two-left">重点规划区域</div>
              <div class="left-two-right">
                <el-select v-model="focusDistrict" placeholder="请选择" :popper-class="'TP-evaluate-select'">
                  <el-option v-for="(item,index) in focusDistrictList" :key="item.value" :label="item.label" :value="item.value" @click.native="onFocusDistrictClick(item,index)">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
        </template>
        <!-- 一键出图按钮 -->
        <template v-slot:mapSlotRight>
          <div class="TP-evaluate-right">
            <div class="export-map-btn" @click="isPrintMapWinShow = !isPrintMapWinShow">
              <div>一键出图</div>
            </div>
          </div>
          <!-- 导出参数选择 -->
          <div class="export-map-win" v-show="isPrintMapWinShow">
            <div class="win-top">
              <span>参数设置</span>
              <i class="el-icon-close cursor-pointer" @click="isPrintMapWinShow = false"></i>
            </div>
            <!-- 内容部分 -->
            <div class="win-content">
              <div class="default-style">
                <el-checkbox v-model="isDefaultActive" :disabled="isDefaultActive" @change="onDefaultChange">默认版式</el-checkbox>
                <div class="radio-div">
                  <el-radio-group v-model="defaultType" :disabled="!isDefaultActive">
                    <el-radio v-for="(item,index) in defaultList" :key="index" :label="item.name">{{item.name}}({{item.width}}*{{item.height}})</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="customize-style">
                <el-checkbox v-model="isCustomizeActive" :disabled="isCustomizeActive" @change="onCustomizeChange">自定义版式</el-checkbox>
                <div class="radio-div">
                  <div>
                    <span>长:</span>
                    <el-input class="customize-input" :disabled="!isCustomizeActive" v-model="inputWidth"></el-input>
                    <span>mm</span>
                  </div>
                  <div class="pl-second">
                    <span>宽:</span>
                    <el-input class="customize-input" :disabled="!isCustomizeActive" v-model="inputHeight"></el-input>
                    <span>mm</span>
                  </div>
                </div>
              </div>
              <div class="button-div">
                <el-button class="cancel-btn" @click="isPrintMapWinShow = false">取消</el-button>
                <el-button class="print-btn" @click="onPrintClick">打印</el-button>
              </div>
            </div>
          </div>
        </template>
        <!-- 图例展示 -->
        <template v-slot:mapSlotLeftBottom>
          <div class="TP-evaluate-legend">
            <div class="legend-button" v-show="!isLegendActive" @click="isLegendActive = true">图例</div>
            <div class="legend-content" v-show="isLegendActive">
              <i class="el-icon-close legend-close" @click="isLegendActive = false"></i>
              <span class="legend-title">{{legendTitle}}</span>
              <div class="legend-for" v-for="(item,index) in legendData" :key="index">
                <div class="legend-colour" :style="{backgroundColor: item.colour}"></div>
                <span>{{item.label}}</span>
              </div>
            </div>
          </div>
        </template>
        <!-- 地图类型切换 -->
        <template v-slot:mapSlotRightBottom>
          <div class="TP-evaluate-map-type">
            <div class="type-style" :style="{backgroundImage:'url('+item.url+')'}" :class="(index === 0)?'frist-type':'other-type'" v-for="(item,index) in mapTypeList" :key="index" @click="mapTypeClick(index)">
              <div class="bottom-div">{{item.label}}</div>
            </div>
          </div>
        </template>
      </MapMain>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Header from '@/views/components/Header'
import MapMain from '@/views/components/Map'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import Suitability from '@/api/territorialPlanEvaluate/Suitability'
export default {
  name: 'TPEvaluate',
  components: {
    Header,
    MapMain
  },
  mixins: [executeMixin],
  props: [],
  data() {
    return {
      mapStyle: {
        width: '100%'
      },
      district: '中山市', // 镇界选中内容
      districtList: [], // 镇界下拉内容
      // 重点规划区域
      focusDistrict: '中山市',
      focusDistrictList: [
        {
          value: 'zss',
          label: '中山市'
        },
        {
          value: 'hjjd',
          label: '火炬街道'
        },
        {
          value: 'dqjd',
          label: '东区街道'
        },
        {
          value: 'nqjd',
          label: '南区街道'
        },
        {
          value: 'xqjd',
          label: '西区街道'
        },
        {
          value: 'bqjd',
          label: '北区街道'
        }
      ],
      // 一键出图窗口控制
      isPrintMapWinShow: false,
      isDefaultActive: true, // 默认版式
      // 单选内容
      defaultType: '4开',
      defaultList: [
        {
          name: '全开',
          width: 1092,
          height: 787
        },
        {
          name: '对开',
          width: 736,
          height: 520
        },
        {
          name: '4开',
          width: 520,
          height: 368
        },
        {
          name: '8开',
          width: 368,
          height: 260
        },
        {
          name: '16开',
          width: 260,
          height: 184
        },
        {
          name: '32开',
          width: 184,
          height: 130
        }
      ],
      isCustomizeActive: false, // 自定义版式
      inputWidth: null,
      inputHeight: null,
      // 图例展开
      isLegendActive: false,
      legendTitle: '适应分级',
      legendData: [
        {
          colour: '#C78131',
          label: '适宜性高'
        },
        {
          colour: '#E08F29',
          label: '适宜性较高'
        },
        {
          colour: '#F59A23',
          label: '适宜性一般'
        },
        {
          colour: '#FACD91',
          label: '适宜性较低'
        },
        {
          colour: '#CBA985',
          label: '适宜性低'
        }
      ],
      // 地图类型
      mapType: '地图',
      mapTypeList: [
        {
          label: '地图',
          url: require('./images/maptype1.png')
        },
        {
          label: '影像',
          url: require('./images/maptype2.png')
        },
        {
          label: '3D',
          url: require('./images/maptype3.png')
        }
      ]
    }
  },
  computed: {
    getRightPanelWidth() {
      return this.$store.state.territorialPlanEvaluate.rightPanelWidth
    },
    getRightPanelShow() {
      return this.$store.state.territorialPlanEvaluate.rightPanelShow
    },
    getLeftPanelWidth() {
      return this.$store.state.territorialPlanEvaluate.leftPanelWidth
    },
    getLeftPanelShow() {
      return this.$store.state.territorialPlanEvaluate.leftPanelShow
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
    }
  },
  created() { },
  mounted() {
    this.refreshMapStyle()
    this.getabuttalData()
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
    },
    // 后台数据获取--获取中山市所有镇区列表
    getabuttalData() {
      Suitability.getabuttalData().then(res => {
        let arr = [{
          attributes: {
            ZM: '中山市'
          }
        }]
        this.districtList = arr.concat(res.data.features)
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取中山市所有镇区列表失败'
        })
      })
    },
    //中山市区
    onDistrictClick(item, index) {
      this.$store.commit('territorialPlanEvaluate/DistrictStreet', item.attributes.ZM)
      console.log('当前点击为：' + item.attributes.ZM)
      if (item.attributes.ZM === '中山市') {
        this.excuteMapMethod('reductionClick')
        this.$nextTick(() => {
          this.excuteMapMethod('streetLocation', item.attributes.ZM)
        })
        return
      }
      this.excuteMapMethod('highlightRingsFun', item.geometry.rings)
      this.$nextTick(() => {
        this.excuteMapMethod('streetLocation', item.attributes.ZM)
      })
    },
    //重点规划区域
    onFocusDistrictClick(item, index) {
      this.$store.commit('territorialPlanEvaluate/DistrictStreet', item.label)
    },
    // 参数设置方法函数************
    // 默认选中
    onDefaultChange(val) {
      if (val) {
        this.isDefaultActive = val
        this.isCustomizeActive = false
      }
    },
    // 自定义选中
    onCustomizeChange(val) {
      if (val) {
        this.isCustomizeActive = val
        this.isDefaultActive = false
      }
    },
    // 地图打印点击事件
    onPrintClick() {
      // 默认版式
      let width = 0
      let height = 0
      if (this.isDefaultActive) {
        // 判断多少开
        for (let i in this.defaultList) {
          if (this.defaultList[i].name === this.defaultType) {
            console.log('默认版式:长：' + this.defaultList[i].width + '宽：' + this.defaultList[i].height)
            width = this.defaultList[i].width
            height = this.defaultList[i].height
            break
          }
        }
      }
      // 自定义版式
      if (this.isCustomizeActive) {
        // 长度宽度
        console.log('自定义版式: 长：' + this.inputWidth + ' 宽：' + this.inputHeight)
        width = this.inputWidth
        height = this.inputHeight
      }
      this.isPrintMapWinShow = false
      this.excuteMapMethod('suitabilityExportMap', width, height, this.defaultType)
    },
    // 地图类型切换事件
    mapTypeClick(index) {
      let arr = this.mapTypeList[index]
      if (this.mapType === arr.label) {
        return
      }
      this.mapType = arr.label
      this.mapTypeList.splice(index, 1)
      this.mapTypeList.splice(0, 0, arr)
      console.log(this.mapType)
    }
  }

}
</script>
<style lang="scss" scoped>
.TP-evaluate {
  display: flex;
  flex-direction: column;
  position: relative;
  .main-wrapper {
    position: relative;
    flex: 1;
    overflow: hidden;
  }
  .TP-evaluate-map {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    overflow: hidden;
    transition: all 0.3s;
    .TP-evaluate-left {
      position: absolute;
      top: 15px;
      left: 60px;
      line-height: 30px;
      display: flex;
      .left-one {
        width: 161px;
        height: 32px;
        padding: 1px;
        border: 1px solid rgba(93, 125, 236, 1);
        display: flex;
        // background-color: white;
        .left-one-left {
          width: 62px;
          height: 32px;
          background-color: #2b3979;
          color: #ffffff;
        }
        .left-one-right {
          width: 98px;
          height: 32px;
          border-left: 1px solid #5d7dec;
          background-color: #5a6596;
        }
      }
      .left-two {
        margin-left: 20px;
        width: 212px;
        height: 32px;
        padding: 1px;
        border: 1px solid rgba(93, 125, 236, 1);
        // background-color: white;
        display: flex;
        .left-two-left {
          width: 102px;
          height: 32px;
          background-color: #2b3979;
          color: #ffffff;
        }
        .left-two-right {
          width: 109px;
          height: 32px;
          border-left: 1px solid #5d7dec;
          background-color: #5a6596;
        }
      }
    }
    .TP-evaluate-right {
      position: absolute;
      top: 15px;
      right: 100px;
      display: flex;
      line-height: 30px;
      .export-map-btn {
        width: 97px;
        height: 32px;
        padding: 1px;
        border: 1px solid rgba(137, 165, 255, 1);
        div {
          width: 100%;
          height: 100%;
          background-color: #5a6596;
          color: white;
          cursor: pointer;
          &:hover {
            color: aqua;
          }
        }
      }
    }
    .export-map-win {
      width: 410px;
      height: 302px;
      background: white;
      color: #555555;
      border-radius: 5px;
      position: absolute;
      top: 200px;
      right: 300px;
      box-shadow: 0px 2px 5px 5px rgba(49, 49, 49, 0.2);
      .win-top {
        height: 35px;
        padding: 0px 18px;
        background-color: #293c98;
        border-radius: 5px 5px 0px 0px;
        color: white;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        align-items: center;
      }
      .win-content {
        width: calc(100% -50px);
        height: calc(100% - 85px);
        padding: 25px;
        // 默认
        .default-style {
          text-align: left;
          .radio-div {
            padding-left: 15px;
          }
        }
        // 自定义
        .customize-style {
          padding-top: 20px;
          text-align: left;
          .radio-div {
            padding-top: 12px;
            padding-left: 15px;
            display: flex;
            .pl-second {
              padding-left: 40px;
            }
            .customize-input {
              width: 83px;
              margin: 0px 10px;
            }
          }
        }
        // 按钮
        .button-div {
          padding-top: 20px;
          .cancel-btn {
            width: 80px;
            height: 32px;
            background: #e5e5e5;
            color: #666666;
            border-radius: 16px;
          }
          .print-btn {
            width: 80px;
            height: 32px;
            background: #409eff;
            color: white;
            border-radius: 16px;
          }
        }
      }
    }
    // 图例
    .TP-evaluate-legend {
      // width: 200px;
      // height: 150px;
      position: absolute;
      bottom: 55px;
      left: 15px;
      position: relative;
      .legend-button {
        width: 50px;
        height: 35px;
        text-align: center;
        line-height: 35px;
        background-color: #2b3979;
        color: #ffffff;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          color: #409eff;
        }
      }
      .legend-content {
        color: #ffffff;
        background-color: #2b3979;
        // width: 110px;
        // height: 170px;
        position: relative;
        padding: 15px 20px;
        text-align: left;
        .legend-close {
          position: absolute;
          right: 5px;
          top: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .legend-title {
          font-size: 14px;
        }
        .legend-for {
          margin-top: 10px;
          display: flex;
          .legend-colour {
            width: 25px;
            height: 15px;
          }
          span {
            padding-left: 10px;
          }
        }
      }
    }
    .TP-evaluate-map-type {
      position: absolute;
      bottom: 30px;
      right: 20px;
      position: relative;
      display: flex;
      flex-direction: row-reverse;
      .type-style {
        width: 48px;
        height: 45px;
        margin-left: 10px;
        background-color: white;
        border: 1px solid #2b3979;
        color: white;
        cursor: pointer;
        position: relative;
        background-size: contain;
        background-repeat: no-repeat;
      }
      .other-type {
        display: none;
        transition: all 0.5s;
      }
      .frist-type:hover ~ .other-type {
        display: block;
      }
      &:hover > .other-type {
        display: block;
      }
      .frist-type:hover {
        border: 1px solid #409eff;
      }
      .other-type:hover {
        display: block;
        border: 1px solid #409eff;
      }
      .bottom-div {
        position: absolute;
        right: 0;
        bottom: 0;
        padding: 2px;
        background-color: #01a2e8;
        font-size: 12px;
      }
    }
  }
}
</style>
