<template>
  <div>
    <div class="toolbar-body">
      <div class="toolbar" ref="toolbarRef" :class="{'toolbar-more':isShowName}">
        <div class="toolbar-top">
          <span v-show="isShowName">工具箱</span>
          <i class="cursor-pointer" :class="isShowName?'el-icon-d-arrow-right':'el-icon-d-arrow-left'" @click="onShrinkClick"></i>
        </div>
        <div class="toolbar-content">
          <!-- 数据清除 -->
          <div slot="reference" class="content-div" :class="{'click-small':nowClickId === toolbarList[0].index}" :title="toolbarList[0].name" @click="cleanData">
            <i :class="toolbarList[0].icon"></i>
            <span v-show="isShowName">{{toolbarList[0].name}}</span>
          </div>
          <!-- 属性查询 -->
          <!-- <el-popover placement="left" width="100" trigger="manual" v-model="queryType">
            <el-button @click="queryPoint">点选</el-button>
            <el-button @click="queryRange">框选</el-button>
            <div slot="reference" class="content-div" :class="{'click-small':nowClickId === toolbarList[1].index}" :title="toolbarList[1].name" @click="queryType = !queryType">
              <i :class="toolbarList[1].icon"></i>
              <span v-show="isShowName">{{toolbarList[1].name}}</span>
            </div>
          </el-popover> -->
          <!-- 长度测量 -->
          <div slot="reference" class="content-div" :class="{'click-small':nowClickId === toolbarList[2].index}" :title="toolbarList[2].name" @click="measureDistance">
            <i :class="toolbarList[2].icon"></i>
            <span v-show="isShowName">{{toolbarList[2].name}}</span>
          </div>
          <!-- 面积测量 -->
          <div slot="reference" class="content-div" :class="{'click-small':nowClickId === toolbarList[3].index}" :title="toolbarList[3].name" @click="measureArea">
            <i :class="toolbarList[3].icon"></i>
            <span v-show="isShowName">{{toolbarList[3].name}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import executeMixin from '@/views/components/Map/mixin/executeMixin'
export default {
  name: 'Toolbar',
  mixins: [executeMixin],
  components: {},
  props: [],
  data() {
    return {
      isShowName: false, // 默认隐藏名称
      nowClickId: -1, // 当前选中
      toolbarList: [
        {
          name: '数据清除',
          icon: 'icon-QC',
          id: 0
        },
        {
          name: '属性查询',
          icon: 'icon-SX',
          id: 1
        },
        {
          name: '距离测量',
          icon: 'icon-JL',
          id: 2
        },
        {
          name: '面积测量',
          icon: 'icon-MJ',
          id: 3
        },
        {
          name: '数据定位',
          icon: 'icon-DW',
          id: 4
        }
      ],
      screenNum: null,
      queryType: false,
      // distanceMeasurementControl: false,
      // areaMeasurementControl: false,
      X: null,
      Y: null
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 收缩事件
    onShrinkClick() {
      this.isShowName = !this.isShowName
    },
    // 数据清除
    cleanData() {
      this.excuteMapMethod('removeMeasure')
      // this.areaMeasurementControl = false
      // this.distanceMeasurementControl = false
    },
    // 属性查询
    queryAttribute() {
      this.queryType = !this.queryType
    },
    queryPoint() {
      this.excuteMapMethod('clickQuery')
    },
    queryRange() {
      this.excuteMapMethod('queryRange')
    },
    // 距离测量
    measureDistance() {
      // this.distanceMeasurementControl = !this.distanceMeasurementControl
      // if (this.distanceMeasurementControl) {
      //   this.excuteMapMethod('addDistanceMeasure')
      // } else {
      //   this.excuteMapMethod('removeMeasure')
      // }
      this.excuteMapMethod('removeMeasure')
      this.excuteMapMethod('addDistanceMeasure')
    },
    // 面积测量
    measureArea() {
      // this.areaMeasurementControl = !this.areaMeasurementControl
      // if (this.areaMeasurementControl) {
      //   this.excuteMapMethod('addAreaMeasure')
      // } else {
      //   this.excuteMapMethod('removeMeasure')
      // }
      this.excuteMapMethod('removeMeasure')
      this.excuteMapMethod('addAreaMeasure')
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang='scss' scoped>
.toolbar-body {
  float: right;
  .toolbar {
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    position: relative;
    font-size: 14px;
    white-space: nowrap;
    width: 60px;
    transition: all 0.3s;
    overflow: hidden;
    // 展示全部
    &.toolbar-more {
      width: 129px;
    }
    .toolbar-top {
      height: 10px;
      padding: 13px 24px 13px 24px;
      font-size: 14px;
      background: rgba(41, 60, 152, 1);
      border-radius: 5px 5px 0px 0px;
      color: white;
      span {
        padding-right: 30px;
      }
    }
    .toolbar-content {
      padding: 10px;
      font-size: 16px;
      .content-div {
        padding: 10px 0px;
        cursor: pointer;
        &:hover {
          background: #21bdca;
          border-radius: 5px 0px 5px 0px;
          color: white;
        }
        &:not(:first-child) {
          margin-top: 10px;
        }
        span {
          font-size: 14px;
          padding-left: 5px;
        }
        i {
          vertical-align: middle;
        }
      }
      // 点击状态样式
      .click-small {
        background: #21bdca;
        border-radius: 5px 0px 5px 0px;
        color: white;
      }
    }
  }
}
</style>
