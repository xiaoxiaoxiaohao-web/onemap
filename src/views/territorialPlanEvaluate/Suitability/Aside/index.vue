<template>
  <div class="TPE-aside">
    <el-row>
        <el-col :span="24">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @select="handleSelect"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <span>生态保护重要性评价</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,index) in ecologicalList" :index="item.title" :key="index">
                  <i :class="item.className" class="i-actived"></i>
                   {{item.title}}
                  </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <span>农业生产适宜性评价</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="(item,index) in agriculturalList" :index="item.title" :key="index">
                  <i :class="item.className" class="i-actived"></i>
                   {{item.title}}
                  </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <span>城镇建设适宜性评价</span>
              </template>
              <el-menu-item-group>
               <el-menu-item v-for="(item,index) in constructionList" :index="item.title" :key="index">
                  <i :class="item.className" class="i-actived"></i>
                   {{item.title}}
                  </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import executeMixin from '@/views/components/Map/mixin/executeMixin'
export default {
  name: 'TPEAside',
  components: {},
  props: [],
  mixins: [executeMixin],
  data() {
    return {
      ecologicalList: [//生态保护

      ],
      agriculturalList: [ //农业生产
        {
          'title': '集成评价',
          'className': 'icon-tb01',
          'id': 0

        },
        {
          'title': '土地资源评价',
          'className': 'icon-tb02',
          'id': 1
        },
        {
          'title': '水资源评价',
          'className': 'icon-tb03',
          'id': 2
        },
        {
          'title': '气候评价',
          'className': 'icon-tb04',
          'id': 3
        },
        {
          'title': '环境评价',
          'className': 'icon-tb05',
          'id': 4
        },
        {
          'title': '灾害评价',
          'className': 'icon-tb06',
          'id': 5
        },
        {
          'title': '生态评价',
          'className': 'icon-tb07',
          'id': 6
        }
      ],
      constructionList: [ //城镇建设

      ]
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    handleSelect(key, keyPath) {
      console.log('双评价结果图层加载')
      //清空
      switch (key) {
        case '土地资源评价':
          this.excuteMapMethod('addResultServer')
          break
        case '水资源评价':
          console.log(key)
          console.log(keyPath)
          break
        default:
          console.log(key)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
.TPE-aside {
  width: 200px;
  height: 100%;
  background:#293C98;
}

</style>
