<!--
 * @Description: 导出数据、、地图图片pdf
 * @Author: ljl
 * @Date: 2019-08-30 09:34:04
 -->
<template>
  <div class="export-map" cid="exportMap" id="exportMapId">
    <div class="top-title">
      <div class="top-input">
        <!-- 点击导出后输入框变成文本 -->
        <el-input v-model="titleName" placeholder="请输入标题" v-show="!isExportType"></el-input>
        <span v-show="isExportType">{{titleName}}</span>
      </div>
      <div class="top-div">
        <span>图幅号：{{mapNumber}}(1:10000标准分幅)</span>
      </div>
    </div>
    <div class="body-map">
      <div class="map-div">
        <map-view ref="mapView"></map-view>
      </div>
    </div>
    <div class="bottom-div">
      <div class="bottom-top">
        <div class="bottom-top-input-div">
          <!-- 点击导出后输入框变成文本 -->
          <span>制图员：</span>
          <el-input v-model="makerName" placeholder="请输入制图员名称" v-show="!isExportType"></el-input>
          <span v-show="isExportType">{{makerName}}</span>
        </div>
        <div>
          <span>1:10000</span>
        </div>
        <div>
          <span>制图单位:中山市基础地理信息中心</span>
        </div>
      </div>
      <div class="bottom-bottom">
        <div>制图日期：{{createDate}}</div>
        <div>盖章单位：中山市自然自然局</div>
      </div>
    </div>
  </div>
</template>
<script>
import { elToImg, elToPdf } from '@/utils/exportUtil'
import mapView from './mapView'
export default {
  name: 'exportMap',
  components: {
    mapView
  },
  props: [],
  data() {
    return {
      titleName: '', // 标题
      mapNumber: 'F49G032084', // 图幅号
      makerName: '', // 制图员
      createDate: '', // 创建时间
      // 导出控制
      isExportType: false
    }
  },
  created() { },
  mounted() {
    this.getTime()
  },
  methods: {
    // 获取时间年月日
    getTime() {
      let getTime = new Date()
      let year = getTime.getFullYear()
      let month = getTime.getMonth() + 1
      let date = getTime.getDate()
      this.createDate = year + '年' + month + '月' + date + '日'
    },
    // 导出控制
    onExportChange(callback) {
      console.log('导出控制')
      this.isExportType = true
      // 2.导出图片
      this.$nextTick(() => {
        // 先打印地图成图片、加载后导出
        this.$refs.mapView.exportMap(() => {
          this.exportMapFun('jpg')
          // 还原输入框内容
          this.titleName = ''
          this.makerName = ''
          this.isExportType = false
          callback()
        })
      })
    },
    // 导出图片
    exportMapFun(type) {
      let htmlElement = document.querySelector('#exportMapId')
      switch (type) {
        case 'jpg':
          elToImg(htmlElement, 'test.jpg')
          break
        case 'png':
          elToImg(htmlElement, 'test.png')
          break
        case 'pdf':
          elToPdf(htmlElement, 'test.pdf')
          break
      }
    }
  },
  computed: {},
  watch: {}
}
</script>
<style scoped>
.export-map {
  width: 100%;
  height: 100%;
}
/* 顶部标题 */
.top-title {
  padding: 10px 50px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
}
.top-input {
  margin: left;
  /* width: 200px; */
  text-align: left;
}
/* 地图部分 */
.body-map {
  height: calc(100% - 130px);
  padding: 0px 40px;
  background: white;
}
.map-div {
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  border: 1px solid black;
}
/* 底部内容 */
.bottom-div {
  padding: 10px 50px;
  height: 50px;
}
.bottom-top {
  display: flex;
  justify-content: space-between;
}
.bottom-bottom {
  display: flex;
  justify-content: space-between;
}
</style>
