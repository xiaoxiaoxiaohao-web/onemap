<template>
  <div class="show-analysis-box">
    <div class="content-top">
      <div class="top-left-div">
        <div class="top-icon" :style="data.displayStyle">
          <i :class="data.icon"></i>
        </div>
        <span>{{data.moduleName}}</span>
      </div>
    </div>
    <div class="contrnt-body">
      <div class="body-div" v-for="(item,index) in data.module" :key="index">
        <!-- 有子类的按钮 -->
        <el-popover placement="bottom" trigger="click" v-if="item.module" :visible-arrow="false" :popper-class="'SA-add'">
          <!-- 按钮 -->
          <div class="button-div" slot="reference" :class="isChildSelect(item.module)?'button-check':'button-uncheck'" @click.stop="onButtonClick(item, index)" >
            {{item.moduleName}}
            <div class="drop-down" :class="{'transform-css':item.isCheck}">
              <i class="el-icon-arrow-right"></i>
            </div>
        </div>
          <div class="child-div">
            <div class="child-top">分析基准</div>
            <div class="child-content">
              <el-checkbox-group v-model="item.checkList" v-if="refresh">
                <el-checkbox :label="item2.moduleName" v-for="(item2,index2) in item.module" :key="index2" @change="changeType(item2)"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </el-popover>
        <!-- 没有子类的按钮 -->
        <div class="button-div" v-else :class="item.isCheck?'button-check':'button-uncheck'" @click.stop="onButtonClick(item, index)">
          {{item.moduleName}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ShowAnalysisBox',
  components: {},
  props: {
    moduleData: {
      type: Object
    },
    parentIndex: {
      type: Number
    }
  },
  data() {
    return {
      // 全选
      allChecked: false,
      checkList: [], //列出数组
      checkModel: [], //点中的数组
      data: {},
      refresh: true,
      moduleNameList: []
    }
  },
  created() {
    this.data = this.moduleData
  },
  methods: {
    changeAllChecked() {
      if (this.allChecked) {
        // 全选
        for (let i = 0; i < this.data.module.length; i++) {
          if (this.data.module[i].module) {
            continue
          } else {
            this.data.module[i].isCheck = true
          }
        }
      } else {
        // 反选
        this.data.module.forEach(element => {
          element.isCheck = false
        })
      }
    },
    // 按钮点击事件
    onButtonClick(item, index) {
      this.moduleNameList.push(item.moduleName)
      // sessionStorage.setItem('chooseButton', item.moduleName)
      this.$store.commit('onemapApplication/setButtonName', item.moduleName)
      let moduleChoose = [this.parentIndex, index, item.moduleName]
      this.$emit('chooseModule', moduleChoose)
    },
    // 展开内容点击事件
    onShowChildClick(child) {
      child.isCheck = !child.isCheck
    },
    // 判断子类是否有选中的方法
    isChildSelect(childList) {
      let isControl = false
      for (let i in childList) {
        if (childList[i].isCheck) {
          isControl = true
          break
        }
      }
      return isControl
    },
    // 多选按钮点击事件
    changeType(item) {
      this.refresh = false
      item.isCheck = !item.isCheck
      this.$nextTick(() => {
        this.refresh = true
      })
    },
    // 返回选中的内容
    returnCheckData() {
      let checkData = []
      this.data.module.forEach(element => {
        // 先判断有没有字层
        if (element.module) {
          element.module.forEach(child => {
            if (child.isCheck) {
              // 如果子类选中
              checkData.push(child.moduleId)
            }
          })
        } else {
          // 没有子层判断当前是否选择
          if (element.isCheck) {
            checkData.push(element.moduleId)
          }
        }
      })
      return checkData
    }
  },
  computed: {},
  watch: {
    // 监视全选全不选的功能
    checkModel() {
      if (this.checkModel.length === this.data.module.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
    },
    // allChecked(val) {
    //   if (val) {
    //     // 全选
    //     for (let i = 0; i < this.data.module.length; i++) {
    //       if (this.data.module[i].module) {
    //         continue
    //       } else {
    //         this.data.module[i].isCheck = true
    //       }
    //     }
    //   } else {
    //     // 反选
    //     this.data.module.forEach(element => {
    //       element.isCheck = false
    //     })
    //   }
    //  },

    moduleData() {
      console.log('moduleData改变')
    }
  }
}
</script>
<style lang='scss' scoped>
.show-analysis-box {
  padding: 10px 20px 10px 20px;
  .content-top {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-left-div {
      display: flex;
      align-items: center;
      line-height: 50px;
      .top-icon {
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 15px;
        font-size: 20px;
        margin-right: 15px;
      }
      span {
        font-size: 16px;
        color: #293c98;
      }
    }
  }
  .contrnt-body {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding-top: 5px;
    .body-div {
      width: 190px;
      height: 36px;
      line-height: 36px;
      margin: 5px;
      border-radius: 4px;
      position: relative;
      .button-div {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          // background: #7882ff;
          // color: white;
          background-color: white;
          color: #7882FF;
          border: 1px solid #7882FF;
        }
        &:focus .drop-down {
          transition: all 0.3s;
          transform: rotate(0.25turn);
        }
      }
      .drop-down {
        position: absolute;
        right: 10px;
        top: 8px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        transition: all 0.3s;
        transform: rotate(0);
      }
    }
    .button-check {
      background-color: white;
      color: #7882FF;
      border: 1px solid #7882FF;
    }
    .button-uncheck {
      background: #edeff5;
      color: #888888;
    }
  }
}
</style>
