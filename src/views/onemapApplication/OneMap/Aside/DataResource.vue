<!--
 * @Description: 数据资源展开内容
 * @Author: your name
 * @Date: 2019-09-06 09:59:42
 -->
<template>
  <ScrollDiv class="data-resource">
    <!-- 标题 -->
    <div class="title">
      <span>数据资源</span>
    </div>
    <!-- 搜索 -->
    <div class="search">
      <InputSearch v-model="serchKey" class="search-box" />
    </div>
    <!-- 折叠面板、树 -->
    <div class="tree-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="item.title" :name="item.id" v-for="(item,index) in treeDataList" :key="index">
          <el-tree :data="item.children" :show-checkbox="true" :props="defaultProps" :render-after-expand="false" @check-change="onNodeCheckChange" node-key="_element_key" :filter-node-method="filterNode" ref="tree" />
        </el-collapse-item>
      </el-collapse>
    </div>
  </ScrollDiv>
</template>
<script>
import InputSearch from '@/components/Input/InputSearch'
import oneMapApi from '@/api/oneMap'
import Cookies from 'js-cookie'
import { arrayToTree } from '@/utils/arrayUtil'
import ScrollDiv from '@/components/Div/ScrollDiv'
export default {
  name: 'DataResource',
  components: {
    InputSearch,
    ScrollDiv
  },
  props: [],
  data() {
    this.keyId = 0
    return {
      activeNames: [], // 折叠面板展开内容
      treeDataList: [], // 多棵数内容
      defaultProps: {
        children: 'children',
        label: 'title',
        disabled: (data, node) => {
          // 如果有resourceAndLayers（目录） 并且（有resourceByTree & resourceByTree.iscachelayer === 1）（切到图层） 不能选择
          if (data.resourceAndLayers || (data.resourceByTree && data.resourceByTree.iscachelayer)) {
            return true
          }
          return false
        }
      },
      serchKey: ''
    }
  },
  created() {
  },
  mounted() {
    this.getMenuData()
  },
  methods: {
    // 获取后台数据展示树
    getMenuData() {
      oneMapApi.getServiceResourceTreeData().then(res => {
        if (res.ReturnCode === 0) {
          this.treeDataList = this.dataToTree(res.Data)
          // 默认选择电子地图，node-key为_key_3;使用setTimeout的目的是确保gis地图先初始化完毕，在执行这里
          // this.$nextTick(() => {
          //   if (this.initMapDone) {
          //     this.$refs.tree[0].setChecked('_key_3', true, false)
          //   } else {
          //     // 添加到地图执行完成后的事件队列
          //     this.$store.commit('onemapApplication/addInitMapCallBackArr', () => this.$refs.tree[0].setChecked('_key_3', true, false))
          //   }
          // })
        }
      })
    },
    getNewKeyId() {
      const newId = `_key_${this.keyId}`
      this.keyId = this.keyId + 1
      return newId
    },
    // 把获取的数据转换为树
    dataToTree(array) {
      // 处理layerinfos 方法
      // 将layerinfos 数组的layername赋值到title，找到根节点数组，返回根节点数组各自的树组成的数组
      const doLayerInfo = ({ layerinfos, resourceByTree }) => {
        const { areacode, resourceid } = resourceByTree
        const parsedLayerinfos = layerinfos.map((layerinfo) => {
          return Object.assign({ _element_key: this.getNewKeyId() }, layerinfo, { title: layerinfo.layername }, { areacode, resourceid })
        })
        const rooterList = parsedLayerinfos.filter(layer => layer.parentlayerid === null)
        const treeObj = arrayToTree(parsedLayerinfos, 'layerid', 'parentlayerid', layer => {
          return layer.parentlayerid === null
        })
        return rooterList.map(rooter => treeObj.mapObj[rooter.layerid])
      }
      // 找到几个根节点
      const rooterList = array.filter((item) => {
        return item.pid === null
      })
      // 进行数据转换，将字段不统一的，统一成children和title，便于el-tree展示
      const parsedData = array.map((treenode) => {
        // eslint-disable-next-line
        // 有resourceAndLayers的节点，把resourceAndLayers改成children  iscachelayer为0表示没有切到图层，不显示
        // _element_key 目的是给element-tree增加唯一标识
        if (treenode.resourceAndLayers) {
          return Object.assign({ _element_key: this.getNewKeyId() }, treenode, {
            // resourceAndLayers每一个数组项都是一个对象，对象里面的layerinfos(子图层)还需要再处理，并且组成树
            children: treenode.resourceAndLayers.map((layer) => {
              return Object.assign({ _element_key: this.getNewKeyId() }, layer, {
                title: layer.resourceByTree.resourcename,
                children: layer.resourceByTree.iscachelayer ? doLayerInfo(layer) : []
              })
            })
          })
        } else {
          return Object.assign({ _element_key: this.getNewKeyId() }, treenode)
        }
      })
      const treeObj = arrayToTree(parsedData, 'id', 'pid')

      return rooterList.map(rooter => {
        return treeObj.mapObj[rooter.id]
      })
    },
    // 树节点选中状态改变(暂不用)
    // onNodeCheck(data, node) {
    //   const layersList = []
    //   const checked = node.checkedKeys.some(checkedKey => checkedKey === data._element_key)
    //   const checkNode = nodeData => {
    //     // 图层组
    //     if (nodeData.resourceByTree) {
    //       const { resourceByTree } = nodeData
    //       // 切到图层，需要返回子节点的所有图层
    //       if (resourceByTree.iscachelayer && nodeData.children && nodeData.children.length) {
    //         nodeData.children.forEach(childNode => {
    //           checkNode(childNode)
    //         })
    //       } else {
    //         layersList.push(Object.assign({}, Object.assign({}, resourceByTree, { _element_key: nodeData._element_key }), { _layerType: 1 })) // 图层组，某些没有切到子图层的，需要把_element_key一起带过去
    //       }
    //     } else {
    //       layersList.push(Object.assign({}, nodeData, { _layerType: 2 })) // 图层
    //     }
    //   }
    //   checkNode(data)
    //   if (layersList.length) {
    //     this.$store.commit('onemapApplication/setLayerOperate', { type: checked ? 'add' : 'remove', layers: layersList })
    //   }
    // },
    // 树节点选中状态改变
    onNodeCheckChange(data, checked) {
      // 如果不是子节点则跳过
      if (data.children.length > 0) {
        return
      }
      const layersList = []

      if (data.resourceByTree) {
        layersList.push(Object.assign({}, Object.assign({}, data.resourceByTree, { _element_key: data._element_key }), { _layerType: 1 })) // 图层组，某些没有切到子图层的，需要把_element_key一起带过去
      } else {
        layersList.push(Object.assign({}, data, { _layerType: 2 })) // 图层
      }
      if (layersList.length) {
        this.$store.commit('onemapApplication/setLayerOperate', { type: checked ? 'add' : 'remove', layers: layersList })
      }
    },
    // 树过滤方法
    filterNode(value, data) {
      return data.title.indexOf(value) > -1
    }
  },
  watch: {
    serchKey() {
      for (let i in this.$refs.tree) {
        this.$refs.tree[i].filter(this.serchKey)
      }
    }
  },
  computed: {
    initMapDone() {
      return this.$store.state.onemapApplication.initMapDone
    }
  }
}
</script>
<style lang="scss" scoped>
.data-resource {
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
    height: calc(100% - 130px);
  }
}
</style>
