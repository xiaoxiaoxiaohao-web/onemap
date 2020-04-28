<template>
  <div class="explain">
    <div class="explain-left">
      <span class="explain-title">评价模型管理</span>
      <div class="content">
        <img :src="imgUrl" alt="">
      </div>
    </div>
    <div class="explain-right">
      <div class="method">
        <span class="explain-title">评价方法</span>
        <div class="content">
          <div class="method-content">
            <ScrollDiv>
              <span class="method-span" v-for="(item,index) in methodList" :key="index">
                {{item}}
              </span>
            </ScrollDiv>
          </div>
        </div>
      </div>
      <div class="step">
        <span class="explain-title">操作步骤</span>
        <div class="content">
          <div class="step-content">
            <!-- <div class="echarts" ref="echarts" id="echarts-content"></div> -->
            <ScrollDiv>
              <el-table :data="tableObj.tableDataList" border>
                <el-table-column :prop="item.value" :width="item.minWidth" :label="item.name" v-for="(item,index) in tableObj.tableHeaderList" :key="index">
                </el-table-column>
              </el-table>
            </ScrollDiv>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import echarts from 'echarts'
export default {
  name: 'Explain',
  components: {
    ScrollDiv
  },
  props: [],
  data() {
    return {
      // 评价方法
      methodList: [
        '1、基于区域内及邻近地区气象站点长时间序列降水观测资料，通过空间插值得到多年平均降水量分布图层。',
        '2、降水量按照≥ 1200mm、800~1200mm、400~800mm、200~400mm、<200mm分为好（很湿润）、较好（湿润）、一般（半湿润）、较差（半干旱） 、差（干旱）5 个等级。',
        '注：对于云贵高原等蒸发能力较强，仅通过降水难以全面反映农业供水条件的区域，可采用干旱指数计算。干旱指数为年蒸发能 力和年降水量的比值，按照≤0.5、0.5~1.0、 1.0~3.0、3.0~7.0、>7.0分为好（很湿润）、较好（湿润）、一般（半湿润）、较差（半干旱）、差（干旱）5 个等级；对于现状供水结构中过境水源占比较大且仅通过本地水资源总量难以全面反映农业供水条件的区域，可采用县级行政区用 水总量控制指标模数计算。用水总量控制指标模数按≥25 万㎡/km²、13~25 万㎡/km²、8~13万㎡/km²、3~8万㎡/km²、<3 万㎡/km²分为好、较好、一般、较差、差 5个等级。',
        '1、基于区域内及邻近地区气象站点长时间序列降水观测资料，通过空间插值得到多年平均降水量分布图层。',
        '2、降水量按照≥ 1200mm、800~1200mm、400~800mm、200~400mm、<200mm分为好（很湿润）、较好（湿润）、一般（半湿润）、较差（半干旱） 、差（干旱）5 个等级。',
        '注：对于云贵高原等蒸发能力较强，仅通过降水难以全面反映农业供水条件的区域，可采用干旱指数计算。干旱指数为年蒸发能 力和年降水量的比值，按照≤0.5、0.5~1.0、 1.0~3.0、3.0~7.0、>7.0分为好（很湿润）、较好（湿润）、一般（半湿润）、较差（半干旱）、差（干旱）5 个等级；对于现状供水结构中过境水源占比较大且仅通过本地水资源总量难以全面反映农业供水条件的区域，可采用县级行政区用 水总量控制指标模数计算。用水总量控制指标模数按≥25 万㎡/km²、13~25 万㎡/km²、8~13万㎡/km²、3~8万㎡/km²、<3 万㎡/km²分为好、较好、一般、较差、差 5个等级。'
      ],
      // 操作步骤
      tableObj: {
        tableHeaderList: [
          {
            name: '步骤',
            value: 'index',
            minWidth: '40'
          },
          {
            name: '操作说明',
            value: 'operation',
            minWidth: '210'
          },
          {
            name: '输入',
            value: 'input',
            minWidth: '95'
          },
          {
            name: '输出',
            value: 'output',
            minWidth: '95'
          }
        ],
        tableDataList: [
          {
            index: 1,
            operation: '对【水面区域】进行扣除',
            input: '【行政区划】【水面区域】',
            output: '【评价区域】'
          },
          {
            index: 2,
            operation: '用【空间插值法】得到【多年平均降水量分布图层】',
            input: '【评价区域1】【多年平均降水量】',
            output: '【多年平均降水量分布图层】'
          },
          {
            index: 3,
            operation: '对【多年平均降水量分布图层】分级',
            input: '【多年平均降水量分布图层】',
            output: '【水资源等级1】'
          },
          {
            index: 4,
            operation: '对【干旱指数】分级',
            input: '【评价区域2】【干旱指数】',
            output: '【水资源等级2】'
          },
          {
            index: 5,
            operation: '对【行政区用水总量控制指标模数】分级',
            input: '【评价区域3】',
            output: '【水资源等级3】'
          },
          {
            index: 6,
            operation: '输出【水资源等级】汇总Excel',
            input: '【水资源等级1】【水资源等级2】【水资源等级3】',
            output: '【水资源等级】'
          },
          {
            index: 7,
            operation: '展示数据',
            input: '',
            output: ''
          }
        ]
      },
      imgUrl: require('../images/tree.png')
    }
  },
  created() {
    console.log('渲染了说明')
  },
  mounted() {
  },
  methods: {

  },
  computed: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.explain {
  width: calc(100% - 40px);
  height: calc(100% - 20px);
  padding: 10px 20px;
  display: flex;
  position: relative;
  .explain-left {
    width: 190px;
    height: calc(100% - 100px);
    padding: 15px 10px;
    background: white;
    border: 1px solid #dcdcdc;
    border-radius: 8px;
  }
  .explain-right {
    width: 485px;
    height: calc(100% - 100px);
    margin-left: 10px;
    position: relative;
    .method {
      width: calc(100% - 22px);
      height: calc(100% - 395px);
      padding: 15px 10px 10px 10px;
      background: white;
      border: 1px solid #dcdcdc;
      border-radius: 8px;
      .method-content {
        width: calc(100% -32px);
        height: calc(100% - 62px);
        border: 1px solid rgba(225, 225, 225, 1);
        padding: 30px 15px;
        text-indent: 2em;
        .method-span {
          display: block;
        }
      }
    }
    .step {
      width: calc(100% - 22px);
      height: 363px;
      padding: 15px 10px 10px 10px;
      margin-top: 10px;
      background: white;
      border: 1px solid #dcdcdc;
      border-radius: 8px;
      .step-content {
        width: calc(100% -2px);
        height: calc(100% - 2px);
        border: 1px solid rgba(225, 225, 225, 1);
        .echarts {
          width: 100%;
          height: 100%;
          background-color: aquamarine;
        }
      }
    }
  }
  .explain-title {
    padding-left: 10px;
    font-size: 16px;
    height: 15px;
    color: #293c98;
  }
  .content {
    height: calc(100% - 40px);
    padding: 20px 0px 10px 0px;
  }
}
</style>
