<template>
  <div class="query-panel-result">
    <div class="Query-noData" v-if="dataShow === true">
      <p>
        <img src="./Aside/QueryPanel/QueryImg/noData.png" alt="">
      </p>
    </div>
    <div class="query-panel-resultCont">
      <ul class="query-panel-resultUL">
        <li class="cursor-pointer" v-for="(item,index) in displayArr" :key="index" @click="showItem(item, fieldAliases)" :class="{'onCheckedStyle':clickId === item.id }">
          <div class="query-panelList clear-fix">
            <p class="query-panelBorder">{{item.id+1}}</p>
            <!-- <p class="query-panelTitle" :title="item.attributes.CASENAME || item.attributes.XMMC">{{item.attributes.CASENAME || item.attributes.XMMC}}</p> -->
            <!-- 规划查询结果展示 -->
            <template v-if="templateShow === '规划'">
              <p class="query-panelTitle no-select" v-if="item.attributes.layerAlias==='总体规划'" :title="item.attributes.YDXZ ">{{item.attributes.YDXZ}}</p>
              <!-- 规划查询结果展示(土地利用现状) -->
              <p class="query-panelTitle no-select" v-if="item.attributes.layerAlias==='土地利用（规划编制）'" :title="item.attributes.YT ">{{item.attributes.YT}}</p>
              <!-- 规划查询结果展示(三调成果) -->
              <p class="query-panelTitle no-select" v-if="item.attributes.layerAlias==='三调成果'" :title="item.attributes.DLMC ">{{item.attributes.DLMC }}</p>
              <!-- 规划查询结果展示(地籍数据) -->
              <p class="query-panelTitle no-select" v-if="item.attributes.layerAlias==='地籍'" :title="item.attributes.YBZDDM ">{{item.attributes.YBZDDM }}</p>
            </template>

            <!-- 地点查询结果展示 -->
            <p class="query-panelTitle no-select" v-show="templateShow === '地点查询'" :title="item.attributes.name || item.attributes.address">{{item.attributes.name || item.attributes.address}}</p>

            <!-- 专题查询结果展示 -->
            <p class="query-panelTitle no-select" v-show="templateShow === '专题查询'" :title="item.attributes['建材市场'] || item.attributes['小区名'] || item.attributes['近期'] || item.attributes['已完成'] || item.attributes['OBJECTID']  ">{{item.attributes['建材市场'] || item.attributes['小区名'] || item.attributes['近期'] || item.attributes['已完成'] || item.attributes['OBJECTID']}}</p>

          </div>
          <div class="query-panelListBottom clear-fix">
            <!-- <p class="query-panelSort" :title="item.attributes.layerAlias">业务类型:{{item.attributes.layerAlias}}</p> -->
            <!-- 规划查询结果展示 -->
            <template v-if="templateShow === '规划'">
              <p class="query-panelSort no-select" v-if="item.attributes.layerAlias==='总体规划'" :title="item.attributes.YSMC">要素名称:{{item.attributes.YSMC}}</p>
              <!-- 规划查询结果展示(土地利用现状) -->
              <p class="query-panelSort no-select" v-if="item.attributes.layerAlias==='土地利用（规划编制）'" :title="item.attributes.YBZDDM">编码:{{item.attributes.YBZDDM}}</p>
              <!-- 规划查询结果展示(三调成果) -->
              <p class="query-panelSort no-select" v-if="item.attributes.layerAlias==='三调成果'" :title="item.attributes.QSDWMC">名称:{{item.attributes.QSDWMC}}</p>
              <!-- 规划查询结果展示(地籍数据) -->
              <p class="query-panelSort no-select" v-if="item.attributes.layerAlias==='地籍'" :title="item.attributes.DLMC">地类名称:{{item.attributes.DLMC}}</p>
            </template>

            <!-- 地点查询结果展示 -->
            <p class="query-panelSort no-select" v-show="templateShow === '地点查询'" :title="item.attributes.address">地址:{{item.attributes.address}}</p>

            <!-- 专题查询结果展示 -->
            <template v-if="templateShow === '专题查询'">
              <p class="query-panelSort no-select" v-if="item.attributes['材质']" :title="item.attributes['材质']">材质:{{item.attributes['材质']}}</p>
              <p class="query-panelSort no-select" v-else :title="item.attributes['坐落'] || item.attributes['地址']">地址:{{item.attributes['坐落'] || item.attributes['地址']}}</p>
            </template>

          </div>
        </li>
      </ul>
      <div class="paginationPage">
        <el-pagination layout="prev, pager, next" :total="totalNum" :page-size="Evrypage" :current-page.sync="currentPage" @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
    <div class="query-panel-record">
      <div class="clear-fix">
        <p>共<span>{{totalNum}}</span><span v-show="maxNumShow">+</span>条</p>
        <p>,</p>
        <p class="query-panel-recordPage"><span>{{maxPageNum}}</span><span v-show="maxNumShow">+</span>页</p>
      </div>
    </div>
    <div class="query-panel-choose">
      <el-popover ref="popover" placement="center" height="100" v-model="visible">
        <div class="query-panel-chooseCont">
          <p class="type">请选择导出类型</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="primary" @click="Excel('excel')">Excel</el-button>
            <!-- <el-button type="primary" size="mini" @click="Shp('shp')">Shp</el-button> -->
          </div>
        </div>
      </el-popover>
    </div>
    <div class="query-panel-footer">
      <div class="clear-fix">
        <button class="query-panel-footerBack cursor-pointer" @click="onBackClick">返回</button>
        <button class="query-panel-footerExcu cursor-pointer" :class="{'noUse':isdisabledFn === true}" :disabled="isdisabledFn" v-popover:popover>导出</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { queryResultExport, queryAddrResultExport } from '@/api/publicQuery'
import { arcgisToGeoJSON } from '@esri/arcgis-to-geojson-utils'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
export default {
  name: 'QueryPanelResult',
  mixins: [executeMixin],
  components: {
  },
  props: [],
  data() {
    return {
      templateShow: '',
      dataShow: false, //没有数据效果
      currentPage: 1, //当前页
      totalNum: 0, //总数据
      maxNumShow: false, //条数的+号是否显示
      Evrypage: 20, //每一页的数据
      maxPageNum: 0, //一共多少页
      showArr: [], //后台数据分割后的数据push到showarr数组
      displayArr: [], //展示当前页的数据
      clickId: '', //点击的时候的id
      visible: false, //elementui组件自带的
      fileType: '', //导出的时候后台要的类型
      exportCondition: '', //导出的时候后台要的条件
      deepCopyObj: {}, //深拷贝到下载
      fieldAliases: {},
      isdisabledFn: false, //不禁用
      showName: ''

    }
  },
  computed: {
    ...mapState({
      //查询回来的结果
      getQueryRealutDataVal: state => state.onemapApplication.getQueryRealutVal,
      //查询回来要excel/shp的结果
      getQueryExportObjectVal: state => state.onemapApplication.getQueryExportObjectVal,
      //vuex里获取默认QueryList的选中的文字
      getQueryResultCustomVal: state => state.onemapApplication.getQueryResultCustomVal,
      getStateResultShow: state => state.onemapApplication.setStateResultShow,
      getpublicQueryPicNameVal: state => state.onemapApplication.publicQueryPicLastNameVal
    })
  },
  watch: {
    //规划查询和地点查询切换
    getStateResultShow(newVal, oldVal) {
      this.showName = newVal
      if (this.showName === '规划查询') {
        this.templateShow = '规划'
      } else if (this.showName === '地点查询') {
        this.templateShow = newVal
      } else {
        this.templateShow = '专题查询'
      }
    },
    //图层名字
    getpublicQueryPicNameVal(newVal, oldVal) {
      if (this.showName === '规划查询') {
        if (newVal === '土地利用（规划编制）') {
          this.templateShow = ''
        } else if (newVal === '三调成果') {
          this.templateShow = ''
        } else {
          this.templateShow = '规划'
        }
      }
    },
    //监听查询回来的结果
    getQueryRealutDataVal(val) {
      this.maxNumShow = false
      if (val && val.features) {
        if (val.features.length !== 0) {
          this.fieldAliases = val.fieldAliases
          this.dataShow = false
          this.isdisabledFn = false
          this.showArr = []
          for (let j = 0; j < val.features.length; j++) {
            val.features[j]['id'] = j
            val.features[j].attributes['layerAlias'] = this.getQueryResultCustomVal
          }
          this.maxPageNum = Math.ceil(val.features.length / this.Evrypage)
          this.totalNum = val.features.length
          if (this.totalNum > 999) {
            this.totalNum = 999
            this.maxNumShow = true
          }
          for (let i = 0; i < this.maxPageNum; i++) {
            let len = this.Evrypage
            let strat = i * len
            let end = strat + len
            this.showArr.push(val.features.slice(strat, end))
          }
          this.displayArr = this.showArr[0]
        } else {
          this.displayArr = []
          this.dataShow = true
          this.isdisabledFn = true
        }
      } else {
        this.displayArr = []
        this.dataShow = true
        this.isdisabledFn = true
      }
    }
  },
  created() { },
  mounted() {

  },
  activated() {
  },
  methods: {
    //返回
    onBackClick() {
      this.$store.commit('onemapApplication/setOnemapRightPanelShow', false)
    },
    //点击当前第几页
    handleCurrentChange(currentPage) {
      this.showArr = this.deepCopy(this.showArr)
      this.displayArr = []
      this.displayArr = this.showArr[currentPage - 1]
    },
    //深拷贝
    deepCopy(obj) {
      var result = Array.isArray(obj) ? [] : {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = this.deepCopy(obj[key]) //递归复制
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    //导出excel
    Excel(arg) {
      this.deepCopyObj = {}
      this.deepCopyObj = this.deepCopy(this.getQueryExportObjectVal)
      this.visible = false
      this.fileType = arg
      for (let i in this.deepCopyObj.features) {
        // 删除新增的属性
        delete this.deepCopyObj.features[i].attributes.layerAlias
      }
      this.exportCondition = `{"fileType":"excel","data":"${JSON.stringify(this.deepCopyObj)}"}`
      let param = {
        exportResult: this.exportCondition
      }
      this.queryEduce(param)
    },
    //导出shp
    // Shp(arg) {
    //   this.deepCopyObj = {}
    //   this.deepCopyObj = this.deepCopy(this.getQueryExportObjectVal)
    //   this.visible = false
    //   this.fileType = arg
    //   for (let i in this.deepCopyObj.features) {
    //     // 删除新增的属性
    //     delete this.deepCopyObj.features[i].attributes.layerAlias
    //   }
    //   this.exportCondition = `{"fileType":"shp","data":${JSON.stringify(arcgisToGeoJSON(this.deepCopyObj))}}`
    //   let param = {
    //     exportResult: this.exportCondition
    //   }
    //   this.queryEduce(param)
    // },
    //导出文件的下载
    queryEduce(param) {
      if (this.stateShow) { //规划导出
        queryResultExport(param).then(res => {
          let url = res.data
          window.open(url)
        })
      } else { //地址导出
        queryAddrResultExport(param).then(res => {
          let url = res.data
          window.open(url)
        })
      }
    },
    showItem(item, fieldAliases) {
      this.clickId = item.id
      this.excuteMapMethod('showResultItem', item, fieldAliases)
    }
  }

}
</script>
<style lang='scss' scoped>
.query-panel-result {
  z-index: 99;
  height: 100%;
  width: 370px;
  background-color: white;
  position: relative;
  overflow: hidden;
}
.query-panel-resultCont {
  margin: 20px 5% 0 5%;
  height: 86%;
  border: 1px solid rgba(225, 225, 225, 1);
  border-radius: 8px;
  position: relative;
  .query-panel-resultUL {
    height: 94%;
    li {
      &.onCheckedStyle {
        background: #d1eafc;
        border-radius: 4px;
      }
      &:hover {
        background: #d1eafc;
        border-radius: 4px;
      }
    }
  }
}
.query-panel-resultUL {
  overflow-y: auto;
  li {
    padding: 15px 10px;
  }
  &::-webkit-scrollbar {
    height: 1px;
    background: #e1e1e1;
  }
  &::-webkit-scrollbar-thumb {
    background: #bbbbbb;
    border-radius: 10px;
  }
}
.paginationPage {
  position: absolute;
  width: 100%;
  bottom: 7px;
  text-align: center;
}
.query-panel-record {
  margin-top: 10px;
  padding-left: 5%;
  & > div {
    p {
      float: left;
      font-size: 14px;
      font-family: 'Microsoft YaHei';
      color: rgba(149, 150, 150, 1);
    }
  }
}
.query-panel-recordPage {
  margin-left: 3%;
}
.query-panel-footer {
  position: absolute;
  width: 100%;
  bottom: 30px;
  & > div {
    width: 100%;
  }
  button {
    float: left;
  }
}
button {
  margin: 0 0 0 12%;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  color: white;
}
.query-panel-choose {
  .query-panel-chooseCont {
    height: 100px;
  }
  .type {
    text-align: center;
    padding: 10px;
    & + div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }
  }
}
.query-panel-footerBack {
  width: 120px;
  height: 36px;
  background: rgba(93, 125, 236, 1);
  opacity: 0.5;
  border-radius: 18px;
}
.query-panel-footerExcu {
  width: 120px;
  height: 36px;
  background: rgba(92, 99, 171, 1);
  border-radius: 18px;
}
.query-panel-footerExcu.noUse {
  cursor: not-allowed;
}
.query-panelListBottom {
  margin-top: 10px;
}
.query-panelList {
  p {
    float: left;
  }
}
.query-panelBorder {
  padding: 2px 5px;
  background: rgba(139, 133, 255, 1);
  border-radius: 4px;
  margin-right: 6px;
  color: white;
}
.query-panelTitle {
  width: 80%;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  text-align: left;
  color: rgba(85, 85, 85, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.query-panelSort {
  width: 70%;
  margin-left: 33px;
  font-size: 14px;
  text-align: left;
  font-family: 'Microsoft YaHei';
  color: rgba(128, 128, 128, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.Query-noData {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
