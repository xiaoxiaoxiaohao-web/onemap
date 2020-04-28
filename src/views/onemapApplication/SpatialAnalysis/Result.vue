<template>
  <div class="SA-result">
    <div class="top">
      <!-- 锚点链接内容 -->
      <BlocksTypeSelect @onTypeButtonClick="onTypeButtonClick" @onReturnClick="onReturnClick" :clickType="clickType" :topTypeList="topTypeList"></BlocksTypeSelect>
    </div>
    <!-- <div class="content"> -->
    <!-- 表格内容 -->
    <AnchorScrollPanel class="content" v-model="clickType" :triggerTop="50" :domDatas="data" prop="vueId">
      <ResultTable ref="resultTable" class="table-class" slot-scope="propsData" :data="propsData.data"></ResultTable>
    </AnchorScrollPanel>
    <div class="bottom">
      <el-popover placement="top" width="136" trigger="manual" v-model="visible" popper-class="my-popper">
        <div style="text-align: left; margin: 0" v-show="isShowContorl">
          <el-checkbox-group v-model="checkedTypes" :min="0" :max="3">
            <el-checkbox v-for="(item,index) in topTypeList" :label="item.name" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button slot="reference" class="check-btn" @click="visible = !visible">多屏查看</el-button>
      </el-popover>
      <el-button class="export-btn" @click="onExportResultClick">导出结果</el-button>
    </div>
    <!-- 多屏查看 -->
    <div class="map-spvisible-div" :class="{'all-map-css':!isShowContorl}"  v-show="checkedTypes.length">
      <MapSpvisible :mapList="checkedLayerUrl"></MapSpvisible>
    </div>
  </div>
</template>
<script>
import BlocksTypeSelect from './components/BlocksTypeSelect'
import ResultTable from './components/ResultTable'
import MapSpvisible from './components/MapSpvisible'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import SpatialAnalysis from '@/api/SpatialAnalysis'
import AnchorScrollPanel from '@/components/AnchorScrollPanel'
export default {
  name: 'Result',
  components: {
    BlocksTypeSelect,
    ResultTable,
    MapSpvisible,
    AnchorScrollPanel
  },
  mixins: [executeMixin],
  props: {
    data: {
      type: Array
    },
    isShowContorl: {
      type: Boolean
    }
  },
  data() {
    return {
      clickType: '', // 顶部选中内容
      // 顶部分类
      /*topTypeList: [
        {
          name: '地类现状',
          type: 'dlxz'
        },
        {
          name: '耕地',
          type: 'gd'
        },
        {
          name: '土地用途',
          type: 'tdyt'
        },
        {
          name: '基本农田',
          type: 'jbnt'
        },
        {
          name: '建设用地管制',
          type: 'jsydgz'
        },
        {
          name: '城乡规划',
          type: 'cxgh'
        },
        {
          name: '已批用地',
          type: 'ypyd'
        },
        {
          name: '预审用地',
          type: 'ysyd'
        }
      ],*/
      topTypeList: [],
      visible: false, // 分屏选择展示控制
      checkedTypes: [], // 当前选中内容名称
      checkedLayerUrl: [], // 当前选中内容
      refreshTable: false // 表格刷新
    }
  },
  created() { },
  mounted() {
    this.handleData(this.data)
  },
  // activated () {
  //   this.$nextTick
  // },
  methods: {
    // 处理获取的数据
    handleData(data) {
      this.topTypeList = []
      for (let i = 0; i < data.length; i++) {
        let newObj = {
          name: data[i].heard,
          type: data[i].vueId,
          layerUrl: data[i].layerUrl
        }
        this.topTypeList.push(newObj)
        // 顶部内容默认选中第一个
        if (i === 0) {
          this.$nextTick(() => {
            this.clickType = data[i].vueId
          })
        }
        // 分屏控制
        this.visible = false
        this.checkedTypes = []
      }
    },
    // 返回按钮点击事件
    onReturnClick() {
      this.$emit('changeIsShowResult', false)
      this.visible = false
    },
    // 表格类型锚点选择
    onTypeButtonClick(type) {
      this.clickType = type
    },
    // 导出按钮点击事件
    onExportResultClick() {
      console.log('导出按钮点击事件')
      // 1.组织数据结构
      let jsonParam = {}
      this.data.forEach(element => {
        // 去掉rings部分
        let features = []
        for (let i in element.tableObj.tableDataList) {
          let obj = {
            attributes: element.tableObj.tableDataList[i].attributes
          }
          features.push(obj)
        }
        let newObj = {
          module: {
            moduleResultName: element.title,
            conclusion: element.conclusion
          },
          resultJsonObj: {
            features: features,
            fieldAliases: element.fieldAliases
          }
        }
        jsonParam[element.vueId] = newObj
      })
      // console.log('组织的内容:', JSON.stringify(jsonParam))
      SpatialAnalysis.exportResult({ jsonParam: JSON.stringify(jsonParam) }).then(res => {
        // console.log('导出结果：' + res)
        this.downloadFile(res, 'resultOfAnalyze.xls')
      })
    },
    // 保存文件流数据为文件
    downloadFile(data, fileName) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data]))
      // 模拟A标签点击事件
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  },
  computed: {},
  watch: {
    checkedTypes: {
      handler(newVal, oldVal) {
        this.checkedLayerUrl = []
        // console.log('选择多屏：' + JSON.stringify(newVal))
        for (let n = 0; n < newVal.length; n++) {
          for (let i = 0; i < this.data.length; i++) {
            if (newVal[n] === this.data[i].heard) {
              let obj = {
                layerUrl: this.data[i].layerUrl,
                title: this.data[i].heard
              }
              this.checkedLayerUrl.push(obj)
              break
            }
          }
        }
        console.log('多屏结果：' + JSON.stringify(this.checkedLayerUrl))
      },
      deep: true
    },
    isShowContorl(val) {
      // 如果收缩控制、并且内容展开，则收缩内容
      if (!val && this.visible) {
        this.visible = false
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.SA-result {
  width: 845px;
  height: 100%;
  position: relative;
  background-color: #f4f4f4;
  .top {
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #e1e1e1;
    padding: 0px 20px;
    display: flex;
    justify-content: space-between;
    background-color: white;
    width: calc(100% - 40px);
  }
  .content {
    height: calc(100% - 165px);
    width: calc(100% - 40px);
    margin: 0px 10px 10px 10px;
    padding: 0px 10px 10px 15px;
    // overflow-x: hidden;
    overflow: auto;
    transition: all 0.5s;
    div:not(:first-child) {
      margin-top: 15px;
    }
  }
  .bottom {
    height: 90px;
    line-height: 40px;
    display: flex;
    justify-content: center;
    font-size: 14px;
    .check-btn {
      width: 160px;
      height: 40px;
      padding: 0;
      background: #5d7dec;
      border-radius: 20px;
      color: white;
    }
    .export-btn {
      width: 160px;
      height: 40px;
      padding: 0;
      background: #35c3cd;
      border-radius: 20px;
      margin-left: 40px;
      color: white;
    }
  }
  .map-spvisible-div {
    width: calc(100vw - 845px);
    height: 100%;
    position: absolute;
    top: 0;
    right: 845px;
    background-color: white;
    box-shadow: -4px 4px 4px rgba(202, 198, 212, 0.4) inset;
    transition: all 0.3s;
  }
  .all-map-css {
    width: 100vw;
  }
}
</style>
