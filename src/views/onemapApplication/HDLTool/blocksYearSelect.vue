<!--
 * @Description: 地块追溯情况下-年份选择
 * @Author: ljl
 * @Date: 2019-08-30 19:00:50
 -->
<template>
  <div class="blocks-year-select" cid="blocksYearSelect">
    <div class="year-span">
      <span>年份</span>
    </div>
    <div class="year-change el-icon-d-arrow-left" @click="leftClick(-1)"></div>
    <div class="year-div" ref="showDiv">
      <div class="year-div-hide" ref="hideDiv">
        <div class="year-button" :class="{'year-selection':(selectYear===item)}" v-for="(item,index) in yearList" :key="index" @click="yearClick(item)">{{item}}</div>
      </div>
    </div>
    <div class="year-change el-icon-d-arrow-right" @click="rightClick(1)"></div>
  </div>
</template>
<script>
export default {
  name: 'blocksYearSelect',
  components: {},
  props: [],
  data() {
    return {
      // 年份内容
      nowLength: 1, // 控制左右移动长度
      allLength: 0, // 可移动长度
      yearList: ['2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006', '2005', '1999'],
      selectYear: '2018', // 当前选中年份
      outsideWidth: 0, // 外部div宽度
      buttonWidth: 0, // 实际所有按钮所占的长度
      moveWidth: 0, // 移动长度
      actualTranslate: 0 // 真实移动的长度
    }
  },
  created() { },
  mounted() {
    this.selectYear = this.$store.state.onemapApplication.nowYear
    // 如果不先移动一次，第一次计算offsetLeft就会有问题
    this.$refs.hideDiv.style.WebkitTransform = 'translate(0rem)'
    this.computeTranslate()
  },
  methods: {
    // 计算相差的距离--目前没有考虑由于年份过多二导致的左右一次不过移动的问题 // 计算能移动多少次
    computeTranslate() {
      // 1.获取能看到的长度
      let outsideWidth = this.$refs.showDiv.offsetWidth
      // 2.获取最后一个按钮的offsetLeft
      let lastIndex = this.yearList.length - 1
      let lastButton = document.querySelectorAll('.year-button')
      let insideWidth = lastButton[lastIndex].offsetWidth + lastButton[lastIndex].offsetLeft
      this.outsideWidth = outsideWidth
      this.buttonWidth = insideWidth / this.yearList.length
      // 3.计算从开始到结尾所差的距离
      let moveWidth = insideWidth - outsideWidth
      // 4.计算能移动多少次
      this.allLength = parseInt((insideWidth / outsideWidth), 10) + 2
      this.moveWidth = moveWidth
    },
    // 年份左移
    leftClick(value) {
      let number = this.nowLength + value
      // 如果向右移动
      if (number === 1) {
        // 如果回到最初的位置
        this.nowLength += value
        this.$refs.hideDiv.style.WebkitTransform = 'translate(0rem)'
      } else if (number > 1) {
        // 向右移动一个宽度
        this.nowLength += value
        // 获取能看到的长度
        // let outsideWidth = this.$refs.showDiv.offsetWidth - 2
        let moveWidth = this.actualTranslate - this.$refs.showDiv.offsetWidth
        this.$refs.hideDiv.style.WebkitTransform = 'translate(-' + moveWidth + 'px)'
      }
      console.log('左: ' + this.nowLength)
    },
    // 年份右移
    rightClick(value) {
      let number = this.nowLength + value
      // 如果向右移动
      if (number < this.allLength) {
        this.nowLength += value
        // let moveWidth = this.computeTranslate() + 2
        let outsideWidth = this.$refs.showDiv.offsetWidth
        // let moveWidth = (outsideWidth * (number-1)) - 2
        let moveWidth = 0
        if (number - 1 === this.allLength - 3) {
          moveWidth = outsideWidth - 2
        } else {
          moveWidth = this.moveWidth + 2
        }
        // 如果需要移动
        this.$refs.hideDiv.style.WebkitTransform = 'translate(-' + moveWidth + 'px)'
        this.actualTranslate = moveWidth
      }
      console.log('右: ' + this.nowLength)
    },
    // 年份选中
    yearClick(item) {
      this.selectYear = item
      this.$store.commit('onemapApplication/changeNowYear', this.selectYear)
    }
  },
  computed: {
    getNowYear() {
      return this.$store.state.onemapApplication.nowYear
    }
  },
  watch: {
    getNowYear(newValue) {
      this.selectYear = newValue
      // 1.判断当前内容下标应该在哪个位置
      let index = 0
      for (let i = 0; i < this.yearList.length; i++) {
        if (this.selectYear === this.yearList[i]) {
          index = i + 1
          break
        }
      }
      // 所选年份的对应位置
      let newWidth = this.buttonWidth * index
      if (this.outsideWidth !== 0) {
        // 当前内容应该在的位置下标
        let nowIndex = parseInt((newWidth / this.outsideWidth), 10) + 1
        // 判断是否需要移动，有时需要移动2次
        for (let n = 0; ; n++) {
          if (nowIndex > this.nowLength) {
            // 大于需要右移
            this.rightClick(1)
          } else if (nowIndex < this.nowLength) {
            // 小于需要左移
            this.leftClick(-1)
          } else {
            break
          }
          // 防止死循环
          if (n > 10) {
            break
          }
        }
      }
      // 计算是否需要换列表数据
      // let newWidth = this.buttonWidth * index
      // if (this.actualTranslate > newWidth) {
      //   // 如果当前移动的长度大于年份跳转的长度，应该左移
      //   this.leftClick(-1)
      // } else {
      //   // 如果当前移动的长度小于年份跳转的长度，应该右移
      //   this.rightClick(1)
      // }
    }
  }
}
</script>
<style scoped>
.blocks-year-select {
  height: 20px;
  padding: 10px;
  line-height: 20px;
  display: flex;
  justify-content: flex-start;
  font-size: 15px;
}
.year-change {
  border: 1px solid gray;
  border-radius: 2px;
  padding: 2px 2px;
  cursor: pointer;
}
.year-change:not(:last-child) {
  margin-left: 5px;
  margin-right: 5px;
}
.year-div {
  width: calc(100% - 42px);
  height: 25px;
  margin-top: -1px;
  overflow: hidden;
  color: gray;
}
.year-span {
  width: 40px;
  padding-right: 10px;
}
.year-div-hide {
  width: 10000px;
  transition: all 1s;
}
.year-button {
  float: left;
  width: 48px;
  margin-right: 7px;
  font-size: 12px;
  border: 1px solid gray;
  border-radius: 3px;
  cursor: pointer;
}
.year-selection {
  background: #409eff;
  color: white;
}
</style>
