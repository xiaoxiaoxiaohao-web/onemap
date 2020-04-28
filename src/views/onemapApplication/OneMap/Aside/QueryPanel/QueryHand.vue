<template>
  <div class="selfCustom ">
    <div class="clear-fix" v-show="advancedBtn">
      <div class="advancedQuery cursor-pointer no-select" :class="{'active':advanced}" @click="onQueryTabClick">
        高级查询
      </div>
    </div>
    <div class="clear-fix" v-show="!advancedBtn">
      <div class="advancedQuery cursor-pointer no-select" :class="{'active':advanced}">
        查询条件
      </div>
    </div>
    <div class="clear-fix search-box" v-show="filedShow">
      <div class="keyWord field">
        字段
      </div>
      <div class="searchInput">
        <el-select v-model="selectField" placeholder="请选择"  @change="handleChange">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="clear-fix search-box" v-show="!advanced">
      <div class="keyWord">
        关键字
      </div>
      <div class="searchInput">
        <input type="text" v-model="keyWord" placeholder="请输入关键字" />
      </div>
    </div>
    <ScrollDiv v-show="advanced">
      <div class="QueryHand-title QueryHand-zdy">查询条件:</div>
      <div class="selfCustom-zdy" v-for="(Evry,inde) in QuerySelfDefiningArr" :key="inde">
        <ul class="QueryHand-ul custom clear-fix">
          <li>
            <el-select v-model="Evry.valueSeftLeft" clearable placeholder="请选择">
              <el-option v-for="(item,index) in fileds" :key="index-900" :label="item.alias" :value="item.value" @click.native="selectSeftLtVal(item,Evry)">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-select v-model="Evry.valueSeftCenter" clearable placeholder="请选择">
              <el-option v-for="(item,index) in operator" :key="index-500" :label="item" :value="item">
              </el-option>
            </el-select>
          </li>
          <li>
            <el-input v-model="Evry.input" placeholder="请输入内容"></el-input>
          </li>
          <li class="QueryHand-redcu" @click="QueryHandRedcu(inde)">
            <div class="QueryHand-redcu" v-show="QuerySelfDefiningArr.length > 1">
              <img src="./QueryImg/redcu.png" alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="QueryHand-add" @click="QueryHandAdd">
        <img src="./QueryImg/add.png" alt="">
      </div>
    </ScrollDiv>

  </div>
</template>

<script>
import { publicQueryHand } from '@/api/publicQuery'
import ScrollDiv from '@/components/Div/ScrollDiv'
export default {
  name: 'QueryHand',
  components: { ScrollDiv },
  props: { QueryHandList: { type: Array } },
  data() {
    return {
      QuerySelfDefiningArr: [], //自定义条件
      defaultQuery: [], // 默认查询条件
      fileds: [], // 所有的字段
      operator: ['>', '<', '=', 'like'], //操作符
      queryTabFiled: '',
      advanced: false,
      advancedBtn: true,
      keyWord: '',
      filedShow: false,
      options: [],
      selectedOptions: [],
      selectField: '全部'

    }
  },
  computed: {
    getQueryHandUrlData() {
      //获取对应的url
      return this.$store.state.onemapApplication.getQueryHandUrl
    },
    getQueryListChangeVal() {
      //QueryList切换时的标识
      return this.$store.state.onemapApplication.getQueryListChangeVal
    },
    getQublicQuerySpecialFieldVal() {
      return this.$store.state.onemapApplication.publicQuerySpecialFieldVal
    }
  },
  watch: {
    getQueryHandUrlData(newVal) {
      //监听url的改变
      if (this.advancedBtn) { //规划查询
        this.publicQueryHandInit(newVal)
      }
    },
    getQueryListChangeVal(newVal, oldVal) {
      //监听QueryList切换标识的改变
      if (newVal !== oldVal) {
        this.QuerySelfDefiningArr = []
        this.defaultQuery = []
        this.$emit('funcHand', this.QuerySelfDefiningArr)
      }
    },
    QuerySelfDefiningArr: {
      deep: true,
      handler() {
        this.$emit('funcHand', this.QuerySelfDefiningArr)
      }
    },
    getQublicQuerySpecialFieldVal: {
      deep: true,
      handler(newVal, oldVal) {
        this.options = []
        for (let i = 0; i < newVal.length; i++) {
          this.options.push(
            {
              'value': newVal[i],
              'label': newVal[i]
            }
          )
        }
      }
    },
    keyWord(newVal, oldVal) {
      let keyWord = ''
      keyWord = newVal
      this.$emit('keyWordHand', keyWord)
    }
  },
  mounted() {

  },
  methods: {
    handleChange() {
      this.$emit('selectFieldHand', this.selectField)
    },
    onQueryTabClick() {
      this.queryTabFiled++
      if (this.queryTabFiled % 2 === 0) { //要关键字
        this.advanced = false
        //this.QuerySelfDefiningArr = []
        this.$emit('onCoexistClick', false)
      } else { //不要关键字
        this.advanced = true
        // this.keyWord = ''
        this.$emit('onCoexistClick', true)
        //默认出2条
        // if (this.queryTabFiled === 1) {
        //   this.QueryHandAdd()
        // }
      }
    },
    onAdvancedFalseClick() { //地点查询
      this.keyWord = ''
      this.advancedBtn = false
      this.advanced = false
      this.filedShow = false
    },
    onAdvancedTrueClick() { //规划查询
      this.keyWord = ''
      this.advancedBtn = true
      this.filedShow = false
    },
    onSpecialAdvancedTrueClick() { //专题查询
      this.keyWord = ''
      this.advancedBtn = false
      this.advanced = false
      this.filedShow = true
      this.handleChange()
    },
    //调接口(规划)
    publicQueryHandInit(argums) {
      let params = {
        layerId: argums
      }
      publicQueryHand(params).then(res => {
        this.QuerySelfDefiningArr = []
        this.fileds = []
        if (res.data !== null) {
          // 第一个要排除掉和过滤年份和过滤区域
          for (let i = 1; i < res.data.length; i++) {
            if (res.data[i].name !== 'NF' && res.data[i].name !== 'SSXZQ') {
              this.fileds.push(
                {
                  value: `${res.data[i].name}(${res.data[i].alias})`,
                  label: `${res.data[i].name}(${res.data[i].alias})`,
                  type: `${res.data[i].type}`,
                  alias: res.data[i].alias
                }
              )
            }
          }
          this.QuerySelfDefiningArr.push(
            {
              'valueSeftLeft': '',
              'valueSeftCenter': '',
              'input': '',
              'type': '',
              'valueLeft': ''
            }
          )
        } else {
          return false
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 选择字段的时候取字段对应的类型
    selectSeftLtVal(item, Evry) {
      Evry.type = item.type
      Evry.valueLeft = Evry.valueSeftLeft.replace(/\(.*\) */g, '')
    },
    //增加(+)
    QueryHandAdd() {
      this.QuerySelfDefiningArr.push(
        {
          'valueSeftLeft': '',
          'valueSeftCenter': '',
          'input': '',
          'type': '',
          'valueLeft': ''
        }
      )
    },
    //删除(-)
    QueryHandRedcu(index) {
      //保留1条
      if (this.QuerySelfDefiningArr.length > 1) {
        this.QuerySelfDefiningArr.splice(index, 1)
      }
    }

  }
}
</script>

<style scoped lang="scss">
.advancedQuery {
  float: right;
  margin-right: 12px;
  margin-top: 24px;
  width: 80px;
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(161, 174, 228, 1);
  text-align: center;
  background: rgba(27, 40, 104, 1);
  border: 1px solid rgba(80, 100, 199, 1);
  border-radius: 5px;
  &.active {
    color: rgba(195, 204, 242, 1);
  }
  &:hover {
    color: rgba(195, 204, 242, 1);
  }
}
.search-box {
  margin-top: 10px;
  height: 28px;
  line-height: 28px;
}
.keyWord,
.searchInput {
  float: left;
  margin-left: 10px;
}
.keyWord {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(195, 204, 242, 1);
}
.field {
  margin-right: 15px;
}
.searchInput {
  width: 286px;
  height: 28px;
  background: rgba(23, 35, 93, 1);
  border: 1px solid rgba(42, 58, 139, 1);
  border-radius: 5px;
  input {
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(161, 174, 228, 1);
    background: rgba(23, 35, 93, 1);
    outline: none;
    border: none;
  }
}
::-webkit-input-placeholder {
  /* WebKit, Blink, Edge */
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(161, 174, 228, 1);
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(161, 174, 228, 1);
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(161, 174, 228, 1);
}
:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(161, 174, 228, 1);
}

.custom {
  li {
    float: left;
    margin-top: 10px;
    height: 28px;
    line-height: 28px;
    list-style: none;
    &:first-child {
      width: 100px;
    }
    &:nth-child(2) {
      width: 90px;
      margin-left: 10px;
    }
    &:nth-child(3) {
      width: 112px;
      margin-left: 10px;
    }
  }
}
.selfCustom {
  width: 100%;
  height: 220px;
  padding-bottom: 10px;
  position: relative;
  z-index: 5;
}
.QueryHand-ul {
  display: flex;
  align-items: center;
  justify-content: center;
}
.QueryHand-title {
  font-size: 16px;
  font-family: 'Microsoft YaHei';
  color: #c3ccf2;
  margin-left: 10px;
}
.QueryHand-zdy {
  margin-top: 20px;
}
.QueryHand-add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  cursor: pointer;
}
.QueryHand-redcu {
  margin-left: 2%;
  padding-top: 3px;
  cursor: pointer;
}
</style>
