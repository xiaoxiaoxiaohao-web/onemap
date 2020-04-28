<template>
  <div class="QueryList-cont">
    <ScrollDiv>
      <div class="querylist-box no-select">
        <span v-for="(item,index) in QueryList" :key="index" @click="onItemClick(item,index)" :class="{'changeStyle':inde === index}">{{item.layerAlias}}</span>
      </div>
    </ScrollDiv>

  </div>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import { type } from 'os'
export default {
  name: 'QueryList',
  props: ['QueryList'],
  data() {
    return {
      inde: 0,
      itemYear: [], //QueryList当前选中的年份
      sendUrl: '', //QueryList当前选中的url
      sendHand: [], //QueryList当前选中的默认部分
      year: '',
      area: '',
      filedsArr: []

    }
  },
  components: {
    ScrollDiv
  },
  computed: {


  },
  watch: {
    QueryList(newVal) {
      if (newVal.length !== 0) {
        // console.log(newVal)
        //传默认的部分
        for (let k = 0; k < this.QueryList.length; k++) {
          this.QueryList[k].conditionFieldValue = `{${this.QueryList[k].conditionFieldValue}}`
          this.QueryList[k].conditionFileld = JSON.parse(this.QueryList[k].conditionFileld)
          if (k === 0) {
            this.year = this.QueryList[0].conditionFileld.yearField
            this.area = this.QueryList[0].conditionFileld.zoneField
            this.$store.commit('onemapApplication/publicQueryResultField', this.QueryList[0].conditionFileld)
            this.$store.commit('onemapApplication/publicQueryResultCustom', this.QueryList[0].layerAlias)
            this.$store.commit('onemapApplication/publicQueryYear', JSON.parse(this.QueryList[0].conditionFieldValue)[this.year])
            //this.$store.commit('onemapApplication/publicQueryCustom', this.QueryList[0].querys.query)
          }
        }
        let publicQueryAreaFirst = []
        for (let i = 0; i < JSON.parse(this.QueryList[0].conditionFieldValue)[this.area].length; i++) {
          publicQueryAreaFirst.push({
            'areaName': JSON.parse(this.QueryList[0].conditionFieldValue)[this.area][i],
            'id': i,
            'checked': false
          })
        }
        this.$store.commit('onemapApplication/publicQueryArea', publicQueryAreaFirst)
        this.$store.commit('onemapApplication/publicQueryHand', this.QueryList[0].layerId)
      }
    }


  },
  created() {

  },
  mounted() {


  },
  methods: {
    onAllClick() {
      this.QueryList.map((item, index) => {
        this.inde = index
      })
    },
    //选中当前部分
    onItemClick(item, index) {
      this.filedsArr = item.conditionFileld.keyField.split(',')
      this.$store.commit('onemapApplication/publicSpecialField', this.filedsArr) //专题查询的字段
      if (item.layerAlias === '生活服务' || item.layerAlias === '餐饮美食') {
        this.$message({
          type: 'warning',
          message: '暂无数据',
          duration: 1500
        })
        this.$store.commit('onemapApplication/publicQueryRealut', '') //清空结果
        this.$store.commit('onemapApplication/setOnemapRightPanelShow', false) //右侧查询结果弹框
        this.$store.commit('onemapApplication/setResultPanelShow', false) ////右侧查询结果弹框左侧旁边的logo
      }
      this.inde = index
      this.year = ''
      this.area = ''
      this.year = this.QueryList[index].conditionFileld.yearField
      this.area = this.QueryList[index].conditionFileld.zoneField
      this.$store.commit('onemapApplication/publicQueryResultField', item.conditionFileld)
      this.$store.commit('onemapApplication/publicQueryResultCustom', item.layerAlias)
      this.$store.commit('onemapApplication/publicQueryListChange', this.inde)
      //规划查询的图层名称
      this.sendUrl = item.layerId
      // this.sendHand = item.querys.query
      this.$store.commit('onemapApplication/publicQueryHand', this.sendUrl)
      let publicQueryYear = []
      publicQueryYear = JSON.parse(item.conditionFieldValue)[this.year]
      let publicQueryArea = []
      for (let i = 0; i < JSON.parse(item.conditionFieldValue)[this.area].length; i++) {
        publicQueryArea.push({
          'areaName': JSON.parse(item.conditionFieldValue)[this.area][i],
          'id': i,
          'checked': false
        })
      }
      this.$store.commit('onemapApplication/publicQueryYear', publicQueryYear)
      this.$store.commit('onemapApplication/publicQueryArea', publicQueryArea)
      // this.$store.commit('onemapApplication/publicQueryCustom', this.sendHand)
    },
    onClearnZeroClick() {
      this.inde = 0
    }


  }
}
</script>

<style scoped lang="scss">
.QueryList-cont {
  height: 157px;
  background: #17266e;
  border-bottom: 1px solid #3f50ba;
  .querylist-box {
    padding-bottom: 10px;
    span {
      display: inline-block;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-top: 10px;
      margin-left: 10px;
      font-size: 12px;
      font-family: 'Microsoft YaHei';
      color: #a1aee4;
      border: 1px solid rgba(80, 100, 199, 0.75);
      border-radius: 5px;
      cursor: pointer;
      &.changeStyle {
        background: #5877ff;
        color: #ffffff;
      }
    }
  }
}
</style>
