const onemapMixin = {
  data() {
    return {}
  },
  mounted() {},
  methods: {
    addWebTileLayer(id, code, sindex, ak) {
      const layer = new this.gisConstructor.WebTileLayer({
        urlTemplate:
          window.arcgisServerBaseUrl +
          '/' +
          id +
          '/service' +
          id +
          '/wmts/ResourceService_' +
          id +
          '_' +
          code +
          '_' +
          sindex +
          '/grid/{level}/{col}/{row}.png?ak=' +
          ak,
        spatialReference: { wkid: 2381 },
        tileInfo: this.gisInst.tileInfo,
        fullExtend: this.gisInst.webTileExtent
      })
      const layerObj = { id: id + code + sindex + ak, layer: layer }
      this.layers.push(layerObj)
      this.gisInst.map.add(layer)
    },
    addMapImageLayer(url) {
      const layer = new this.gisConstructor.MapImageLayer({
        url: url
      })
      const layerObj = { id: url, layer: layer }
      this.layers.push(layerObj)
      this.gisInst.map.add(layer)
    },
    showResultItem(item, fieldAliases) {
      let attributes = {}
      let fieldInfos = []
      if (item.geometry.rings) {
        let rings = item.geometry.rings
        let polygon = new this.gisConstructor.Polygon({
          rings: rings,
          spatialReference: this.gisInst.view.spatialReference
        })
        let center = polygon.centroid
        let lineSymbol = {
          type: 'simple-fill',
          color: [255, 255, 0, 1],
          outline: {
            color: 'black',
            width: 1
          }
        }
        this.$store.commit('onemapApplication/setResultItem', item)
        this.$store.commit('onemapApplication/setFieldAliases', fieldAliases)
        for (let key in item.attributes) {
          if (key === 'layerAlias') {
            continue
          }
          fieldInfos.push({
            fieldName: key,
            label: fieldAliases[key] ? fieldAliases[key] : key
          })
          attributes[key] = item.attributes[key]
        }
        let template = {
          title: '地块属性',
          content: [
            {
              type: 'fields',
              fieldInfos: fieldInfos
            }
          ]
        }
        this.gisInst.view.graphics.remove(this.polygonGraphic)
        this.gisInst.view.graphics.remove(this.pointGraphic)
        this.polygonGraphic = new this.gisConstructor.Graphic({
          attributes: attributes,
          geometry: polygon,
          popupTemplate: template,
          symbol: lineSymbol
        })
        this.pointGraphic = new this.gisConstructor.Graphic({
          attributes: attributes,
          geometry: center,
          popupTemplate: template,
          symbol: {
            type: 'picture-marker',
            url: require('../Aside/images/DW.png'),
            yoffset: '6px'
          }
        })
        this.gisInst.view.graphics.add(this.polygonGraphic)
        this.gisInst.view.graphics.add(this.pointGraphic)
        this.gisInst.view.goTo(this.polygonGraphic)
      }
      if (item.geometry.x) {
        let point = {
          type: 'point',
          x: item.geometry.x,
          y: item.geometry.y,
          spatialReference: this.gisInst.view.spatialReference
        }
        this.$store.commit('onemapApplication/setResultItem', item)
        this.$store.commit('onemapApplication/setFieldAliases', fieldAliases)
        for (let key in item.attributes) {
          if (key === 'layerAlias') {
            continue
          }
          fieldInfos.push({
            fieldName: key,
            label: fieldAliases[key] ? fieldAliases[key] : key
          })
          attributes[key] = item.attributes[key]
        }
        let template = {
          title: '地块属性',
          content: [
            {
              type: 'fields',
              fieldInfos: fieldInfos
            }
          ]
        }
        this.gisInst.view.graphics.remove(this.pointGraphic)
        this.pointGraphic = new this.gisConstructor.Graphic({
          attributes: attributes,
          geometry: point,
          popupTemplate: template,
          symbol: {
            type: 'simple-marker', // autocasts as SimpleMarkerSymbol
            style: 'circle',
            color: 'red',
            size: '16px',
            outline: {
              // autocasts as SimpleLineSymbol
              color: [255, 255, 0],
              width: 3
            }
          }
        })
        this.gisInst.view.graphics.add(this.pointGraphic)
        this.gisInst.view.center = point
        this.gisInst.view.zoom = 7
      }
    },
    removeResult() {
      this.gisInst.view.graphics.remove(this.polygonGraphic)
      this.gisInst.view.graphics.remove(this.pointGraphic)
    },
    delete(item, list) {
      for (let key in list) {
        if (list[key].id === item) {
          list.splice(key, 1)
        }
      }
    },
    queryDistrict(district, callback) {
      let layer = new this.gisConstructor.FeatureLayer({
        // url: 'http://192.168.20.3:6080/arcgis/rest/services/XianDistrict/MapServer/0'
        url: window.mapDistrictUrl + '/0' // 行政区划服务
      })
      let query = layer.createQuery()
      query.where = "RefName='" + district + "'"
      query.groupByFieldsForStatistics = 'RefName'
      layer.queryFeatures(query).then(function(response) {
        callback(response.features[0].geometry)
      })
    }
  },
  computed: {
    layerOperate() {
      return this.$store.state.onemapApplication.layerOperate
    },
    subjectOperate() {
      return this.$store.state.onemapApplication.subjectOperate
    },
    userAK() {
      return this.$store.state.global.userinfo.userKey
    }
  },
  watch: {
    layerOperate(val) {
      if (val.type === 'add') {
        for (let k = 0; k < val.layers.length; k++) {
          const { resourceid, areacode, sindex, _layerType } = val.layers[k] // es6 解构
          this.addWebTileLayer(
            resourceid,
            areacode,
            _layerType === 1 ? 'all' : sindex,
            this.userAK
          )
        }
      }
      if (val.type === 'remove') {
        for (let k = 0; k < val.layers.length; k++) {
          const { resourceid, areacode, _layerType, sindex } = val.layers[k] // es6 解构
          const index = _layerType === 1 ? 'all' : sindex
          let id = resourceid + areacode + index + this.userAK
          const layerData = this.layers.find(x => x.id === id)
          if (layerData) {
            this.gisInst.map.remove(layerData.layer)
          }
          this.delete(id, this.layers)
        }
      }
    },
    subjectOperate(val) {
      if (val.type === 'add') {
        for (let k = 0; k < val.layers.length; k++) {
          this.addMapImageLayer(val.layers[k].Url)
        }
      }
      if (val.type === 'remove') {
        for (let k = 0; k < val.layers.length; k++) {
          const layerData = this.layers.find(x => x.id === val.layers[k].Url)
          if (layerData) {
            this.gisInst.map.remove(layerData.layer)
          }
          this.delete(val.layers[k].Url, this.layers)
        }
      }
    }
  }
}
export default onemapMixin
