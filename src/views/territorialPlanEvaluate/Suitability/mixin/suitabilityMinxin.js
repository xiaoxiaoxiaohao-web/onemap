import landEvaluation from '@/api/landEvaluation'
const suitabilityMinxin = {
  data() {
    return {}
  },
  mounted() { },
  methods: {
    // 打印地图
    suitabilityExportMap(imgWidth, imgHeight, paperSize) {
      // 打印地图
      let width = this.$refs.arcgisMap.offsetWidth
      let height = this.$refs.arcgisMap.offsetHeight
      // 参数设置
      let area = {
        x: 0,
        y: 0,
        width: width,
        height: height
      }
      const _this = this
      // set the position of the div element that marks the selected area
      // 截图方式
      this.gisInst.view.takeScreenshot({ area: area, format: 'png' })
        .then(function (screenshot) {
          // display a preview of the image
          console.log('打印地图：' + imgWidth, imgHeight)
          // 1.根据比例调整图片大小
          let iframe = document.getElementById('print-iframe')
          let doc = iframe.contentWindow.document.body
          // 2. 添加外部DIV
          let div = document.createElement('div')
          div.width = _this.MMToPX(imgWidth)
          div.height = _this.MMToPX(imgHeight)
          div.style.position = 'relative'
          div.style.display = 'flex'
          div.style.alignItems = 'center'
          div.style.justifyContent = 'center'
          // 3.添加图片
          // 创建img元素
          let img = document.createElement('img')
          img.src = screenshot.dataUrl
          if (imgWidth > imgHeight) {
            img.style.width = 'auto'
            img.style.height = '100%'
          } else {
            img.style.width = '100%'
            img.style.height = 'auto'
          }
          // img.width = _this.MMToPX(imgWidth)
          // img.height = _this.MMToPX(imgHeight)
          // img.style.backgroundColor = 'red'
          // 添加到ifram中
          img.onload = function () {
            console.log('图片加载完成,选择内容为：' + paperSize)
            iframe.contentWindow.paperSize = paperSize
            iframe.contentWindow.print()
          }
          div.appendChild(img)
          doc.appendChild(div)
          // doc.appendChild(img)
          doc.close()
          iframe.contentWindow.focus()
        })
    },
    // 毫米与像素的转换
    MMToPX(mm) {
      const dpi = window.screen.deviceXDPI
      return mm * (dpi / 25.4)
    },
    streetLocation(streetName) {
      var pt
      switch (streetName) {
        case '板芙镇':
          pt = new this.gisConstructor.Point({
            x: 494682.056,
            y: 2477714.520,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '大涌镇':
          pt = new this.gisConstructor.Point({
            x: 489800.483,
            y: 2485532.973,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '东凤镇':
          pt = new this.gisConstructor.Point({
            x: 490435.485,
            y: 2509901.147,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '东区':
          pt = new this.gisConstructor.Point({
            x: 505516.765,
            y: 2489620.794,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '东升镇':
          pt = new this.gisConstructor.Point({
            x: 492896.114,
            y: 2500812.691,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '阜沙镇':
          pt = new this.gisConstructor.Point({
            x: 498134.875,
            y: 2507361.142,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '港口镇':
          pt = new this.gisConstructor.Point({
            x: 502727.666,
            y: 2500270.024,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '古镇镇':
          pt = new this.gisConstructor.Point({
            x: 480989.841,
            y: 2503590.822,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '横栏镇':
          pt = new this.gisConstructor.Point({
            x: 485672.975,
            y: 2494264.241,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '黄圃镇':
          pt = new this.gisConstructor.Point({
            x: 500278.004,
            y: 2513830.217,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '火炬区':
          pt = new this.gisConstructor.Point({
            x: 510993.651,
            y: 2494899.242,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '民众镇':
          pt = new this.gisConstructor.Point({
            x: 514009.907,
            y: 2502876.445,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '翠亨新区起步区':
          pt = new this.gisConstructor.Point({
            x: 524566.803,
            y: 2492478.300,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '南朗镇':
          pt = new this.gisConstructor.Point({
            x: 517621.476,
            y: 2487358.602,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '南区':
          pt = new this.gisConstructor.Point({
            x: 496348.934,
            y: 2484501.096,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '南头镇':
          pt = new this.gisConstructor.Point({
            x: 492975.490,
            y: 2512838.028,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '三角镇':
          pt = new this.gisConstructor.Point({
            x: 506786.767,
            y: 2509464.584,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '三乡镇':
          pt = new this.gisConstructor.Point({
            x: 506191.454,
            y: 2473150.448,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '神湾镇':
          pt = new this.gisConstructor.Point({
            x: 498293.625,
            y: 2467713.250,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '石岐区':
          pt = new this.gisConstructor.Point({
            x: 500833.630,
            y: 2493589.552,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '坦洲镇':
          pt = new this.gisConstructor.Point({
            x: 506231.141,
            y: 2463426.991,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '五桂山':
          pt = new this.gisConstructor.Point({
            x: 505556.452,
            y: 2480651.401,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '西区':
          pt = new this.gisConstructor.Point({
            x: 497261.748,
            y: 2495296.118,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '小榄镇':
          pt = new this.gisConstructor.Point({
            x: 486744.540,
            y: 2505614.888,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '沙溪镇':
          pt = new this.gisConstructor.Point({
            x: 493967.679,
            y: 2490970.172,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 3
          this.gisInst.view.center = pt
          break
        case '中山市':
          pt = new this.gisConstructor.Point({
            x: 503293.214,
            y: 2492449.917,
            spatialReference: this.gisInst.view.spatialReference
          })
          this.gisInst.view.zoom = 0
          this.gisInst.view.center = pt
          break
      }
    },
    //清空双评价内服务图层
    clearResultServer(currentLayer) {
      if (currentLayer != null) {
        this.gisInst.map.remove(currentLayer)
      }
    },
    //添加评价结果服务(需要改成)
    addResultServer() {
      console.log('双评价结果图层加载-js')
      const resultServer = new this.gisConstructor.FeatureLayer({
        //id: 'result',
        url: 'http://172.26.156.205:8080/arcgis/rest/services/APLRE/MapServer/1'
      })
      this.gisInst.map.add(resultServer)
      this.gisInst.view.on('click', (evt) => {
        this.mapToTable(evt)
      })
    },
    //地图与表格交互
    //获取表行ID》地图(两种高亮获取的方式，数据源内有graphic直接用；上server取)
    tableToMap(tableId) {
      //var query = featureLayer.createQuery()
      //query.where = "STATE_NAME = 'Washington'"
      //拿到ID》query》where id = 》返回graphic》
      //执行这个方法之前先清空 this.gisInst.view.graphics.removeAll()
      var result = landEvaluation.getRing(tableId)
      var graphic = result.graphic
      //自定义高亮
      graphic.symbol = {
        type: 'simple-fill',
        color: [0, 0, 0, 1],
        outline: {
          color: 'black',
          width: 1
        }
      }
      this.gisInst.view.graphics.add(graphic)
      //缩放到该范围
    },
    //获取表行地图》ID
    mapToTable(evt) {
      //执行这个方法之前先绑定地图点击事件 view.on('click',function(evt))
      this.gisInst.view.hitTest(evt).then((response) => {
        var result = response.results[0]
        if (result && result.graphic) {
          console.log(result)
          var graphic = result.graphic

          var polygon = {
            type: 'polygon',
            rings: graphic.geometry.rings,
            spatialReference: this.gisInst.view.spatialReference
          }
          var drawGraphic = new this.gisConstructor.Graphic({
            geometry: polygon,
            symbol: {
              type: 'simple-fill',
              color: [255, 255, 255, 0],
              style: 'solid',
              outline: {
                color: 'red',
                width: 2
              }
            }
          })
          //自定义高亮
          graphic.symbol = {
            type: 'simple-fill',
            color: [255, 255, 255, 0],
            outline: {
              color: 'red',
              width: 2
            }
          }
          this.gisInst.view.graphics.removeAll()
          this.gisInst.view.graphics.add(graphic)
          console.log(this.gisInst.view.zoom)
          //this.gisInst.view.setExtent(graphic.geometry.extent)
          //this.gisInst.view.extent =
          var x = (graphic.geometry.extent.xmax + graphic.geometry.extent.xmin) / 2
          var y = (graphic.geometry.extent.ymax + graphic.geometry.extent.ymin) / 2
          var pt = new this.gisConstructor.Point({
            x: x,
            y: y,
            spatialReference: this.gisInst.view.spatialReference
          })

          this.gisInst.view.center = pt
        }
      })
    }
  },
  computed: {
  },
  watch: {
  }
}
export default suitabilityMinxin
