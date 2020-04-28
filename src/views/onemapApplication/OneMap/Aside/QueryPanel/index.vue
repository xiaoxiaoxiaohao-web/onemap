<!--
 * @Description: 查询面板
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 -->
<template>
  <div class="QueryPanel">
    <Loading :isLoading="loadShow" />
    <div class="query-panel">

      <div class="query-panel-box clear-fix">
        <div class="publicQuery-title cursor-pointer no-select" v-for="(item,index) in tabList" :key="index" @click="onTabClick(index)">
          <div :class="{'active':inde===item.id}">{{item.title}}</div>
        </div>
      </div>

      <div class="query-panelCont">
        <ScrollDiv>
          <QueryList :QueryList="getListData" ref="QueryList" />
          <!-- <QueryTime @funcTime="getTimeFormSon" v-show="QueryTimeShow" /> -->
          <QueryArea ref="QueryArea" :QueryArea="getAreaData" @funcArea="getAreaFormSon" />
          <QueryHand ref="QueryHand" :QueryHandList="getHandData" @funcHand="getHandFormSon" @keyWordHand="getKeyWord" @selectFieldHand="getSelectFieldHand" @onCoexistClick="onCoexistClick" />
        </ScrollDiv>
      </div>

      <div class="QuerySearch" @click="onQueryClick">
        <button>查询</button>
      </div>

    </div>
  </div>
</template>
<script>
//规划查询
import QueryList from './QueryList'
// import QueryTime from './QueryTime'
import QueryArea from './QueryArea'
//公共部分
import QueryHand from './QueryHand'
import { publicQuery, queryResult, publicAddrQuery, queryAddrResult, publicSpecialQuery, querySpelicResult } from '@/api/publicQuery'
import { type } from 'os'
import Loading from '@/components/Loading'
import ScrollDiv from '@/components/Div/ScrollDiv'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
export default {
  name: 'QueryPanel',
  components: {
    QueryList,
    // QueryTime,
    QueryArea,
    QueryHand,
    Loading,
    ScrollDiv
  },
  mixins: [executeMixin],
  props: [],
  data() {
    return {
      loadShow: false,
      getUserId: '', //获取用户id
      getListData: [], //初始化传递给QueryList组件的数据
      getAreaData: [], //初始化传递给QueryArea组件的数据
      getHandData: [], //初始化传递给QueryHand组件的数据
      msgFromTimeSon: [], //点击查询时查询条件里的时间
      ismsgFromTimeSon: '', //点击查询时判断查询条件里的是否有时间的标志
      msgFromAreaSon: [], //点击查询时查询条件里的区域
      ismsgFromAreaSon: [], //点击查询时判断查询条件里的是否有区域的标志
      defaultHandSon: [], //点击查询时查询条件里的默认
      msgFromHandSon: [], //点击查询时查询条件里的自定义
      keyWord: '', //搜索关键字
      isCoexist: '', //判断是否在高级搜索
      queryCondition: '',
      getUrl: '', //QueryList组件点击不同的选项对应不同的url的值
      getQueryListField: {}, //QueryList组件点击不同的选项对应不同的条件(年份,区域)字段的值
      getYearField: '', //年份字段
      getAreaField: '', //区域字段
      geoMetry: '', // 默认必须双引号
      tabList: [
        {
          'title': '规划查询',
          'id': 0
        },
        {
          'title': '地点查询',
          'id': 1
        },
        {
          'title': '专题查询',
          'id': 2
        }
      ],
      inde: 0,
      QueryTimeShow: true,
      getFileds: ''
    }
  },
  computed: {
    getQueryHandUrlData() {
      //时时刻刻获取vuex里的onemapApplication文件里的url(页面初始化默认传QueryList组件的第一个url)
      return this.$store.state.onemapApplication.getQueryHandUrl
    },
    getpublicQueryPicNameVal() {
      return this.$store.state.onemapApplication.publicQueryPicNameVal
    },
    getQueryRealutStainVal() {
      return this.$store.state.onemapApplication.getQueryRealutStainVal
    },
    publicQueryResultField() {
      return this.$store.state.onemapApplication.getQueryField
    },
    getcoordinate() {
      return this.$store.state.onemapApplication.coordinate
    }
  },
  watch: {
    getQueryHandUrlData(newVal) {
      //时时刻刻监听url的改变(因为在QueryList组件点击时,选中不同会传不同的url)
      this.getUrl = newVal
    },
    getQueryRealutStainVal(newVal) {
      this.loadShow = false
    },
    publicQueryResultField(newVal) {
      this.getQueryListField = {}
      this.getQueryListField = newVal
      this.getYearField = this.getQueryListField.yearField
      this.getAreaField = this.getQueryListField.zoneField
    },
    getcoordinate(newVal) {
      if (newVal.length !== 0) {
        let geo = '{"spatialReference": {"wkid": 2381 },'
        geo += '"rings":[' + newVal + ']}'
        this.geoMetry = geo
        console.log(this.geoMetry)
      } else {
        this.geoMetry = ''
      }
    }
  },
  created() {

  },
  mounted() {
    //初始化调后台的接口
    if (this.$store.state.global.userinfo.userId) {
      this.onQueryInit(this.$store.state.global.userinfo.userId)
    } else {
      this.onQueryInit('')
    }
  },
  methods: {
    onTabClick(index) {
      this.inde = index
      this.QueryTimeShow = true
      this.$refs.QueryList.onClearnZeroClick()
      this.excuteMapMethod('removDarwFun') //清空绘制线
      if (index === 1) {
        //地点查询
        this.QueryTimeShow = false
        this.$refs.QueryHand.onAdvancedFalseClick()
        this.$refs.QueryArea.onAreaTrueClick()
        if (this.$store.state.global.userinfo.userId) {
          this.onAddrQueryInit(this.$store.state.global.userinfo.userId)
        } else {
          this.onAddrQueryInit('')
        }
      } else if (index === 0) {
        //规划查询
        this.$refs.QueryHand.onAdvancedTrueClick()
        this.$refs.QueryArea.onAreaFalseClick()
        if (this.$store.state.global.userinfo.userId) {
          this.onQueryInit(this.$store.state.global.userinfo.userId)
        } else {
          this.onQueryInit('')
        }
      } else {
        //专题查询
        this.$refs.QueryHand.onSpecialAdvancedTrueClick()
        this.$refs.QueryArea.onSpecilFalseClick()
        if (this.$store.state.global.userinfo.userId) {
          this.onSpecialQueryInit(this.$store.state.global.userinfo.userId)
        } else {
          this.onSpecialQueryInit('')
        }
      }
    },
    //初始化调后台的接口的方法(规划查询)
    onQueryInit(userId) {
      let params = {
        userId: userId
      }
      publicQuery(params).then(res => {
        //因为后台把数据全部给了,而且不同的组件都要用,而且每个组件有不同的需求,所以每个组件拷贝一个数据(深拷贝)
        this.getListData = []
        this.getAreaData = []
        this.getAddrHandData = []
        this.getListData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getAreaData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getHandData = this.deepCopy(JSON.parse(res.data).layers.layer)
      }).catch((error) => {
        console.log(error)
      })
    },
    //初始化调后台的接口的方法(地点查询)
    onAddrQueryInit(userId) {
      let params = {
        userId: userId
      }
      publicAddrQuery(params).then(res => {
        //因为后台把数据全部给了,而且不同的组件都要用,而且每个组件有不同的需求,所以每个组件拷贝一个数据(深拷贝)
        this.getListData = []
        this.getAreaData = []
        this.getAddrHandData = []
        this.getListData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getAreaData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getAddrHandData = this.deepCopy(JSON.parse(res.data).layers.layer)
      }).catch((error) => {
        console.log(error)
      })
    },
    //初始化调后台的接口的方法(专题查询)
    onSpecialQueryInit(userId) {
      let params = {
        userId: userId
      }
      publicSpecialQuery(params).then(res => {
        //因为后台把数据全部给了,而且不同的组件都要用,而且每个组件有不同的需求,所以每个组件拷贝一个数据(深拷贝)
        this.getListData = []
        this.getAreaData = []
        this.getAddrHandData = []
        this.getListData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getAreaData = this.deepCopy(JSON.parse(res.data).layers.layer)
        this.getAddrHandData = this.deepCopy(JSON.parse(res.data).layers.layer)
        //默认传第1个字段
        let fitsrField = JSON.parse(JSON.parse(res.data).layers.layer[0].conditionFileld).keyField.split(',')
        this.$store.commit('onemapApplication/publicSpecialField', fitsrField) //清空结果
      }).catch((error) => {
        console.log(error)
      })
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
    //接收QueryArea组件传统过来的查询条件里的区域条件
    getAreaFormSon(data) {
      this.ismsgFromAreaSon = data
      this.msgFromAreaSon = `[${data.join(' ')}]`
    },
    //获取关键字
    getKeyWord(keyWord) {
      this.keyWord = []
      this.keyWord = keyWord
    },
    //获取字段
    getSelectFieldHand(fileds) {
      this.getFileds = ''
      this.getFileds = fileds
    },
    //接收QueryHand组件传统过来的查询条件里的自定义条件
    getHandFormSon(data) {
      if (this.inde !== 2) { //不在专题查询里
        this.msgFromHandSon = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].valueLeft !== '' && data[i].valueSeftCenter !== '' && data[i].input !== '') {
            let val = ''
            if (data[i].type === 'esriFieldTypeString') {
              val = `${data[i].valueLeft} ${data[i].valueSeftCenter} '${data[i].input}'`
            } else {
              val = `${data[i].valueLeft} ${data[i].valueSeftCenter} ${data[i].input}`
            }
            this.msgFromHandSon.push(val)
          }
        }
      } else { //专题查询

      }
    },
    //高级搜索是否显示
    onCoexistClick(boolean) {
      this.isCoexist = ''
      this.isCoexist = boolean
    },
    //点查询
    onQueryClick() {
      this.excuteMapMethod('removeResult') //清空地图上结果
      //查询后的结果通过vuex传到查询结果里的features传到QueryPanelResult组件
      this.$store.commit('onemapApplication/publicQueryRealut', '')
      // 区域
      if (this.ismsgFromAreaSon.length) {
        this.excuteMapMethod('queryDistrict', this.ismsgFromAreaSon[0], this.excQuery)
      } else {
        this.excQuery('')
      }
    },
    excQuery(result) {
      //查询部分
      //后台要的查询条件例子:{"where":"NF = [2009],SSXZQ = ['三乡镇','古镇镇'],SHAPE.AREA > 100,abc = [12,34]","returnGeometry":"true","f":"json","outFields":"*"}
      let conditions = []
      let queryObj = {}
      // 区域
      if (result) {
        this.geoMetry = JSON.stringify(result)
      }

      if (this.inde === 0) { //规划查询
        if (this.isCoexist) { //不要关键字
          if (this.msgFromHandSon.length) {
            conditions.push(`${this.msgFromHandSon}`)
          }
        } else { //不要自定义条件
          conditions.push(`keyWord=${this.keyWord}`)
        }
      } else if (this.inde === 1) { //地点查询
        conditions.push(`keyWord=${this.keyWord}`)
      } else { //专题查询
        queryObj.where = ''
        if (this.getFileds !== '全部') {
          if (this.keyWord) {
            conditions.push(this.getFileds + ' like ' + this.keyWord)
          } else {
            this.$message({
              type: 'warning',
              message: '请输入关键字'
            })
            return
          }
        } else {
          conditions.push('keyWord=' + this.keyWord)
        }
      }
      queryObj.where = conditions.join(',')
      queryObj.geometry = this.geoMetry
      this.queryCondition = JSON.stringify(queryObj)
      let params = {
        layerId: this.getUrl,
        queryCondition: this.queryCondition
      }
      //加载框出来
      this.loadShow = true
      if (this.inde === 0) { //发查询请求(规划)
        this.onPlanPostData(params)
      } else if (this.inde === 1) { //发查询请求(地点)
        this.onAddrPostData(params)
      } else { //发查询请求(专题)
        this.onSpeciPostData(params)
      }
    },
    //发查询请求(规划)
    onPlanPostData(params) {
      queryResult(params).then(res => {
        if (res.status === 1) {
          this.loadShow = false
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
          //查询后的要下载excel/shp文件结果通过vuex传到QueryPanelResult组件
          this.$store.commit('onemapApplication/publicQueryExportObject', res.data)
          //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelAdd', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setResultPanelShow', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true)
          //规划查询结果面板出来
          this.$store.commit('onemapApplication/setResult', '规划查询')
          this.$store.commit('onemapApplication/publicQueryPicNamelast', this.getpublicQueryPicNameVal)
        } else {
          this.loadShow = false
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true) //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelShow', true)
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
        }
      }).catch((error) => {
        this.loadShow = false
        this.$message({
          type: 'error',
          message: '查询失败！'
        })
        this.$store.commit('onemapApplication/setOnemapRightPanelShow', false) //右侧查询结果弹框
        this.$store.commit('onemapApplication/setResultPanelShow', false) ////右侧查询结果弹框左侧旁边的logo
        console.log(error)
      })
    },
    //发查询请求(地点)
    onAddrPostData(params) {
      queryAddrResult(params).then(res => {
        if (res.status === 1) {
          this.loadShow = false
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
          //查询后的要下载excel/shp文件结果通过vuex传到QueryPanelResult组件
          this.$store.commit('onemapApplication/publicQueryExportObject', res.data)
          //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelAdd', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setResultPanelShow', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true)
          //地点查询结果面板出来
          this.$store.commit('onemapApplication/setResult', '地点查询')
        } else {
          this.loadShow = false
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true) //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelShow', true)
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
        }
      }).catch((error) => {
        this.loadShow = false
        this.$message({
          type: 'error',
          message: '查询失败！'
        })
        this.$store.commit('onemapApplication/setOnemapRightPanelShow', false) //右侧查询结果弹框
        this.$store.commit('onemapApplication/setResultPanelShow', false) ////右侧查询结果弹框左侧旁边的logo
        console.log(error)
      })
    },
    //发查询请求(专题)
    onSpeciPostData(params) {
      querySpelicResult(params).then(res => {
        if (res.status === 1) {
          this.loadShow = false
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
          //查询后的要下载excel/shp文件结果通过vuex传到QueryPanelResult组件
          this.$store.commit('onemapApplication/publicQueryExportObject', res.data)
          //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelAdd', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setResultPanelShow', true) // 右侧选项卡预留
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true)
          //地点查询结果面板出来
          this.$store.commit('onemapApplication/setResult', '专题查询')
        } else {
          this.loadShow = false
          this.$store.commit('onemapApplication/setOnemapRightPanelShow', true) //右侧查询结果弹框
          this.$store.commit('onemapApplication/setResultPanelShow', true)
          this.$store.commit('onemapApplication/publicQueryRealut', res.data)
        }
      }).catch((error) => {
        this.loadShow = false
        this.$message({
          type: 'error',
          message: '查询失败！'
        })
        this.$store.commit('onemapApplication/setOnemapRightPanelShow', false) //右侧查询结果弹框
        this.$store.commit('onemapApplication/setResultPanelShow', false) ////右侧查询结果弹框左侧旁边的logo
        console.log(error)
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.QueryPanel {
  height: 100%;
}
.query-panel {
  min-width: 370px;
  height: 100%;
  color: white;
}
.query-panelCont {
  height: calc(100% - 100px);
}
.query-panel-box {
  width: 100%;
  background: #3f50ba;
}
.publicQuery-title {
  float: left;
  width: 30.3%;
  // width: 35%;
  height: 40px;
  line-height: 37px;
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  text-align: center;
  font-weight: 400;
  color: rgba(0, 234, 254, 1);
  z-index: 2;
  div {
    // width: 100px;
    width: 80px;
    margin: 0 auto;
    &.active {
      border-bottom: 3px solid #00eafe;
    }
    &:hover {
      border-bottom: 3px solid #00eafe;
    }
  }
}
.QuerySearch {
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #3f50ba;
  padding-top: 10px;
  button {
    margin: 0;
    padding: 0;
    border: 1px solid transparent;
    //自定义边框
    outline: none;
    //消除默认点击蓝色边框效果
    width: 160px;
    height: 36px;
    border-radius: 18px;
    background: #24c3db;
    opacity: 0.9;
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
    &:active {
      border-color: #3a8ee6;
    }
  }
}
</style>
