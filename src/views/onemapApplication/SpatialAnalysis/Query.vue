<template>
  <div class="SA-query">
    <!-- 顶部切换 -->
    <div class="query-top">
      <div v-for="(item,index) in topTypeList" :key="index" :class="{'top-click':(item.orderId===clickType)}" @click="clickType=item.orderId">
        <span>{{item.moduleName}}</span>
        <i class="number-class" v-if="item.orderId===clickType">{{item.num}}</i>
      </div>
    </div>
    <div class="query-content">
      <!-- 主体内容 -->
      <div class="content-body">
        <ScrollDiv>
          <ShowAnalysisBox v-for="(item,index) in ModulesDataList" :key="index" v-show="canShowControl(item.orderId)" ref='module' :moduleData="item"></ShowAnalysisBox>
        </ScrollDiv>
      </div>
      <!-- 底部按钮 -->
      <div class="content-bottom">
        <div class="bottom-title">
          <span>确认分析范围</span>
          <div class="title-button">
            <el-button class="clear-btn" @click="clearRange">清除</el-button>
            <el-button class="result-btn" v-show="haveResult" @click="onToResultClick">结果页</el-button>
          </div>
        </div>
        <div class="bottom-body">
          <el-button class="custom-btn" @click="drawRange">自定义</el-button>
          <el-button class="import-btn" @click="exportFile">导入</el-button>
          <el-input class="use-land-code" v-model="inputCode" placeholder="请输入用地测量编号"></el-input>
        </div>
        <el-button class="query-btn" @click="onQueryClick">执行查询</el-button>
      </div>
      <!-- 隐藏内容 -->
      <!-- 导入内容 -->
      <div class="import-window">
        <import-file ref="importFile"></import-file>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import ShowAnalysisBox from './components/ShowAnalysisBox'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import importFile from './components/importFile'
import SpatialAnalysis from '@/api/SpatialAnalysis'
export default {
  name: 'Query',
  components: {
    ShowAnalysisBox,
    ScrollDiv,
    importFile
  },
  // 混入地图控制
  mixins: [executeMixin],
  props: [],
  data() {
    return {
      clickType: '0', // 顶部选中内容
      haveResult: false, // 查询过结果
      // 顶部分类
      topTypeList: [],
      /*topTypeList: [
        {
          name: '全部',
          type: 'all',
          num: 22
        },
        {
          name: '现状分析',
          type: 'present',
          num: 7
        },
        {
          name: '规划分析',
          type: 'plan',
          num: 7
        },
        {
          name: '管理分析',
          type: 'administration',
          num: 8
        }
      ],*/
      // 后台获取的展示数据
      ModulesDataList: [],
      inputCode: '', // 用地测量编号
      esriGeometryType: ['esriGeometryPoint', 'esriGeometryMultipoint', 'esriGeometryPolyline', 'esriGeometryPolygon', 'esriGeometryEnvelope']
    }
  },
  created() { },
  mounted() {
    this.postAllModulesRelationData()
  },
  methods: {
    // 获取所有分析模型
    postAllModulesRelationData() {
      SpatialAnalysis.postAllModulesRelation().then(res => {
        // console.log('res' + JSON.stringify(res))
        // 1.组织顶部内容
        this.topTypeList = [
          {
            moduleName: '全部',
            moduleId: 'all',
            orderId: '0',
            num: 0
          }
        ]
        let allNum = 0
        // 按照id排序
        res.data.config.module = this.sortByOrderId(res.data.config.module)
        // 添加cheack内容
        for (let i = 0; i < res.data.config.module.length; i++) {
          res.data.config.module[i].num = res.data.config.module[i].module.length
          allNum += res.data.config.module[i].num
          this.topTypeList.push(res.data.config.module[i])
          // 2.添加点击控制参数
          res.data.config.module[i].module.forEach(element => {
            if (element.defaultCheck) {
              // 如果有defaultCheck
              element.isCheck = true
            } else {
              element.isCheck = false
            }
            if (element.module) {
              element.checkList = []
              element.module.forEach(child => {
                if (child.defaultCheck) {
                  // 如果有defaultCheck
                  child.isCheck = true
                  element.checkList.push(child.moduleName)
                } else {
                  child.isCheck = false
                }
              })
            }
          })
        }
        this.topTypeList[0].num = allNum
        // 3.数据保存
        this.ModulesDataList = res.data.config.module
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '获取失败'
        })
      })
    },
    // 根据id排序方法
    sortByOrderId(data) {
      let newData = data
      let retrunData = []
      // 正确的顺序
      for (let i = 1; i < data.length + 1; i++) {
        // 内部顺序
        for (let n = 0; n < data.length; n++) {
          if (i === parseInt(data[n].orderId, 10)) {
            if (data[n].module) {
              data[n].module = this.sortByOrderId(data[n].module)
            }
            retrunData.push(data[n])
          }
        }
      }
      return retrunData
    },
    // 查询按钮点击事件
    onQueryClick() {
      // 如果还没有范围
      if (this.$store.state.onemapApplication.coordinate.length <= 0) {
        this.$message({
          type: 'error',
          message: '分析范围不能为空'
        })
        return
      }
      // 1.获取所有选中内容的moduleId
      let moduleIdList = []
      for (let i = 0; i < this.ModulesDataList.length; i++) {
        let returnArr = this.$refs.module[i].returnCheckData()
        // 合并数组
        moduleIdList = moduleIdList.concat(returnArr)
      }
      if (moduleIdList.length <= 0) {
        this.$message({
          type: 'error',
          message: '分析模型不能为空'
        })
        return
      }
      this.$emit('changLoading', true)
      // console.log('结果内容：', JSON.stringify(moduleIdList))
      // 2.调用后台接口获取数据
      let rings = JSON.parse(this.$store.state.onemapApplication.coordinate)
      let parame = {
        geometryData: {
          hasZ: false,
          hasM: false,
          rings: [rings],
          spatialReference: {
            wkid: 4326
          }
        },
        geometryType: this.esriGeometryType[3],
        moduleId: moduleIdList
      }
      SpatialAnalysis.postAnalyze({ jsonParam: JSON.stringify(parame) }).then(res => {
        // 打开面板
        this.$emit('changeIsShowResult', res.data)
        this.$emit('changLoading', false)
        this.haveResult = true
        // if (res.status) {
        //   console.log('查询结果postAllModulesRelation：', JSON.stringify(res))
        //   // 打开面板
        //   this.$emit('changeIsShowResult', res.data)
        //   this.$emit('changLoading', false)
        //   this.haveResult = true
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: res.message
        //   })
        //   this.$emit('changLoading', false)
        // }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '没有查到数据'
        })
        this.$emit('changLoading', false)
      })
    },
    // 判断分析是否展示
    canShowControl(type) {
      if (this.clickType === '0') {
        return true
      }
      if (this.clickType === type) {
        return true
      } else {
        return false
      }
    },
    // 自定义--绘制范围
    drawRange() {
      // 改变鼠标样式
      document.querySelector('#app').style.cursor = 'crosshair'
      // 关闭导入
      console.log('点击绘制')
      this.excuteMapMethod('drawPolygon')
    },
    // 导入文件
    exportFile() {
      // 打开导入窗口
      this.$refs.importFile.onUploadBtnClick()
      this.excuteMapMethod('removDarwFun')
    },
    // 返回结果页
    onToResultClick() {
      this.$emit('returnResult')
    },
    // 清除所有内容
    clearRange() {
      this.excuteMapMethod('removDarwFun')
      this.haveResult = false
      this.$store.commit('onemapApplication/changeGeometry', '')
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang='scss' scoped>
.SA-query {
  width: 500px;
  height: 100%;
  background-color: #f4f4f4;
  text-align: center;
  .query-top {
    height: 49px;
    line-height: 49px;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #888888;
    border-bottom: 1px solid #e9e9e9;
    div {
      padding: 0px 7px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &:not(:first-child) {
        margin-left: 30px;
      }
      &:hover {
        color: #7882ff;
        height: calc(100% - 3px);
        border-bottom: 3px solid #7882ff;
      }
      .number-class {
        width: 16px;
        height: 16px;
        display: block;
        line-height: 18px;
        background: rgba(120, 130, 255, 1);
        border-radius: 50%;
        margin-left: 5px;
        font-size: 12px;
        padding: 3px;
        color: white;
      }
    }
    .top-click {
      color: #7882ff;
      height: calc(100% - 3px);
      border-bottom: 3px solid #7882ff;
    }
  }
  .query-content {
    margin: 10px 20px 35px 20px;
    width: 458px;
    height: calc(100% - 97px);
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(225, 225, 225, 1);
    border-radius: 8px;
    position: relative;
    .content-body {
      height: calc(100% - 152px);
    }
    .content-bottom {
      height: 120px;
      padding: 16px;
      width: calc(100% - 32px);
      position: absolute;
      bottom: 0;
      background-color: #ededee;
      border-radius: 0px 0px 8px 8px;
      .bottom-title {
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        span {
          color: #293c98;
          font-size: 16px;
        }
        .title-button {
          display: flex;
          .clear-btn {
            width: 66px;
            height: 28px;
            line-height: 28px;
            padding-top: 0px;
            background: rgba(92, 99, 171, 1);
            border-radius: 3px;
            color: white;
          }
          .result-btn {
            width: 66px;
            height: 28px;
            line-height: 28px;
            padding-top: 0px;
            background: rgb(73, 221, 73);
            border-radius: 3px;
            color: white;
          }
        }
      }
      .bottom-body {
        padding: 15px 0px;
        .custom-btn {
          width: 120px;
        }
        .import-btn {
          width: 100px;
        }
        .use-land-code {
          margin-left: 10px;
          width: 180px;
        }
      }
      .query-btn {
        width: 160px;
        height: 36px;
        padding-top: 0px;
        line-height: 36px;
        font-size: 14px;
        background: rgba(255, 180, 0, 1);
        border-radius: 18px;
        color: white;
      }
    }
  }
  .import-window {
    display: none;
  }
}
</style>
