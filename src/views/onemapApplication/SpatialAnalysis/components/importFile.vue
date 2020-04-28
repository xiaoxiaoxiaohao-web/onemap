<template>
  <div class="import-file" cid="importFile">
    <div class="content-div">
      <!-- accept接受文件类型 multiple多文件上传 -->
      <el-upload class="upload-el-div" action="" :before-upload="beforeUpload" :file-list="fileList">
        <el-button size="small" type="success" ref="uploadBtn">上传文件</el-button>
      </el-upload>
    </div>
  </div>
</template>
<script>
import SpatialAnalysis from '@/api/SpatialAnalysis'
export default {
  name: 'importFile',
  components: {},
  props: [],
  data() {
    return {
      fileList: [],
      uploadFileType: ''
    }
  },
  created() { },
  mounted() {
  },
  methods: {
    // 上传文件之前的钩子
    beforeUpload(file) {
      // console.log('上传文件之前的钩子')
      let typeLength = file.name.length - 3
      this.uploadFileType = file.name.slice(typeLength)
      // 如果上传内容与所选内容一致,判断文件是否是cad或者shp
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
    // 上传成功后方法
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
    },
    // 模拟上传点击
    onUploadBtnClick() {
      // console.log('模拟上传点击')
      this.$refs.uploadBtn.$el.click()
    }
  },
  computed: {},
  watch: {}
}
</script>
<style scoped>
.import-file {
  width: 100%;
  height: 100%;
}
/* 单选 */
.radio-div {
  text-align: left;
  font-size: 16px;
}
/* 内容 */
.content-div {
  height: 50px;
  padding: 10px 0px;
  text-align: left;
}
.upload-el-div {
  width: 100%;
  height: 50px;
  text-align: left;
}
.bottom-div {
  height: 28px;
  padding: 0px 10px;
  display: flex;
  justify-content: flex-end;
}
/* 底部按钮 */
.bottom-div button {
  width: 75px;
  height: 28px;
  line-height: 28px;
  padding: 0;
  cursor: pointer;
}
</style>
