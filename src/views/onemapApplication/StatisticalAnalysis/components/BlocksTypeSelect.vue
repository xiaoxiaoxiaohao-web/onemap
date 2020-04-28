<template>
  <div class="blocks-type-select">
    <!-- <div class="top-type">
      <div class="type-outside">
        <div class="type-inside">
          <ul  :class="{'ul-count':(newList.length>=5)}" >
            <li v-for="(item,index) in newList" :key="index" :class="[{'top-click':(item.type===clickType)},{'li-count':(newList.length<5)}]" @click="onTypeButtonClick(item.type)" >{{item.name}}</li>
          </ul>
        </div>
      </div>
    </div> -->
    <div class="top-type">
      <p>{{title}}</p>
    </div>
    <div class="top-button">
      <!-- <i v-if=" index>0" class="el-icon-d-arrow-left top-i" @click="onBeforenavClick()"></i>
      <i v-else class="el-icon-d-arrow-left top-i green"></i>
      <i v-if="topTypeList.length>5 &&index+5<topTypeList.length" class="el-icon-d-arrow-right top-i  " @click="onAfternavClick()"></i>
      <i v-else class="el-icon-d-arrow-right top-i green "></i> -->
      <el-button class="top-return-btn" @click="onReturnClick">返回</el-button>
    </div>
  </div>

</template>
<script>
import { nextTick } from 'q'
export default {
  name: 'BlocksTypeSelect',
  components: {},
  props: {
    topTypeList: {
      type: Array
    },
    clickType: {
      type: String
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      index: 0,
      newList: [],
      showList: []
    }
  },
  created() {

  },
  methods: {
    onTypeButtonClick(type) {
      this.$emit('onTypeButtonClick', type)
    },
    onReturnClick() {
      this.$emit('onReturnClick')
      sessionStorage.removeItem('chooseButton')
    },
    //导航条向左滚动
    onBeforenavClick() {
      this.index = this.index - 5
      this.newList = []
      this.showList = []
      for (var i = this.index; i < this.topTypeList.length; i++) {
        this.showList.push(this.topTypeList[i])
        if (i < this.index + 5) {
          this.newList.push(this.topTypeList[i])
        }
      }
      // console.log(this.newList)
    },
    //导航条向右滚动
    onAfternavClick() {
      this.index = this.index + 5
      this.newList = []
      this.showList = []
      for (var i = this.index; i < this.topTypeList.length; i++) {
        this.showList.push(this.topTypeList[i])
        if (i < this.index + 5) {
          this.newList.push(this.topTypeList[i])
        }
        // console.log(this.newList)
      }
    }
  }
  // watch: {
  //   //数据及时更新
  //   topTypeList: {
  //     immediate: true, // 这句重要
  //     handler(val) {
  //       this.showList = val
  //       this.newList = val.slice(0, 5)
  //     }

  //   },
  //   clickType(nVal, oVal) {
  //     if (!this.clickType) {
  //       return
  //     }
  //     if (!this.showList.find(x => x.type === nVal)) {
  //       this.onBeforenavClick()
  //     } else if (this.showList.findIndex(x => x.type === nVal) >= 5) {
  //       this.onAfternavClick()
  //     }
  //   }
  // }

}
</script>
<style lang="scss" scoped>
.blocks-type-select {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  .top-type {
    height: 49px;
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #888888;
    width: calc(100% - 150px);
    position: relative;
    .type-outside {
      width: 100%;
      height: 49px;
      overflow-x: hidden;
      .type-inside {
        display: flex;
        flex-wrap: nowrap;
        ul {
          width: 100%;
          display: flex;
          cursor: pointer;
          flex-wrap: nowrap;
          align-items: center;
          li {
            //  margin-left: 10px;
            white-space: nowrap;
            // width: 120px;
          padding: 0 6px;
          }
        }
        .top-click {
          color: #7882ff;
          height: 46px;
          border-bottom: 3px solid #7882ff;
        }
         .ul-count{
           justify-content: space-around;
            //  padding: 0 8px;

         }
         .li-count{
           padding:0 15px;

         }
      }
    }
  }
  .top-button {
    height: 49px;
    display: flex;
    align-items: center;
    .top-i {
      margin-left: 20px;
      line-height: 49px;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
    }
    .top-return-btn {
      width: 60px;
      height: 28px;
      line-height: 28px;
      padding: 0;
      // background-color: #ebebeb;
      border-radius: 2px;
      margin-left: 20px;
      font-size: 14px;
      i {
        padding-right: 3px;
      }
    }
  }
}
.green {
  color: #cecece;
}

</style>
