<!--
 * @Description: 三维专题数据
 * @Author: hzh
 * @Date: 2019-12-25 10:43:34
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
        <el-collapse-item
          :title="item.title"
          :name="item.id"
          v-for="(item,index) in treeDataList"
          :key="index"
        >
          <el-tree
            :data="item.children"
            :show-checkbox="true"
            :props="defaultProps"
            :default-checked-keys="defaultCheckedKeys"
            @check-change="onNodeCheck"
            node-key="layerName"
            :filter-node-method="filterNode"
            ref="tree"
          />
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
import { Map3D } from '../../../../api/Map3D/Map3D' //三维地图
export default {
  name: 'ThematicData',
  components: {
    InputSearch,
    ScrollDiv
  },
  props: [],
  data() {
    return {
      activeNames: [], // 折叠面板展开内容
      treeDataList: window.Map3DConfig.mapTheme3D, // 多棵树内容
      defaultProps: {
        children: 'children',
        label: 'layerName'
        // disabled: (data, node) => {
        //   return false
        // }
      },
      serchKey: '',
      defaultCheckedKeys: [] // 默认选中的keys，此时必须设置树的node-key，并且是唯一值
    }
  },
  created() {
    // 默认加载的专题图层,树数据中的key组合的数组
    var themeList = this.treeDataList
    //console.log('thiemeList;' + themeList)
    for (var i = 0; i < themeList.length; i++) {
      var themeConfig = themeList[i]
      var dataList = themeConfig.children
      for (var j = 0; j < dataList.length; j++) {
        var layerConfig = dataList[j]
        var layerName = layerConfig.layerName

        var layerType = layerConfig.layerType
        if (layerType === '101') {
          if (layerConfig.visibility) {
            this.defaultCheckedKeys.push(layerName)
          }
        } else if (layerType === '201' || layerType === '301') {
          var options = layerConfig.options
          if (options.visibility) {
            this.defaultCheckedKeys.push(layerName)
          }
        }
      }
    }
    //this.defaultCheckedKeys = ['影像图']
  },
  mounted() {},
  methods: {
    // 树节点选中状态改变。共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    onNodeCheck(data, isCheck, childHasCheck) {
      // console.log('data:' + data)
      // console.log('check:' + isCheck)
      // console.log('childIschek:' + childHasCheck)
      var layerConfig = data
      var layerName = layerConfig.layerName
      var layerUrl = layerConfig.dataUrl
      var layerType = layerConfig.layerType
      if (layerType === '101') {
        var imgLayer = Map3D.getLayer(Map3D.map3DObject, layerName, layerType)
        if (imgLayer) {
          imgLayer.show = isCheck
        } else {
          imgLayer = Map3D.addImageLayer(
            Map3D.map3DObject,
            layerName,
            layerUrl,
            isCheck
          )
        }
      } else if (layerType === '201' || layerType === '301') {
        var s3mLayer = Map3D.getLayer(Map3D.map3DObject, layerName, layerType)
        if (s3mLayer) {
          s3mLayer.visible = isCheck
        } else {
          var options = layerConfig.options
          options.visibility = isCheck
          s3mLayer = Map3D.addModelLayer(
            Map3D.map3DObject,
            layerName,
            'model',
            layerUrl,
            options,
            layerConfig.queryParameter
          )
        }
      }
    },
    // 树过滤方法
    filterNode(value, data) {
      // 根据图层名称过滤
      return data.layerName.indexOf(value) > -1
    }
  },
  watch: {
    serchKey() {
      for (let i in this.$refs.tree) {
        this.$refs.tree[i].filter(this.serchKey)
      }
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
