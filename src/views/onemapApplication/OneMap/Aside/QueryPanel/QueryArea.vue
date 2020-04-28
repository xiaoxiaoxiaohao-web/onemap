<template>
  <div class="QueryArea" :class="{'active':areaActive}">
    <ul class="QueryArea-cont cursor-pointer clear-fix no-select">
      <li v-for="(Evry,index) in listAreaCheck" :key="index" @click="onSelectAreaClick(Evry)" :class="{'changeBeforeStyle':isChecked === index}">
        {{Evry.name}}
      </li>
    </ul>

    <!--区域选择-->
    <div class="QueryList-cont" v-show="isChecked === 0">
      <ScrollDiv>
        <span class="no-select" style="position: relative" v-for="(item,index) in getQueryArea" :key="index" @click="onItemClick(item,index)" :class="{'changeStyle':item.id === isAreaChecked}">
          {{item.areaName}}
        </span>
      </ScrollDiv>
    </div>

    <!--区域绘制-->
    <div class="AreaDraw" v-show="isChecked === 1">
      <div class="beginDraw cursor-pointer" @click="onDrawClick">开始绘制</div>
      <!-- <p class="AreaDraw-title">提示:请在地图中绘制要分析的范围</p> -->
    </div>

    <!--区域导入-->
    <div v-show="isChecked === 2">
      <div class="AreaUpload clear-fix">
        <p class="AreaUpload-title">请选择叠加文件:</p>
        <div class="AreaUpload-cont">
          <el-upload class="upload-demo" action="" accept="*" :show-file-list="false" :on-success="successFun" :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ScrollDiv from '@/components/Div/ScrollDiv'
import executeMixin from '@/views/components/Map/mixin/executeMixin'
import SpatialAnalysis from '@/api/SpatialAnalysis'
export default {
  name: 'QueryArea',
  mixins: [executeMixin],
  props: { QueryArea: { type: Array } },
  components: {
    ScrollDiv
  },
  data() {
    return {
      listAreaCheck: [
        {
          'name': '区域选择',
          'id': 0,
          'checked': false
        },
        {
          'name': '区域绘制',
          'id': 1,
          'checked': false
        },
        {
          'name': '区域导入',
          'id': 2,
          'checked': false
        }
      ],
      isAreaChecked: '',
      isChecked: 0,
      areaArr: [], //选择区域选择中的区域数组
      uploadFileType: '',
      areaActive: false

    }
  },
  computed: {
    getQueryArea() {
      //获取所有的区域
      return this.$store.state.onemapApplication.getAllAreaData
    },
    getQueryListChangeVal() {
      //QueryList点击切换时的id
      return this.$store.state.onemapApplication.getQueryListChangeVal
    }
  },
  watch: {
    getQueryListChangeVal(newVal, oldVal) {
      //根据每一次QueryList点击切换时的id不同,传递到点击查询部分的查询条件也不同,所以要清空查询条件(避免之前的条件存在)
      if (newVal !== oldVal) {
        this.areaArr = []
        this.$emit('funcArea', this.areaArr)
      }
    },
    isChecked(val) {
      // if (val === 1) {
      //   this.areaArr = []
      //   this.$emit('funcArea', this.areaArr)
      //   this.excuteMapMethod('drawPolygon') //开始在地图上画
      // } else {
      //   this.excuteMapMethod('removDarwFun') //清除地图所有的东西
      // }
      this.excuteMapMethod('removDarwFun') //清除地图所有的东西
    }
  },
  methods: {
    onAreaTrueClick() { //地点查询
      this.isChecked = 0
      this.areaArr = []
      this.$emit('funcArea', this.areaArr)
      this.isAreaChecked = ''
    },
    onAreaFalseClick() { //规划查询
      this.isChecked = 0
      this.areaArr = []
      this.$emit('funcArea', this.areaArr)
      this.isAreaChecked = ''
    },
    onSpecilFalseClick() { //专题查询
      this.isChecked = 0
      this.areaArr = []
      this.$emit('funcArea', this.areaArr)
      this.isAreaChecked = ''
    },
    //区域4个大标题的切换
    onSelectAreaClick(argums) {
      this.isChecked = argums.id
    },
    onItemClick(item, id) {
      this.excuteMapMethod('removDarwFun') //清空绘制线
      this.areaArr = []
      if (this.isAreaChecked === id) {
        this.isAreaChecked = ''
      } else {
        this.isAreaChecked = id
        this.areaArr.push(item.areaName)
      }
      this.$emit('funcArea', this.areaArr)
    },
    onDrawClick() {
      this.areaArr = []
      this.$emit('funcArea', this.areaArr)
      this.excuteMapMethod('drawPolygon') //开始在地图上画
    },
    //上传文件夹和文件部分
    beforeAvatarUpload(file) {
      // 校验
      console.log(file)
      let typeLength = file.name.length - 3
      this.uploadFileType = file.name.slice(typeLength)
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        console.log('大小不得超过50M')
        return false
      }
      let fileName = file.name
      console.log('fileName:::', fileName)
      let formData = new FormData()
      formData.append(fileName, file)
      let fileType = ['shp', 'SHP', 'cad', 'CAD']
      let canUpLoad = fileType.some((item) => {
        return item === this.uploadFileType
      })
      // 执行
      let param = new FormData()
      param.append('file', file)
      SpatialAnalysis.importFile(param).then(response => {
        console.log('导入')
        this.successFun(response)
      })
      return false
    },
    successFun(response, file, fileList) {
      // response中携带有后台返回的内容
      // console.log(response, file, fileList)
      let getGeoList = response.data.geometryData // string类型
      this.$message({
        type: 'success',
        message: '上传成功'
      })
      let list = JSON.parse(getGeoList)
      // 1.修改数据--地图上画出红线范围
      this.$store.commit('onemapApplication/setGeoList', list.rings)
      // 2.把范围给到coordinate，用于查询
      this.$store.commit('onemapApplication/setCoordinate', JSON.stringify(list.rings[0]))
    }

  }
}
</script>

<style scoped lang="scss">
.QueryArea {
  // margin-top: 20px;
  background: #3c4db5;
  border-bottom: 1px solid #3f50ba;
  &.active {
    margin-top: 0;
  }
}
.QueryArea-cont {
  li {
    float: left;
    width: 33.3%;
    height: 37px;
    line-height: 37px;
    font-size: 16px;
    font-family: 'Microsoft YaHei';
    color: #c3ccf2;
    text-align: center;
    list-style: none;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 15%;
      width: 0;
      height: 3px;
      border-bottom: 2px solid #00eafe;
    }
    &:hover {
      color: #00eafe;
      &::before {
        width: 70%;
      }
    }
    &.changeBeforeStyle {
      color: #00eafe;
    }
  }
}
.QueryArea-cont li:nth-child(4):hover::before {
  left: 32.5%;
  width: 35%;
}
.QueryArea-cont li.changeBeforeStyle::before {
  width: 70%;
}

.QueryList-cont {
  height: 250px;
  padding-bottom: 10px;
  background: #17266e;
  span {
    display: inline-block;
    width: 100px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-top: 10px;
    margin-left: 4%;
    font-size: 12px;
    font-family: 'Microsoft YaHei';
    color: #a1aee4;
    border: 1px solid rgba(80, 100, 199, 0.75);
    border-radius: 5px;
    position: relative;
    cursor: pointer;
  }
  .changeStyle {
    background: url('./QueryImg/checked.png') no-repeat center;
    background-size: 20px 15px;
    background-position: right bottom;
    border: 1px solid rgba(33, 189, 202, 1);
    border-radius: 5px;
    color: #ffffff;
  }
  .QueryList-cont-checked {
    width: 20px;
    height: 10px;
    position: absolute;
    right: 0;
    bottom: 0;
  }
}

.AreaDraw {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background: #17266e;
}
.beginDraw {
  display: inline-block;
  padding: 0 0.2rem;
  height: 0.3rem;
  line-height: 0.3rem;
  text-align: center;
  border: 1px solid rgba(80, 100, 199, 0.75);
  border-radius: 0.05rem;
  font-size: 0.12rem;
  font-family: 'Microsoft YaHei';
  text-align: center;
  background: #5877ff;
  color: #ffffff;
}
.AreaDraw-title {
  padding-top: 20px;
  padding-left: 10%;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: white;
}
.AreaUpload {
  height: 100px;
  background: #182770;
}
.AreaUpload-title,
.AreaUpload-cont {
  float: left;
  width: 70px;
  height: 24px;
}
.AreaUpload-title {
  width: 103px;
  padding-top: 20px;
  padding-left: 10%;
  font-size: 14px;
  font-family: 'Microsoft YaHei';
  color: white;
}
.AreaUpload-cont {
  margin-left: 2%;
  margin-top: 15px;
  background: #2f46ad;
}
.AreaSelect {
  height: 100px;
  background: #182770;
}
</style>
