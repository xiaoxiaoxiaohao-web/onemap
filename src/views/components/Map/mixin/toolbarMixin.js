/* eslint-disable no-loop-func */
import oneMapApi from '@/api/oneMap'
const toolbarMixin = {
  data() {
    return {
      arrayData: []
    }
  },
  mounted() {},
  methods: {
    addDistanceMeasure() {
      this.gisInst.view.graphics.removeAll()
      let action = this.gisInst.draw.create('polyline')
      this.gisInst.view.focus()
      let createPolylineGraphic = vertices => {
        this.gisInst.view.graphics.removeAll()
        let polyline = new this.gisConstructor.Polyline({
          paths: vertices,
          spatialReference: this.gisInst.view.spatialReference
        })

        var graphic = new this.gisConstructor.Graphic({
          geometry: polyline,
          symbol: {
            type: 'simple-line',
            color: [0, 191, 255],
            width: 3,
            cap: 'round',
            join: 'round'
          }
        })
        this.gisInst.view.graphics.add(graphic)
        let symbol = {
          type: 'simple-marker',
          color: [255, 255, 255],
          size: 6,
          outline: {
            color: [255, 0, 0],
            width: 1.5
          }
        }
        var path = []
        for (let i = 0; i < vertices.length; i++) {
          let point = {
            type: 'point',
            x: vertices[i][0],
            y: vertices[i][1],
            spatialReference: this.gisInst.view.spatialReference
          }
          var arr = []
          arr.push(vertices[i][0])
          arr.push(vertices[i][1])
          path.push(arr)
          var line = new this.gisConstructor.Polyline({
            hasZ: false,
            hasM: true,
            paths: path,
            spatialReference: this.gisInst.view.spatialReference
          })
          let dislen = null
          let unit = ''
          if (this.gisInst.view.scale > 5000) {
            dislen = this.gisConstructor.geometryEngine.planarLength(
              line,
              'kilometers'
            )
            unit = '千米'
          } else {
            dislen = this.gisConstructor.geometryEngine.planarLength(
              line,
              'meters'
            )
            unit = '米'
          }
          let textSymbol = {
            type: 'text',
            color: 'white',
            haloColor: 'black',
            haloSize: '5px',
            text: Math.abs(Math.round(dislen * 100) / 100) + unit,
            xoffset: '20px',
            yoffset: '20px',
            font: {
              size: 12,
              family: 'sans-serif',
              weight: 'bold'
            }
          }

          let textGraphics = new this.gisConstructor.Graphic({
            geometry: point,
            symbol: textSymbol
          })
          let Graphics = new this.gisConstructor.Graphic({
            geometry: point,
            symbol: symbol
          })
          this.gisInst.view.graphics.add(textGraphics)
          this.gisInst.view.graphics.add(Graphics)
        }
      }
      action.on(
        ['vertex-add', 'vertex-remove', 'cursor-update', 'draw-complete'],
        function(evt) {
          createPolylineGraphic(evt.vertices)
        }
      )
    },
    addAreaMeasure() {
      this.gisInst.view.graphics.removeAll()
      const action = this.gisInst.draw.create('polygon')
      this.gisInst.view.focus()
      let createPolygonGraphic = vertices => {
        this.gisInst.view.graphics.removeAll()
        let polygon = new this.gisConstructor.Polygon({
          type: 'polygon',
          rings: vertices,
          spatialReference: this.gisInst.view.spatialReference
        })
        let graphic = new this.gisConstructor.Graphic({
          geometry: polygon,
          symbol: {
            type: 'simple-line', // autocasts as new SimpleFillSymbol
            color: [255, 116, 3],
            width: 2,
            cap: 'round',
            join: 'round'
          }
        })
        this.gisInst.view.graphics.add(graphic)
        var center = polygon.centroid
        var area = 0
        var unit = ''
        if (this.gisInst.view.scale > 5000) {
          area = this.gisConstructor.geometryEngine.planarArea(
            graphic.geometry,
            'square-kilometers'
          )
          unit = '平方千米'
        } else {
          area = this.gisConstructor.geometryEngine.planarArea(
            graphic.geometry,
            'square-meters'
          )
          unit = '平方米'
        }
        var pointcenter = {
          type: 'point',
          x: center.x,
          y: center.y,
          spatialReference: this.gisInst.view.spatialReference
        }

        var textSymbol = {
          type: 'text',
          color: 'white',
          haloColor: 'black',
          haloSize: '5px',
          text: Math.abs(Math.round(area * 100) / 100) + unit,
          font: {
            size: 12,
            family: 'sans-serif',
            weight: 'bold'
          }
        }
        var textGraphics = new this.gisConstructor.Graphic({
          geometry: pointcenter,
          symbol: textSymbol
        })

        this.gisInst.view.graphics.add(textGraphics)
      }
      action.on(
        ['vertex-add', 'draw-complete', 'vertex-remove', 'cursor-update'],
        function(evt) {
          createPolygonGraphic(evt.vertices)
        }
      )
    },
    removeMeasure() {
      this.gisInst.draw.reset()
      this.gisInst.view.graphics.removeAll()
    },
    locate(x, y) {
      this.gisInst.view.graphics.removeAll()
      let point = new this.gisConstructor.Point({
        x: x,
        y: y,
        spatialReference: this.gisInst.view.spatialReference
      })
      this.gisInst.view.center = point
      this.gisInst.view.zoom = 5
      let pointShow = new this.gisConstructor.Graphic({
        geometry: point,
        symbol: {
          type: 'simple-marker',
          color: [255, 0, 0],
          size: 6
        }
      })
      this.gisInst.view.graphics.add(pointShow)
    },
    setMultiScreen(num) {
      document.getElementById('arcgisMap').style.width = '50%'
      document.getElementById('arcgisMap_1').style.width = '50%'
      if (num === 1) {
        document.getElementById('arcgisMap_1').style.height = '100%'
        document.getElementById('arcgisMap_2').style.height = '0'
        document.getElementById('arcgisMap_2').style.width = '0'
      }
      if (num === 2) {
        document.getElementById('arcgisMap_1').style.height = '50%'
        document.getElementById('arcgisMap_2').style.height = '50%'
        document.getElementById('arcgisMap_2').style.width = '50%'
      }
      let views = []
      for (let i = 1; i <= num; i++) {
        views[i] = new this.gisConstructor.MapView({
          map: this.gisInst.map,
          extent: this.gisInst.extent,
          container: 'arcgisMap_' + i
        })
        views[i].ui._removeComponents(['attribution'])
        this.gisConstructor.watchUtils.when(views[i], 'animation', function(
          animation
        ) {
          animation.finish()
          // eslint-disable-next-line no-shadow
          animation.when(function(animation) {}).catch(function(animation) {})
        })
        this.gisInst.view.on(['mouse-wheel', 'drag', 'hold'], event => {
          setTimeout(() => {
            views[i].viewpoint = this.gisInst.view.viewpoint
          }, 50)
        })
      }
    },
    //统计查询
    analysisQuery(url, rings, field, statisticType, name, callback) {
      let geometry = new this.gisConstructor.Polygon({
        rings: [rings],
        spatialReference: this.gisInst.view.spatialReference
      })
      let layer = new this.gisConstructor.FeatureLayer({
        url: url
      })
      if (statisticType !== 'count') {
        let condition = {
          statisticType: statisticType,
          onStatisticField: field,
          outStatisticFieldName: name
        }
        let query = layer.createQuery()
        query.geometry = geometry
        query.outStatistics = [condition]
        layer.queryFeatures(query).then(function(response) {
          // console.log(response)
          callback(response)
        })
      } else {
        let condition = {
          statisticType: statisticType,
          onStatisticField: 'OBJECTID',
          outStatisticFieldName: name
        }
        let query = layer.createQuery()
        if (
          field === '材质' ||
          field === '实际用途' ||
          field === '是否为低效用地'
        ) {
          query.groupByFieldsForStatistics = field
        }
        query.geometry = geometry
        query.outStatistics = [condition]
        // query.groupByFieldsForStatistics = field
        layer.queryFeatures(query).then(function(response) {
          // console.log(response)
          callback(response)
        })
      }
    },
    //统计查询（分数据范围）
    queryRange(mapUrl, rings, field, range, callback) {
      let promiseArray = []
      rings = escape('[' + JSON.stringify(rings) + ']')
      console.log(rings)
      let where = ''
      for (let i = 0; i < range.length; i++) {
        if (field === '总楼层') {
          if (i < range.length - 1) {
            where =
              'cast(' +
              field +
              '\xa0as\xa0int)' +
              '>' +
              range[i] +
              '\xa0and\xa0' +
              'cast(' +
              field +
              '\xa0as\xa0int)' +
              '<' +
              range[i + 1]
          } else {
            where = 'cast(' + field + '\xa0as\xa0int)' + '>' + range[i]
          }
        } else {
          if (i < range.length - 1) {
            where =
              field +
              '>' +
              range[i] +
              '\xa0and\xa0' +
              field +
              '<' +
              range[i + 1]
          } else {
            where = field + '>' + range[i]
          }
        }
        promiseArray.push(
          new Promise((resolve, reject) => {
            let url =
              mapUrl +
              '/query?where=' +
              where +
              '&geometry=%7B%22spatialReference%22%3A%7B%22latestWkid%22%3A2381%2C%22wkid%22%3A2381%7D%2C%22rings%22%3A' +
              rings +
              '%7D&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=%5B%0D%0A%7B%0D%0A++++%22statisticType%22%3A+%22count%22%2C%0D%0A++++%22onStatisticField%22%3A+%22OBJECTID%22%2C%0D%0A++++%22outStatisticFieldName%22%3A+%22NUM%22%0D%0A++%7D%0D%0A%5D&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=json'
            oneMapApi
              .queryArcGis(url)
              .then(res => {
                resolve(res)
              })
              .catch(err => {
                console.log(err)
                reject(err)
              })
          })
        )
      }
      if (promiseArray.length > 0) {
        Promise.all(promiseArray)
          .then(result => {
            const array = []
            // console.log('result', result)
            result.forEach(element => {
              array.push(element)
            })
            callback(array)
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  computed: {},
  watch: {}
}
export default toolbarMixin
