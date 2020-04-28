<template>
  <div class="result-table" :id="data.vueId">
    <!-- 标题 -->
    <div class="title" @click="onTitleClick">
      {{data.title}}
    </div>
    <!-- 表格 -->
    <!-- :style="{width:data.tableObj.tableHeaderList.length*120 + 50 + 'px'}" -->
    <div class="table-content">
      <el-table :data="data.tableObj.tableDataList" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column prop="index" label=" " width="50">
          <template slot-scope="scope">
            <span class="index-span-css" :style="{'background':getIndexColor(scope.$index+1)}">{{ scope.$index+1 }}</span>
          </template>
        </el-table-column>
        <el-table-column :prop="item.value" :label="item.name" v-for="(item,index) in data.tableObj.tableHeaderList" :key="index">
        </el-table-column>
      </el-table>
    </div>
    <!-- 结论 -->
    <div class="bottom-conclusion">
      <div class="conclusion-div">
        <span class="red-font">结论：</span>
      </div>
      <div>{{data.conclusion}}</div>
    </div>
  </div>
</template>
<script>
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import SAExecuteMixin from '../mixin/SAExecuteMixin'
export default {
  name: 'ResultTable',
  components: {},
  props: {
    data: {
      type: Object
    }
  },
  mixins: [executeMixin, SAExecuteMixin],
  data() {
    return {
      // conclusion: '耕地占压总面积1246.8m²，其中基本农田***m²，高标准农田***m²，耕地占压总面积1246.8m²，其中基本农田***m²，高标准农田***m²，耕地占压总面积1246.8m²，其中基本农田***m²，高标准农田***m²，',
      /*tableObj: {
        tableHeaderList: [
          {
            name: '坐落单位名称',
            value: 'locatedName'
          },
          {
            name: '地类码',
            value: 'landCode'
          },
          {
            name: '地类名称',
            value: 'landName'
          },
          {
            name: '地类备注',
            value: 'landnotes'
          },
          {
            name: '地类占压面积',
            value: 'landArea'
          }
        ],
        tableDataList: [
          {
            'locatedName': '沙朗社区',
            'landCode': '023',
            'landName': '其他园区',
            'landnotes': '',
            'landArea': '858.2',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 1
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '201',
            'landName': '城市',
            'landnotes': '',
            'landArea': '2389.3',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 2
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '111',
            'landName': '河流水面',
            'landnotes': '',
            'landArea': '96.6',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 3
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '102',
            'landName': '公路用地',
            'landnotes': '',
            'landArea': '2379.8',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 4
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '110',
            'landName': '警察局',
            'landnotes': '',
            'landArea': '110.1',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 5
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '110',
            'landName': '警察局',
            'landnotes': '',
            'landArea': '110.1',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 6
          },
          {
            'locatedName': '沙朗社区',
            'landCode': '110',
            'landName': '警察局',
            'landnotes': '',
            'landArea': '110.1',
            'rings': [[1, 2], [3, 4], [5, 6]],
            'index': 7
          }
        ]
      },*/
      currentRow: null
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 表格行点击事件
    handleCurrentChange(val) {
      if (!val) {
        return
      }
      this.currentRow = val
      if (val.geometry.rings) {
        this.excuteMapMethod('drawPartPolygon', val.geometry.rings)
        this.$store.commit('onemapApplication/setSAHighlightRings', { type: 'row', rings: val.geometry.rings })
        this.SAExcuteMapMethod('onTableRowClick', val.geometry.rings)
      } else {
        return 0
      }
    },
    getIndexColor(index) {
      const color = ['#FFB400', '#FF9A76', '#FF7676', '#E771CD']
      let getColor = ''
      let num = index % 4
      if (num === 0) {
        num = 4
      }
      // let num = index - parseInt((index / 4), 10) * 4 - 1
      getColor = color[num - 1]
      // if (index <= 4) {
      //   getColor = color[index - 1]
      // } else {
      //   let num = index % 9
      //   getColor = color[(num % 5)]
      // }
      return getColor
    },
    // 标题点击事件
    onTitleClick() {
      // 1. 把rings提取出来
      let rings = []
      // if (this.data.tableObj.tableDataList.length === 0) {
      //   return
      // }
      for (let i in this.data.tableObj.tableDataList) {
        rings.push(this.data.tableObj.tableDataList[i].geometry.rings)
      }
      this.excuteMapMethod('getGeoListMultiple', rings)
      this.$store.commit('onemapApplication/setSAHighlightRings', { type: 'title', rings: rings })
      this.SAExcuteMapMethod('onTableTiltleClick', rings)
    }
  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.result-table {
  width: calc(100% - 2px);
  // min-width: calc(100% - 2px);
  background: white;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin-top: 10px;
  .title {
    width: 212px;
    height: 38px;
    line-height: 38px;
    color: #1a3dda;
    text-align: left;
    padding-left: 18px;
    background: #e5e9f9;
    border-radius: 6px 0px 36px 0px;
    cursor: pointer;
    &:hover {
      background: #c9cfe9;
      color: #2849dd;
    }
  }
  .table-content {
    padding: 15px 20px 0px 20px;
    .index-span-css {
      width: 24px;
      height: 24px;
      background: #ffb400;
      border-radius: 50%;
      display: block;
      margin: auto;
      font-size: 14px;
      color: white;
    }
  }
  .bottom-conclusion {
    color: #555555;
    font-size: 14px;
    display: flex;
    text-align: left;
    padding: 10px 20px;
    background-color: #f3f4f9;
    border-radius: 0 0 6px 6px;
    .conclusion-div {
      width: 80px;
      .red-font {
        color: #ff0000;
      }
    }
  }
}
</style>
