<template>
  <div class="popup" v-show="queryClick">
    <div class="sourceTree">
      <ScrollDiv>
        <el-tree :data="tree" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </ScrollDiv>
    </div>
    <div class="content">
      <ScrollDiv>
        <el-table :data="table" border style="width: 100%">
          <el-table-column prop="field" label="属性">
          </el-table-column>
          <el-table-column prop="value" label=值>
          </el-table-column>
        </el-table>
      </ScrollDiv>
    </div>
    <div class='popupClose' @click="popupClose()">
      关闭
    </div>
  </div>
</template>

<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
export default {
  components: { ScrollDiv },
  data() {
    return {
      table: [],
      attributeArr: [],
      tree: [{
        id: 0,
        label: '项目范围线',
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      queryClick: false
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    handleNodeClick(data) {
      //console.log(data)
      if (data.attribute) {
        this.table = data.attribute
      }
    },
    popupClose() {
      this.queryClick = false
    }
  },
  computed: {
    resultAttributes() {
      return this.$store.state.content.resultAttributes
    }
  },
  watch: {
    resultAttributes(val) {
      //console.log(val)
      this.tree[0].children = []
      var name = 'YDXZDM'
      for (let i = 0; i < val.length; i++) {
        this.attributeArr = []
        for (let key in val[i]) {
          if (key === 'YDXZDM') {
            name = val[i][key]
          }
          if (key !== 'FGUID' & key !== 'SHAPE' & key !== 'SHAPE.AREA' & key !== 'SHAPE.LEN' & key !== 'SHAPE_LENG' & key !== 'OBJECTID_1' & key !== 'Shape' & key !== 'OBJECTID' & key !== 'Shape_Length' & key !== 'Shape_Area') {
            var data = {
              field: key,
              value: val[i][key]
            }

            this.attributeArr.push(data)
          }
        }
        this.tree[0].children.push({
          id: i + 1,
          label: name,
          attribute: this.attributeArr,
          geometry: []
        })
      }
      this.queryClick = true
    }
  }
}
</script>
<style lang="scss" scoped>
.popup {
  width: 100%;
  height: 50px;
  padding: 20px;
  .sourceTree {
    width: 40%;
    height: 100%;
    float: left;
    overflow-y: auto;
  }
  .content {
    float: left;
    margin-left: 10px;
    width: 57%;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
