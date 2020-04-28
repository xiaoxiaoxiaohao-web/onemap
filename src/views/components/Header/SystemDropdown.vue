<!--
 * @Description: 菜单信息内容
 * @Author: your name
 * @Date: 2019-09-07 14:28:42
 -->
<template>
  <div class="Menus">
    <div class="dropdown-box" v-show="showHeader">
      <!-- <span class="dropdown-current cursor-pointer" @click="onToggleClick"> -->
      <!-- <span class="dropdown-current no-select cursor-pointer">
        {{this.menuList[this.activedMenuIndex].title}}
        <i class="icon-menu" />
      </span> -->
      <!-- <ul :class="['dropdown-list',{hide:!showList}]"> -->
      <!-- <ul :class="['dropdown-list']">
        <div class="drop-box">
          <li v-for="(menu,index) in menuList" :key="index" :class="['dropdown-item',{ actived: index === activedMenuIndex}]" @click="onTopMenusClick(menu.routerPath)">
            <i :class="menu.icon" /> {{ menu.title }}
          </li>
        </div>
      </ul> -->
    </div>
    <div class="top-menu">
      <template v-for="(item,index) in menuList[activedMenuIndex].children">
        <!-- <el-dropdown v-if="item.children" @command="onTopMenusClick(index)" :key="index"> -->
          <!-- <span class="el-dropdown-link cursor-pointer"  :class="{'select-class':(getRouterPath===item.routerPath || item.childrenRouters.includes(getRouterPath))}">
            {{item.title}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span> -->
          <!-- <el-dropdown-menu class="top-select" slot="dropdown">
            <template v-for="(item2,index2) in item.children">
              <el-dropdown-item v-show="!item2.hide" :key="index2" :command="item2.routerPath" :class="{'actived':getRouterPath===item2.routerPath}">
                <span>{{item2.title}}</span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu> -->
        <!-- </el-dropdown> -->
        <div  :key="index" class="top-menu-div no-select"  :class="{'select-class':getRouterPath === item.routerPath}" @click="onTopMenusClick(item.routerPath)">
          {{item.title}}
        </div>

      </template>
    </div>
  </div>
</template>
<script>
// ToDo 这个应该独立出去
export default {
  name: 'SystemDropdown',
  data() {
    return {
      showHeader: true, // 是否显示头部
      showList: false,
      activedRouter: '',
      selectClass: '',
      menuList: [
        {
          icon: '',
          title: '一张图应用',
          routerPath: '/onemapApplication',
          children: [
            {
              title: '一张图',
              routerPath: '/onemapApplication',
              'id': 0
            },
            {
              title: '空间分析',
              routerPath: '/onemapApplication/SpatialAnalysis',
              'id': 1
            },
            {
              title: '统计分析',
              routerPath: '/onemapApplication/StatisticalAnalysis',
              'id': 2
            }
            // {
            //   title: '审批助手',
            //   childrenRouters: '',
            //   children: [
            // {
            //   title: '空间分析',
            //   routerPath: '/onemapApplication/SpatialAnalysis',
            //   'id': 0
            // },
            //     {
            //       title: '地类核查',
            //       routerPath: '/onemapApplication/HDLTool',
            //       'id': 1
            //     },
            //     {
            //       title: '地类核查',
            //       routerPath: '/onemapApplication/HDLToolTest',
            //       'id': 2,
            //       hide: true
            //     }
            //   ]
            // }
          ]
        },
        {
          icon: '',
          title: '国土空间规划分析评价',
          routerPath: '/territorialPlanEvaluate',
          children: [
            {
              title: '国土空间开发与适宜性评价',
              routerPath: '/territorialPlanEvaluate'
            }
          ]
        },
        {
          icon: '',
          title: '国土空间规划成过审查与管理'
        },
        {
          icon: '',
          title: '国土空间规划检测评估预警'
        },
        {
          icon: '',
          title: '环境资源承载能力监测预警'
        },
        {
          icon: '',
          title: '国土空间规划指标模型管理'
        }
      ]
    }
  },
  created() {
    this.parseMenuList(this.menuList)
  },
  mounted() { },
  methods: {
    onToggleClick() {
      this.showList = !this.showList
    },
    onTopMenusClick(path) {
      this.$router.push(path)
    },
    parseMenuList(menuList) {
      menuList.forEach(menu => {
        if (menu.children) {
          menu.childrenRouters = menu.children.filter(childMenu => childMenu.routerPath).map((childMenu) => {
            return childMenu.routerPath
          })
          this.parseMenuList(menu.children)
        }
      })
    }
  },
  computed: {
    getHeaderContorl() {
      return this.$store.state.onemapApplication.headerContorl
    },
    getRouterPath() {
      return this.$store.state.global.routerPath
    },
    activedMenuIndex() {
      for (let i = 0; i < this.menuList.length; i++) {
        const menu = this.menuList[i]
        const isActived = false
        if (menu.routerPath === this.getRouterPath || (menu.childrenRouters && menu.childrenRouters.includes(this.getRouterPath))) {
          return i
        }
        // 写死，暂时只判断两层，如果要多加层数，需要递归。整个组件需要重构
        if (menu.children) {
          for (let j = 0; j < menu.children.length; j++) {
            const childMenu = menu.children[j]
            if (childMenu.routerPath === this.getRouterPath || (childMenu.childrenRouters && childMenu.childrenRouters.includes(this.getRouterPath))) {
              return i
            }
          }
        }
      }
      return -1
    }
  },
  watch: {
    getHeaderContorl(val) {
      this.showHeader = val
    }
  }
}
</script>
<style lang="scss" scoped>
$actived-background-color: #21bdca;
@mixin dropdown-item-actived {
  color: #fff;
  background-color: $actived-background-color;
}
.Menus {
  display: flex;
  .dropdown-box {
    position: relative;
    display: flex;
    padding-left: 23px;
    font-size: 20px;
    color: #00effe;
    z-index: 1;
    .dropdown-current {
      display: flex;
      flex-direction: row;
      align-items: center;
      i {
        margin-left: 18px;
      }
    }
    .dropdown-list {
      position: absolute;
      height: 0;
      width: 293px;
      top: 60px;
      left: 0;
      box-sizing: border-box;
      background-color: rgba(20, 35, 106, 0.85);
      border-radius: 0 0 6px 6px;
      box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      transition: all 0.3s;
      font-size: 14px;
      color: #c5d0ff;
      .drop-box {
        padding: 22px 10px;
        .dropdown-item {
          height: 36px;
          line-height: 36px;
          border: 1px solid transparent;
          border-radius: 6px 0px 6px 0px;
          padding-left: 37px;
          cursor: pointer;
          &.actived,
          &:hover {
            @include dropdown-item-actived;
          }
        }
      }
    }
    &:hover {
      .dropdown-list {
        height: 274px;
      }
    }
  }
  .top-menu {
    padding-left: 200px;
    color: white;
    font-size: 16px;
    display: flex;
    .top-menu-div {
      padding: 0px 10px;
      cursor: pointer;
      &:not(:first-child) {
        margin-left: 20px;
      }
      &:hover {
        border-bottom: 3px solid #21bdca;
      }
    }
    .el-dropdown-link {
      width: 112px;
      text-align: center;
      &:hover {
        background: #0e1b56;
      }
      &:focus {
        outline: none;
      }
    }
  }
  .select-class {
    border-bottom: 3px solid #21bdca;
  }
}
</style>
