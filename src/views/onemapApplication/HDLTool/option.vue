<!--
 * @Description: 核地类工具选项部分
 * @Author: your name
 * @Date: 2019-08-19 10:04:18
 -->
<template>
  <div class="tool-option-content">
    <!-- 单选按钮部分 -->
    <div class="option-top">
      <div class="top-div">
        <div class="top-title">
          <span class="top-span">核查类型</span>
        </div>
        <!-- 下拉菜单内容 -->
        <div class="top-radio">
          <el-radio-group v-model="topType1">
            <el-radio label="year" @change="changeType">
              单年份核查
              <el-select v-model="yearSelectClick" placeholder="请选择" :disabled="canSelect" @change="changeYearSelect">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-radio>
            <el-radio label="block" @change="changeType">地块追溯</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="top-div">
        <div class="top-title">
          <span class="top-span">项目红线</span>
        </div>
        <div class="top-radio">
          <el-radio-group v-model="topType2">
            <el-radio label="code" @change="changeType">
              <el-input ref="redLineInput" @keyup.native.enter="enterFun" @blur="outFocusFun" :disabled="cantInput" placeholder="请输入图纸编号" v-model="inputValue" class="top-input"></el-input>
            </el-radio>
            <el-radio label="toImport" @change="changeTypeImport">导入</el-radio>
            <el-radio label="draw" @change="draw">绘制</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="top-div">
        <div class="top-title">
          <span class="top-span">线状地物</span>
        </div>
        <div class="top-radio">
          <el-radio-group v-model="topType3">
            <el-radio label="examine" @change="changeType">审核</el-radio>
            <el-radio label="unExamine" @change="changeType">不审核</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- 开始按钮 -->
    <div class="start-div">
      <hr>
      <el-button class="start-button" type="primary" round @click="changeTableType('all')">开始</el-button>
    </div>
    <!-- 表格内容 -->
    <div class="option-body">
      <div class="option-loading" v-if="loading">
        <span class="el-icon-loading"></span>
      </div>
      <div class="option-table-div" v-if="showTableType!== '' && showType">
        <option-table :pagingObj="pagingOptionObj" v-show="showTableType==='all'"></option-table>
        <three-type-table :pagingObj="pagingthreeTypeObj" v-show="showTableType==='threeType'" @returnAll="returnAll" :canSelect="canSelect"></three-type-table>
        <adjustment-table :pagingObj="pagingadjustmentObj" v-show="showTableType==='adjustment'" :toExportCheckOpinion="toExportCheckOpinion" @changeCheckOpinionList="changeCheckOpinionList" @returnAll="returnAll" @changeOptionTableData="changeOptionTableData"></adjustment-table>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="option-bottom">
      <el-button @click="changeTableType('threeType')">三类统计</el-button>
      <el-button @click="changeTableType('adjustment')">平差</el-button>
      <el-popover placement="top" trigger="manual" v-model="clickExportData">
        <div class="export-div">
          <div class="export-range-checkbox">
            <el-checkbox v-model="isExportRange">导出追溯范围</el-checkbox>
          </div>
          <div class="export-range-button">
            <el-button type="primary" @click="onExportClick">导出</el-button>
            <el-button type="danger" @click="clickExportData = false">取消</el-button>
          </div>
        </div>
        <el-button slot="reference" @click="clickExportDataFun">导出图幅</el-button>
      </el-popover>
      <!-- <el-button>导出图幅</el-button> -->
      <el-popover placement="top" width="150" trigger="manual" v-model="clickExportTable">
        <div class="popover-div">
          <div @click="exportCheckOpinion">地类核准意见</div>
          <div @click="exportExamineExce">用地会审呈批表</div>
          <div @click="exportProveExcel">执法核查地类证明</div>
        </div>
        <el-button slot="reference" @click="clickExportTableFun">导出表格</el-button>
      </el-popover>
    </div>
    <!-- 隐藏内容 -->
    <!-- 导入内容 -->
    <div class="import-window" v-if="showImport">
      <import-file @closeWinFun="closeWinFun"></import-file>
    </div>
    <!-- 导出数据展示内容 -->
    <!-- <el-dialog :visible.sync="clickExportData">
      <div class="export-window" v-if="clickExportData">
        <div class="show-export-map">
          <export-map ref="exportMap"></export-map>
        </div>
        <div class="export-button-div"></div>
      </div>
    </el-dialog> -->
    <div class="export-BG" v-if="clickExportData">
      <div class="export-window">
        <div class="show-export-map">
          <export-map ref="exportMap"></export-map>
        </div>
        <div class="export-button-div"></div>
      </div>
    </div>
    <!-- 导出loading部分 -->
    <div class="export-loading" v-if="exportLoading">
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
// import axios from "axios";
// import qs from 'qs'
import optionTable from './optionTable'
import threeTypeTable from './threeTypeTable'
import adjustmentTable from './adjustmentTable'
import HDLTool from '@/api/HDLTool'
import importFile from './importFile'
import exportMap from './exportMap'
import { setTimeout, clearTimeout } from 'timers'
import fileJSON from './json/file.json'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import SpatialAnalysis from '@/api/SpatialAnalysis'
export default {
  name: 'toolOption',
  components: {
    optionTable,
    threeTypeTable,
    adjustmentTable,
    importFile,
    exportMap
  },
  mixins: [executeMixin],
  props: [],
  data() {
    return {
      landLineListData: [], // 图层服务地址列表
      showTableType: '', // 表格展示内容 默认展示all , 三类统计threeType, 平差adjustment
      showType: false, // 控制表格展示
      // 单选选中
      topType1: '',
      topType2: '',
      topType3: '',
      // 下拉内容
      yearSelectClick: '2018',
      yearCodeSelectClick: 0,
      canSelect: true, // true 不能进行单年份核查
      // 年份信息
      options: [
        {
          value: 0,
          label: 2018
        },
        {
          value: 1,
          label: 2017
        },
        {
          value: 2,
          label: 2016
        }, {
          value: 3,
          label: 2015
        }, {
          value: 4,
          label: 2014
        }, {
          value: 5,
          label: 2013
        }, {
          value: 6,
          label: 2012
        }, {
          value: 7,
          label: 2011
        }, {
          value: 8,
          label: 2010
        }, {
          value: 9,
          label: 2009
        }, {
          value: 10,
          label: 2008
        }, {
          value: 11,
          label: 2007
        }, {
          value: 12,
          label: 2006
        }, {
          value: 13,
          label: 2005
        }, {
          value: 14,
          label: 1999
        }
      ],
      // 输入内容
      cantInput: true,
      inputValue: '',
      // 默认展示表头内容
      startTableNameList: [],
      // 平差表格内容
      adjustmentTableNameList: [
        {
          name: '座落单位名称',
          value: 'located',
          minWidth: '100px'
        },
        {
          name: '地类编码',
          value: 'landTypeCode',
          minWidth: '60px'
        },
        {
          name: '地类名称',
          value: 'landTypeName',
          minWidth: '60px'
        },
        {
          name: '原始地类面积(㎡)',
          value: 'area',
          minWidth: '145px'
        }
      ],
      // 开始表格
      pagingOptionObj: {
        tableNameList: [], // 表头
        tableDataList: [], // 内容
        sumArea: 0, // 总面积
        canSelect: true // 是否地块追溯
      },
      // 三类统计表格
      pagingthreeTypeObj: {
        tableNameList: [],
        tableDataList: [],
        sumArea: 0,
        canSelect: true // 是否地块追溯
      },
      // 平差表格
      pagingadjustmentObj: {
        tableNameList: [],
        tableDataList: [],
        sumArea: 0,
        canSelect: true // 是否地块追溯
      },
      tableShow: true, // 表格展示控制
      getTableData: null,
      clickExportData: false, // 导出数据按钮
      clickExportTable: false, // 导出表格按钮
      toExportCheckOpinion: false, // 去平差表中导出控制
      checkOpinionList: [],
      // 保存单年份核查数据
      jsonData: [],
      examine: false, // 线状地物审核状态
      loading: false, // 获取数据时的加载状态
      // 导入窗口内容
      showImport: false,
      // 导出数据窗口展示
      isShowExportWin: false,
      isExportRange: false, // 导出追溯范围
      // 保存地块追溯数据
      blockJsonData: [],
      // 导出加载
      exportLoading: false
    }
  },
  created() {
  },
  mounted() {
    this.getLandLineListData()
  },
  methods: {
    // 获取图层服务地址列表
    getLandLineListData() {
      HDLTool.getLandLineListData().then(res => {
        // 默认修改当前选中年份为最新的年份
        this.$store.commit('onemapApplication/changeMapServerObjData', res[0])
        // 保存内容
        this.landLineListData = res
      })
    },
    // 年份选择改变,改变当前年份对应的图层下标
    changeYearSelect(event) {
      this.yearCodeSelectClick = event
      this.yearSelectClick = this.options[event].label
      // 修改store的数据
      let commitData = {}
      for (let i in this.$store.state.onemapApplication.allMapServer) {
        if (this.yearSelectClick === this.$store.state.onemapApplication.allMapServer[i].year) {
          commitData = this.$store.state.onemapApplication.allMapServer[i]
        }
      }
      this.$store.commit('onemapApplication/changeMapServerObjData', commitData)
      // 返回、修改地图内容
      // this.$emit('doChangeMapFun', this.examine)
      this.excuteMapMethod('changeYearChangeMap', this.examine)
    },
    // 单选按钮点击
    changeType(event) {
      console.log('点击：' + event)
      // 核查类型年份选择
      if (this.topType1 === 'year') {
        this.canSelect = false
      } else {
        // 地块追溯
        this.canSelect = true
      }
      // 项目红线图纸编号
      if (this.topType2 === 'code') {
        // 关闭导入
        this.showImport = false
        this.cantInput = false
        // 输入框聚焦
        this.$nextTick(() => {
          this.$refs.redLineInput.focus()
        })
      }
      // 选择线状地物审核
      if (this.topType3 === 'examine') {
        this.examine = true
        // 修改为有面积类型的
        this.startTableNameList = [
          {
            name: '座落单位名称',
            value: 'located',
            minWidth: '110px'
          },
          {
            name: '地类编码',
            value: 'landTypeCode',
            minWidth: '60px'
          },
          {
            name: '面积类型',
            value: 'areaType',
            minWidth: '60px'
          },
          {
            name: '地类名称',
            value: 'landTypeName',
            minWidth: '80px'
          },
          {
            name: '地类备注',
            value: 'remark',
            minWidth: '60px'
          },
          {
            name: '地 类 面 积(㎡)',
            value: 'area',
            minWidth: '145px'
          }
        ]
        // 返回内容，加载线状地物图层
        this.excuteMapMethod('examineLineTypeField')
      }
      // 选择线状地物不审核
      if (this.topType3 === 'unExamine') {
        this.examine = false
        // 修改为没有面积类型的
        this.startTableNameList = [
          {
            name: '座落单位名称',
            value: 'located',
            minWidth: '120px'
          },
          {
            name: '地类编码',
            value: 'landTypeCode',
            minWidth: '80px'
          },
          {
            name: '地类名称',
            value: 'landTypeName',
            minWidth: '80px'
          },
          {
            name: '地类备注',
            value: 'remark',
            minWidth: '70px'
          },
          {
            name: '地类面积(㎡)',
            value: 'area',
            minWidth: '165px'
          }
        ]
        this.excuteMapMethod('unExamineLineTypeField')
      }
    },
    // 控制导入窗口展开
    changeTypeImport() {
      // 打开导入窗口
      this.showImport = true
      this.cantInput = true
      this.excuteMapMethod('removDarwFun')
    },
    // 回车使得input失去焦点
    enterFun() {
      this.$refs.redLineInput.blur()
    },
    // 输入框失去焦点获取数据方法
    outFocusFun() {
      console.log('图纸编号内容:' + this.inputValue)
    },
    // 绘制
    draw() {
      // 关闭导入
      this.showImport = false
      console.log('点击绘制')
      this.excuteMapMethod('drawPolygon')
    },
    // 表格内容切换
    changeTableType(type) {
      if (type === 'all') {
        //开始方法
        if (this.topType1 === '' || this.topType2 === '' || this.topType3 === '') {
          this.$message({
            type: 'error',
            message: '核查类型、项目红线、现状地物都不能为空'
          })
          return
        } else {
          // 获取数据，加载loading
          this.loading = true
          // 重置nowYear
          this.$store.commit('onemapApplication/changeNowYear', '2018')
          setTimeout(() => {
            this.loading = false
          }, 8000)
          if (!this.examine) {
            this.tableDataWithoutLine(this.$store.state.onemapApplication.coordinate)
          } else {
            this.tableData(this.$store.state.onemapApplication.coordinate)
          }
        }
      }
      if (type === 'threeType' && this.jsonData !== '') {
        // 三类统计
        this.showTableType = type
      }
      if (type === 'adjustment' && this.jsonData !== '') {
        //平差
        this.showTableType = type
      }
    },
    // 导出数据按钮
    clickExportDataFun() {
      this.clickExportData = !this.clickExportData
      this.clickExportTable = false
    },
    // 确认导出按钮点击事件
    onExportClick() {
      // 加载loading
      this.exportLoading = true
      // 去掉头部文字
      this.$store.commit('onemapApplication/changeHeaderContorl', false)
      // 防止有问题一直加载 20秒时间
      // setTimeout(() => {
      //   this.exportLoading = false
      //   this.$store.commit('onemapApplication/changeHeaderContorl', true)
      // }, 20000)
      // 导出操作
      this.$refs.exportMap.onExportChange(() => {
        this.clickExportData = false
        this.exportLoading = false
        this.$store.commit('onemapApplication/changeHeaderContorl', true)
        console.log('打印图片结束')
      })
      // this.$refs.exportMap.onExportChange()
      // 导出完成后，关闭导出界面？
      // this.clickExportData = false
    },
    // 导出表格按钮
    clickExportTableFun() {
      this.clickExportTable = !this.clickExportTable
      this.clickExportData = false
    },
    // 导出表格--地类核准意见
    exportCheckOpinion() {
      this.clickExportTable = !this.clickExportTable
      this.clickExportData = false
      // 导出内容去平差的表中导出修改后的数据
      console.log('ok')
      this.toExportCheckOpinion = true
    },
    // 导出表格--地类核准意见--返回内容--调用后台接口--导出表格
    changeCheckOpinionList(getList, total) {
      // 保存内容
      this.checkOpinionList = getList
      // 调用后台接口
      let params = {
        // 只使用后台需要的内容
        dtoListStr: JSON.stringify(getList.map(l => {
          return {
            located: l.located,
            landTypeCode: l.landTypeCode,
            landTypeName: l.landTypeName,
            calculatedArea: parseFloat(l.calculatedArea)
          }
        })),
        drawingNum: '',
        year: this.yearSelectClick + '',
        total: total + ''
      }
      // 上传数据
      HDLTool.exportResultExcel(params).then(res => {
        // 成功上传数据后、以文件流的形式下载到前端进行保存
        console.log(res.status)
        this.toExportCheckOpinion = false
        this.handleResData(res)
      }).catch(v => {
        console.log(v)
        this.toExportCheckOpinion = false
      })
    },
    // 导出表格--- 用地会审呈批表
    exportExamineExce() {
      this.clickExportTable = !this.clickExportTable
      this.clickExportData = false
      // 1.组织数据
      let examineData = {
        dtoStr: JSON.stringify(fileJSON.examineList)
      }
      console.log('上传的参数', examineData)
      // 2.调用接口上传数据
      HDLTool.postExportExamineExcel(examineData).then(res => {
        // 成功上传数据后、以文件流的形式下载到前端进行保存
        console.log(res.status)
        this.handleResData(res)
      }).catch(v => {
        console.log(v)
      })
    },
    // 导出表格--- 执法核查地类证明
    exportProveExcel() {
      this.clickExportTable = !this.clickExportTable
      this.clickExportData = false
      // 1.组织数据
      let examineData = {
        dtoListStr: JSON.stringify(fileJSON.proveList2)
      }
      console.log('上传的参数', examineData)
      // 2.调用接口上传数据
      HDLTool.postExportProveExcel(examineData).then(res => {
        // 成功上传数据后、以文件流的形式下载到前端进行保存
        console.log(res.status)
        this.handleResData(res)
      }).catch(v => {
        console.log(v)
      })
    },
    // 处理上传数据后返回的内容
    handleResData(res) {
      let getFileParam = {
        fileName: res.data
      }
      // 截取名称
      let fileName = this.cutFileName(res)
      // 调用后台文件流转换接口
      // const params = { 'TDYTFX': { 'module': { 'moduleResultName': '土地用途分析结果', 'conclusion': '这里是结论' }, 'resultJsonObj': { 'features': [{ 'attributes': { 'SHAPE_Length': 336.625384342452, 'OBJECTID_1': 20, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '285.04', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 852.792658412829, 'OBJECTID': 3465, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 336.63865381, 'YTFQMC': '城镇建设用地区', 'BSM': 203465, 'MJ': 852.8000000000001 } }, { 'attributes': { 'SHAPE_Length': 530.5669179806044, 'OBJECTID_1': 25, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '15711.54', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 16196.873055774719, 'OBJECTID': 3470, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 530.58816742, 'YTFQMC': '城镇建设用地区', 'BSM': 203470, 'MJ': 16196.800000000001 } }, { 'attributes': { 'SHAPE_Length': 668.1044093456833, 'OBJECTID_1': 30, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '2506.79', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 23211.689024539664, 'OBJECTID': 3475, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 668.13141308, 'YTFQMC': '城镇建设用地区', 'BSM': 203475, 'MJ': 23211.600000000002 } }, { 'attributes': { 'SHAPE_Length': 1113.469344225544, 'OBJECTID_1': 42, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '23267.29', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 48667.75977608934, 'OBJECTID': 3487, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 1113.51348462, 'YTFQMC': '城镇建设用地区', 'BSM': 203487, 'MJ': 48667.4 } }, { 'attributes': { 'SHAPE_Length': 1406.3813984800722, 'OBJECTID_1': 55, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '106602.76', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 106720.87395514548, 'OBJECTID': 3500, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 1406.43821472, 'YTFQMC': '城镇建设用地区', 'BSM': 203500, 'MJ': 106720.3 } }, { 'attributes': { 'SHAPE_Length': 1615.493821004032, 'OBJECTID_1': 60, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '82805.53', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 162006.95279190317, 'OBJECTID': 3505, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 1615.5587277, 'YTFQMC': '城镇建设用地区', 'BSM': 203505, 'MJ': 162006 } }, { 'attributes': { 'SHAPE_Length': 2712.590979245842, 'OBJECTID_1': 61, 'XZQHDM': '442000002020', 'MS': '城镇建设用地区', 'DLZYMJ': '3563.74', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 197458.1958177518, 'OBJECTID': 3506, 'SSZQ': null, 'TDYTFQDM': '1050', 'TDYTFQBH': '2', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 2712.69951407, 'YTFQMC': '城镇建设用地区', 'BSM': 203506, 'MJ': 197457.1 } }, { 'attributes': { 'SHAPE_Length': 6136.681359937678, 'OBJECTID_1': 78, 'XZQHDM': '442000002016', 'MS': '其他用地区', 'DLZYMJ': '6.69', 'YSDM': '2003010100', 'XZQHMC': '桥岗社区', 'SHAPE_Area': 68.34889751859009, 'OBJECTID': 3553, 'SSZQ': null, 'TDYTFQDM': '1990', 'TDYTFQBH': '5', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 34221.3268151, 'YTFQMC': '其他用地区', 'BSM': 203553, 'MJ': 1093141.8 } }, { 'attributes': { 'SHAPE_Length': 56108.1441000865, 'OBJECTID_1': 81, 'XZQHDM': '442000002020', 'MS': '其他用地区', 'DLZYMJ': '90787.85', 'YSDM': '2003010100', 'XZQHMC': '东裕社区', 'SHAPE_Area': 1537814.2323353887, 'OBJECTID': 3562, 'SSZQ': null, 'TDYTFQDM': '1990', 'TDYTFQBH': '5', 'SJSM': '20180111版本-国土局提供', 'SHAPE_LENG': 56110.676242, 'YTFQMC': '其他用地区', 'BSM': 203562, 'MJ': 1537893 } }], 'fieldAliases': { 'SHAPE_Length': 'SHAPE_Length', 'OBJECTID_1': 'OBJECTID_1', 'XZQHDM': '行政区划代码', 'MS': '描述', 'DLZYMJ': '地类占压面积(m²)', 'YSDM': '要素代码', 'XZQHMC': '行政区划名称', 'SHAPE_Area': 'SHAPE_Area', 'OBJECTID': 'OBJECTID', 'SSZQ': '所属镇区', 'TDYTFQDM': '土地用途分区代码', 'TDYTFQBH': '土地用途分区编号', 'SJSM': '数据说明', 'SHAPE_LENG': 'Shape_Leng', 'YTFQMC': '用途分区名称', 'BSM': '标识码', 'MJ': '面积' } } } }
      // SpatialAnalysis.exportResult({ jsonParam: JSON.stringify(params) }).then(res2 => {
      HDLTool.downloadfileFun(getFileParam).then(res2 => {
        console.log(res2)
        this.downloadFile(res2, fileName)
      })
    },
    // 文件名称截取
    cutFileName(res) {
      // windows下的路径名称获取
      let windowsNameList = res.data.split('\\')
      // linux下的路径名称获取
      let linuxNameList = res.data.split('/')
      let fileName = ''
      if (windowsNameList.length > 1) {
        fileName = windowsNameList[windowsNameList.length - 1]
      } else {
        fileName = linuxNameList[linuxNameList.length - 1]
      }
      return fileName
    },
    // 保存文件流数据为文件
    downloadFile(data, fileName) {
      if (!data) {
        return
      }
      let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
      // 模拟A标签点击事件
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 根据数据，分配内容给三个表格
    tableDataControl(jsonData) {
      // 开始默认内容
      this.pagingOptionObj.tableDataList = jsonData.lands
      this.pagingOptionObj.tableNameList = this.startTableNameList
      this.pagingOptionObj.sumArea = jsonData.sumArea
      this.pagingOptionObj.canSelect = this.canSelect
      // 三类统计
      this.pagingthreeTypeObj = jsonData.threeType
      // 平差
      this.pagingadjustmentObj.tableDataList = jsonData.lands
      this.pagingadjustmentObj.tableNameList = this.adjustmentTableNameList
      this.pagingadjustmentObj.sumArea = jsonData.sumArea
      this.pagingadjustmentObj.canSelect = this.canSelect
    },
    // 平差后修改核查结果界面的表格内容
    changeOptionTableData(returnList, sum) {
      console.log('改变核查表的内容')
      for (let i in returnList) {
        this.pagingOptionObj.tableDataList[i].area = returnList[i]
      }
      this.pagingOptionObj.sumArea = sum
    },
    // 表格内部返回按钮控制
    returnAll(value) {
      this.showTableType = value
    },
    // 导入窗体内部-绘制地图内容--关闭窗口方法
    closeWinFun(val) {
      this.showImport = val
    },
    // 获取后台数据内容开始
    // 审核
    tableData(data) {
      // eslint-disable-next-line no-useless-escape
      var url = '{\"rings\":[' + data + ']}'
      this.getLineTable(url)
      console.log('有线')
    },
    //data with examining line
    getLineTable(data) {
      if (this.topType1 === 'year') {
        // 单年份核查
        this.showTableType = ''
        // const url = "http://172.26.156.100:38095/gis/landTypeAndLine";
        let params = {
          landServer: window.baseMapBaseUrl,
          lineServer: window.baseMapBaseUrl,
          year: parseInt(this.yearSelectClick, 10),
          regionJson: data
        }
        HDLTool.getLandTypeAndLineData(params).then(response => {
          console.log('ok')
          this.jsonData = response
          // 数据处理成表格需要的内容
          this.tableDataControl(this.jsonData)
          // 清除loading
          this.loading = false
          clearTimeout()
          this.showTableType = 'all'
          this.showType = true // 控制显隐1
        })
      } else {
        this.showTableType = ''
        // 地块追溯--审核
        let params = {
          landServer: window.baseMapBaseUrl,
          lineServer: window.baseMapBaseUrl,
          regionJson: data
        }
        HDLTool.postYearLandLineTypeData(params).then(res => {
          console.log('地块追溯--审核', res)
          // 保存数据
          this.blockJsonData = res
          // 2.表格内容--找到当前年份的数据
          let dataObj = res[this.yearCodeSelectClick]
          // 3.数据整理到三个表格中
          this.tableDataControl(dataObj)
          // 清除loading
          this.loading = false
          clearTimeout()
          this.showTableType = 'all'
          this.showType = true // 控制显隐1
        })
      }
    },
    // 不审核
    tableDataWithoutLine(data) {
      // eslint-disable-next-line no-useless-escape
      var url = '{\"rings\":[' + data + ']}'
      this.getTable(url)
      console.log('没线')
    },
    //data without examining line
    getTable(data) {
      if (this.topType1 === 'year') {
        // 单年份核查
        this.showTableType = ''
        // const url = "http://172.26.156.100:38095/gis/landType";
        let params = {
          landServer: window.baseMapBaseUrl,
          year: parseInt(this.yearSelectClick, 10),
          regionJson: data
        }
        HDLTool.getLandTypeData(params).then(response => {
          console.log('ok')
          this.jsonData = response
          // 数据处理成表格需要的内容
          this.tableDataControl(this.jsonData)
          // 清除loading
          this.loading = false
          clearTimeout()
          this.showTableType = 'all'
          this.showType = true // 控制显隐1
        })
      } else {
        this.showTableType = ''
        // 地块追溯--不审核
        let params = {
          landServer: window.baseMapBaseUrl,
          regionJson: data
        }
        HDLTool.postYearLandTypeData(params).then(res => {
          console.log('地块追溯--不审核', res)
          // 保存数据
          this.blockJsonData = res
          // 2.表格内容--找到当前年份的数据
          let dataObj = res[this.yearCodeSelectClick]
          // 3.数据整理到三个表格中
          this.tableDataControl(dataObj)
          // 清除loading
          this.loading = false
          clearTimeout()
          this.showTableType = 'all'
          this.showType = true // 控制显隐1
        })
      }
    },
    // 全局刷新方法控制
    optionTableReduction() {
      console.log('关闭option内容')
      this.topType2 = '' // 项目红线部分改变
      // 图表展示关闭
      this.showTableType = ''
      this.showType = false
    }
  },
  computed: {
    getNowYear() {
      return this.$store.state.onemapApplication.nowYear
    }
  },
  watch: {
    getNowYear(value) {
      console.log('当前选中年份--地块追溯:' + value)
      this.loading = true
      // 1.定义的年份与后台获取的年份一致，所以可以循环这个年份去做下标判断
      let index = 0
      for (let i in this.options) {
        if (this.options[i].label === parseInt(value, 10)) {
          index = i
          break
        }
      }
      // 修改数据
      this.tableDataControl(this.blockJsonData[index])
      this.$nextTick(() => {
        // 重新加载表格
        this.loading = false
        // 2.在进行年份转换时，绘制前一年的buildLand至地图上
        if (parseInt(index, 10)) {
          // 如果是最新的一年的数据，不用绘制内容
          this.$store.commit('onemapApplication/changeBuildLand', this.blockJsonData[index - 1].buildLand)
        } else {
          this.$store.commit('onemapApplication/changeBuildLand', '')
        }
      })
    }
  }
}
</script>
<style scoped>
.tool-option-content {
  width: calc(100% - 1px);
  height: calc(100% - 10px);
  padding-top: 10px;
  border-left: 1px solid black;
}
/* 顶部 */
.option-top {
  height: 190px;
  color: black;
  font-size: 16px;
  padding: 20px;
  margin: 0px 10px;
  border: 1px dashed gray;
  border-radius: 6px;
  background-color: white;
  position: relative;
}
.top-div {
  height: 70px;
}
.top-title {
  text-align: left;
  height: 20px;
  line-height: 20px;
}
.top-span {
  padding-right: 20px;
}
.top-radio {
  text-align: left;
  height: 40px;
  line-height: 40px;
}
.top-start {
  margin: auto;
}
/* 开始按钮部分 */
.start-div {
  margin: 0px 10px;
  text-align: right;
  padding-bottom: 15px;
}
.start-button {
  width: 80px;
  height: 30px;
  line-height: 30px;
  padding: 0px;
  /* background: #27C5F4; */
}
.dropdown-div {
  width: 100px;
  height: 18px;
  padding: 5px;
  border: 1px solid black;
  margin-left: 10px;
}
/* 图表内容 */
.option-body {
  height: calc(100% - 361px);
  border-bottom: 1px solid black;
  position: relative;
  background-color: white;
}
.option-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
}
.option-table-div {
  margin: 0px 10px;
  border: 1px dashed grey;
  padding: 5px;
  border-radius: 6px;
}
/* 底部按钮--底部按钮内容 */
.option-bottom {
  padding-top: 20px;
  /* padding: 20px 100px 0px 100px; */
  background-color: white;
  display: flex;
  justify-content: center;
}
.option-bottom button {
  background-color: #f3f7f8;
}
.popover-div div {
  height: 30px;
  line-height: 30px;
  font-size: 18px;
  text-align: center;
  padding-bottom: 10px;
  cursor: pointer;
}
.popover-div div:hover {
  color: #199ed8;
}
/* 导入窗口 */
.import-window {
  width: 300px;
  height: 100px;
  position: absolute;
  right: 110px;
  top: 4rem;
  z-index: 5;
  padding: 10px;
  border: 1px solid rgb(156, 150, 150);
  background: white;
}
/* 导出图幅 */
.export-div {
  width: 200px;
  height: 100px;
}
.export-BG {
  width: 100vw;
  height: calc(100vh - 80px);
  padding: 70px 0px 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: -60px;
  right: 0;
  z-index: 5000;
  color: black;
}
.export-window {
  width: 870px;
  height: calc(100%);
  display: flex;
  z-index: 9999;
}
.show-export-map {
  width: 100%;
  height: 100%;
  /* background-color: #199ed8; */
  background: white;
  position: relative;
  z-index: 9999;
}
.export-range-checkbox {
  padding: 10px;
  /* text-align: right; */
  font-size: 18px;
}
.export-range-button {
  padding-top: 10px;
  text-align: center;
}
.export-range-button button {
  height: 30px;
  line-height: 30px;
  padding: 0px 20px;
}
/* 导出loading */
.export-loading {
  width: 100vw;
  height: 100vh;
  line-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: -60px;
  right: 0;
  z-index: 5000;
  color: white;
}
.export-loading i {
  font-size: 50px;
}
</style>
