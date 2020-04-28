<template>
  <div class="toolbar3d">
    <div
      class="toolbar"
      :class="{ 'is-shrink': shrink }"
      @mouseover="shrink = false"
      @mouseout="shrink = true"
    >
      <div style="background-color: rgb(9,31,62); color: #fff; padding: 5px 0;">
        <el-tooltip class="item" effect="light" content="工具栏" placement="left" :open-delay="800">
          <i>
            <span class="icon-left color-white" :class="{ rotate: !shrink }"></span>
          </i>
        </el-tooltip>工具栏
      </div>

      <div @click="North" data-name="zhibeizhen" data-state="no">
        <el-tooltip class="item" effect="light" content="指北针" placement="left" :open-delay="800">
          <i>
            <span class="icon-Compass" style="color: rgb(33, 144, 248)"></span>
          </i>
        </el-tooltip>指北针
      </div>

      <div @click="Rotate" :class="{'active':mutex ==='rotate'}">
        <el-tooltip class="item" effect="light" content="旋转" placement="left" :open-delay="800">
          <i class="icon-rotate"></i>
        </el-tooltip>旋转
      </div>

      <div @click="visualAngleMan" :class="{'active':mutex ==='visualAngleMan' }">
        <el-tooltip class="item" effect="light" content="人视角" placement="left" :open-delay="800">
          <i class="icon-visualAngle-man2"></i>
        </el-tooltip>人视角
      </div>
      <!-- <div @click="visualAngleHighAltitude">
        <el-tooltip class="item" effect="light" content="高空视角" placement="left" :open-delay="800">
          <i class="icon-visual-angle-high"></i>
        </el-tooltip>高空视角
      </div>-->
      <div @click="attribute3d" :class="{ active: mutex === 'attribute3d' }">
        <el-tooltip class="item" effect="light" content="属性查询" placement="left" :open-delay="800">
          <i class="icon-info"></i>
        </el-tooltip>属性查询
      </div>
      <div @click="distance3d" :class="{ active: mutex === 'distance3d' }">
        <el-tooltip class="item" effect="light" content="距离测量" placement="left" :open-delay="800">
          <i class="icon-distance"></i>
        </el-tooltip>距离测量
      </div>
      <div @click="areage3d" :class="{ active: mutex === 'areage3d' }">
        <el-tooltip class="item" effect="light" content="面积测量" placement="left" :open-delay="800">
          <i class="icon-areage"></i>
        </el-tooltip>面积测量
      </div>
      <!-- <div @click="space" :class="{ active: mutex === 'space' }">
        <el-tooltip class="item" effect="light" content="空间测量" placement="left" :open-delay="800">
          <i>
            <span class="icon-space" style="color: rgb(33, 144, 248)"></span>
          </i>
        </el-tooltip>空间测量
      </div>-->
      <div @click="vertical" :class="{ active: mutex === 'vertical' }">
        <el-tooltip class="item" effect="light" content="垂直测量" placement="left" :open-delay="800">
          <i class="icon-vertical"></i>
        </el-tooltip>垂直测量
      </div>
      <div @click="pictureOut3d" :class="{ active: mutex === 'pictureOut3d' }">
        <el-tooltip class="item" effect="light" content="图片输出" placement="left" :open-delay="800">
          <i class="icon-picture"></i>
        </el-tooltip>图片输出
      </div>
      <div @click="clear3d">
        <el-tooltip class="item" effect="light" content="清除" placement="left" :open-delay="800">
          <i class="el-icon-close" style="color: #2190f8"></i>
        </el-tooltip>清除
      </div>
    </div>
    <div class="tips-visualAngleMan" v-if="mutex === 'visualAngleMan'">
      <div>人视角操作说明</div>
      <div v-for="tip in visualAngleManTips" :key="tip.Explain">
        <span>{{ tip.operation }}</span>
        <span>{{ tip.Explain }}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Map3D } from '../../../api/Map3D/Map3D'
export default {
  name: 'Map3DToolbar',
  data() {
    return {
      shrink: true,
      name: '',
      mutex: '', // 当前选中的互斥项
      notmutexLIst: [], // 已被选中的不需要互斥的选项
      visualAngleManTips: [
        {
          operation: 'W',
          Explain: '向前'
        },
        {
          operation: 'A',
          Explain: '向左'
        },
        {
          operation: 'S',
          Explain: '向后'
        },
        {
          operation: 'D',
          Explain: '向右'
        },
        {
          operation: 'Q',
          Explain: '抬高'
        },
        {
          operation: 'E',
          Explain: '抬低'
        },
        {
          operation: '↑',
          Explain: '抬头'
        },
        {
          operation: '↓',
          Explain: '低头'
        },
        {
          operation: '←',
          Explain: '左转'
        },
        {
          operation: '→',
          Explain: '右转'
        },
        {
          operation: 'ESC',
          Explain: '退出'
        }
      ]
    }
  },
  components: {},
  created() {
    // 主要用于人视角、测量取消按钮激活状态
    // this.$bus.on('deactiveOperation', v => {
    //   //this.ismutex(true, v);
    //   this.mutex = ''
    //   //console.log("esc 退出人视角");
    // })
    // this.$bus.on('roam3D', v => {
    //   this.ismutex(true, v)
    // })
  },
  computed: {
    isvisualAngleHighAltitude() {
      return !!this.notmutexLIst.find(n => {
        return n === 'visualAngleHighAltitude'
      })
    }
  },
  methods: {
    North: function() {
      this.ismutex(false, 'north')
    },
    Rotate: function() {
      this.ismutex(true, 'rotate')
    },
    visualAngleMan: function() {
      this.ismutex(true, 'visualAngleMan')
    },
    visualAngleHighAltitude: function() {},
    attribute3d: function() {
      this.ismutex(true, 'attribute3d')
    },
    distance3d: function() {
      this.ismutex(true, 'distance3d')
    },
    areage3d: function() {
      this.ismutex(true, 'areage3d')
    },
    space: function() {},
    vertical: function() {
      this.ismutex(true, 'vertical')
    },
    pictureOut3d: function() {
      this.ismutex(false, 'pictureOut3d')
    },
    clear3d: function() {
      //this.mutex = ''
      // this.map3DOperation('clear3d', true)
      this.ismutex(true, 'clear3d')
    },
    ismutex(type, name) {
      // type用于判断是否需要进行互斥判断: true/false
      if (type) {
        // 需要进行互斥判断
        if (this.mutex === name) {
          this.mutex = ''
          this.map3DOperation(name, false)
          //console.log(1, name, false)
        } else {
          var deactiveName = this.mutex //上一个工具不可以使用
          this.map3DOperation(deactiveName, false)
          this.mutex = name
          this.map3DOperation(name, true)
        }
      } else {
        // 不需要互斥
        if (
          this.notmutexLIst.find(m => {
            return m === name
          })
        ) {
          let i = this.notmutexLIst.indexOf(name)
          if (i > -1) {
            this.notmutexLIst.splice(i, 1)
            this.map3DOperation(name, false)
          }
        } else {
          this.notmutexLIst.push(name)
          this.map3DOperation(name, true)
        }
      }
    },
    humanViewDeactive: function() {
      this.mutex = ''
    },
    map3DOperation: function(toolName, state) {
      switch (toolName) {
        case 'north':
          Map3D.north()
          break
        case 'rotate':
          Map3D.rotate(state)
          break
        case 'visualAngleMan':
          Map3D.humanView(state, this.humanViewDeactive)
          break
        case 'pictureOut3d':
          Map3D.snapot()
          break
        case 'distance3d':
          Map3D.disMeasure(state)
          break
        case 'vertical':
          Map3D.heightMeasure(state)
          break
        case 'areage3d':
          Map3D.areaMeasure(state)
          break
        case 'attribute3d':
          this.$emit('identifyQuery', state)
          break
        case 'clear3d':
          Map3D.clear(state)
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.toolbar3d {
  top: 0px;
  right: 5px;
  position: absolute;
}

.toolbar {
  position: absolute;
  top: 115px;
  left: -140px;
  width: 120px;
  transition: width 0.2s, left 0.2s;
  overflow: hidden;
  background-color: #fff;
  z-index: 200;
  div {
    cursor: pointer;
    margin: 5px 0;
    width: 130px;
    &:first-child {
      margin-top: 0px;
    }
    i {
      width: 40px;
      color: #2190f8;
      display: block;
      float: left;
      text-align: center;
      font-size: 15px;
      padding-top: 3px;
      font-weight: bold;
      span {
        font-weight: bold;
      }
      .rotate {
        // transform: rotate(180deg);
        transform: rotateY(180deg);
      }
      span.color-white {
        width: 16px;
        height: 17px;
        display: block;
        margin: auto;
      }
      .color-white::before {
        color: #fff;
      }
    }
  }

  .active {
    background: #2190f8;
    color: #fff;
    span::before,
    i::before {
      color: #fff;
    }
  }
}
.toolbar.is-shrink {
  width: 40px;
  left: -60px;
  transition: width 0.2s, left 0.2s;
}
.tips-visualAngleMan {
  position: absolute;
  top: 60px;
  left: -270px;
  background-color: #fff;
  text-align: center;
  z-index: 200;
  div:first-child {
    background: #2190f8;
    color: #fff;
    font-size: 16px;
    padding: 5px;
  }
  span {
    font-size: 16px;
    padding: 0 10px;
  }
}
</style>
