<!--
 * @Description: 专题目录
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 -->
<template>
  <ScrollDiv class="subject-menu">
    <!-- 标题 -->
    <div class="title">
      <span>专题目录</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <InputSearch v-model="serchKey" class="search-box" />
    </div>
    <div class="tree-content">
      <el-tree :data="featureTree.children" :show-checkbox="true" @check="onNodeCheck" :props="defaultProps" :filter-node-method="filterNode" node-key="FEATUREID" ref="tree" />
    </div>
  </ScrollDiv>
</template>
<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import InputSearch from '@/components/Input/InputSearch'
import onemapApi from '@/api/oneMap'
import { arrayToTree } from '@/utils/arrayUtil'
export default {
  name: 'SubjectMenu',
  components: {
    ScrollDiv,
    InputSearch
  },
  props: [],
  data() {
    return {
      featureTree: {
        children: []
      },
      defaultProps: {
        children: 'children',
        label: 'FEATURENAME',
        disabled: (data, node) => {
          // FEATURETYPE
          // root根节点  mapset_class文件夹   mapset_layer专题
          if (data.FEATURETYPE === 'mapset_layer') {
            return false
          }
          return true
        }
      },
      serchKey: ''
    }
  },
  created() {
    this.getFeatureInfoListData()
  },
  mounted() { },
  methods: {
    getFeatureInfoListData() {
      onemapApi.getFeatureInfoList({ syskey: 1 }).then(data => {
        if (data.ReturnCode === 0 && data.Data) {
          this.featureTree = arrayToTree(data.Data, 'FEATUREID', 'FEATUREPID').rooter
        }
      })
    },
    postFeatureLayersData(featureId) {
      return new Promise(resolve => {
        onemapApi.postFeatureLayers({ FeatureId: featureId }).then(data => {
          if (data.ReturnCode === 0 && data.Data) {
            resolve(data.Data)
          } else {
            resolve([])
          }
        })
      })
    },
    // 树节点选中状态改变
    async onNodeCheck(data, node) {
      const checked = node.checkedKeys.some(checkedKey => checkedKey === data.FEATUREID)
      const leafLayerList = []
      const rooter = data
      const traverse = (tree) => {
        if (tree.children && tree.children.length) {
          tree.children.forEach(child => {
            traverse(child)
          })
        } else {
          leafLayerList.push(tree)
        }
      }
      traverse(data)
      leafLayerList.forEach(leafLayer => {
        this.postFeatureLayersData(data.FEATUREID).then(layersList => {
          if (layersList.length) {
            this.$store.commit('onemapApplication/setSubjectOperate', { type: checked ? 'add' : 'remove', layers: layersList })
          }
        })
      })
    },
    // 树过滤方法
    filterNode(value, data) {
      return data.FEATURENAME.indexOf(value) > -1
    }
  },
  computed: {
    userKey() {
      return this.$store.state.global.userinfo.userKey
    }
  },
  watch: {
    serchKey() {
      this.$refs.tree.filter(this.serchKey)
    }
  }
}
</script>
<style lang="scss" scoped>
.subject-menu {
  min-width: 265px;
  height: 100%;
  // 标题
  .title {
    padding: 10px 25px;
    height: 20px;
    line-height: 20px;
    background: #3d4fb5;
    display: flex;
    justify-content: space-between;
    color: white;
    span {
      color: #01e9ff;
    }
  }
  // 搜索框
  .search {
    height: 32px;
    margin: 18px 20px;
    .search-box {
      width: 230px;
      border: 1px solid #5064c7;
      border-radius: 5px;
    }
  }
  // 树内容
  .tree-content {
    margin-top: 30px;
    padding: 0 20px;
    height: calc(100% - 130px);
  }
}
</style>
