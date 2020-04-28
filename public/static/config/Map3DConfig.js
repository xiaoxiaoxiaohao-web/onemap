var Map3DConfig = {
  mapType: 'SuperMap', //三维地图类型
  // //影像数据
  // domPath:
  //   'http://172.26.155.186:8090/iserver/services/3D-XiAn/rest/realspace/datas/DOM@%E8%A5%BF%E5%AE%89%E7%BA%A0%E6%AD%A3%E6%95%B0%E6%8D%AE',
  // demPath: '', //dem数据
  //西安现场IP：http://192.168.20.10，本地172.26.155.186
  //默认起始位置
  defaultPosition: {
    x: 108.949635751295,
    y: 34.2626281412753,
    z: 1000,
    heading: 0,
    pitch: -45,
    roll: 0
  },
  mapTheme3D: [
    {
      title: '基础数据',
      children: [
        {
          layerName: '影像图',
          layerType: '101', //101超图影像
          dataUrl:
            'http://172.26.155.186:8090/iserver/services/3D-XiAn/rest/realspace/datas/DOM@%E8%A5%BF%E5%AE%89%E7%BA%A0%E6%AD%A3%E6%95%B0%E6%8D%AE',
          visibility: true
        }
      ]
    },
    {
      title: '三维模型',
      children: [
        {
          layerName: '建筑',
          layerType: '201', //201 max建模数据，202倾斜数据，203BIM模型
          dataUrl:
            'http://172.26.155.186:8090/iserver/services/3D-XiAn/rest/realspace/datas/ModleJZ@%E6%A8%A1%E5%9E%8B/config',

          options: {
            layerAltitude: 1,
            visibility: true,
            maxVisibleAltitude: 5000,
            visibleDistanceMax: 8000,
            selected: false //图层是否可以选中
          } //,
          // queryParameter: {
          //   url:
          //     'http://172.26.155.186:8090/iserver/services/data-XiAn/rest/data', //走超图自定义查询，查询数据服务，人工max建模，倾斜数据一般都需要查询建筑基底
          //   dataSourceName: '西安纠正数据',
          //   dataSetName: '居民地' //,
          //   //keyWord: 'SMID',
          //   //hasGeometry: true
          // }
        },
        {
          layerName: '地面',
          layerType: '201',
          dataUrl:
            'http://172.26.155.186:8090/iserver/services/3D-XiAn/rest/realspace/datas/ModleDX@%E6%A8%A1%E5%9E%8B/config',
          options: {
            layerAltitude: 1,
            visibility: true,
            maxVisibleAltitude: 15000,
            visibleDistanceMax: 10000,
            selected: false
          }
        }
      ]
    },
    {
      title: '二维专题数据', //矢量其实也是模型数据
      children: [
        {
          layerName: '新城区总体规划',
          layerType: '301', //一般是矢量数据
          dataUrl:
            'http://172.26.155.186:8090/iserver/services/3D-XiAn/rest/realspace/datas/ZGKG_Model/config',

          options: {
            layerAltitude: 10,
            visibility: false,
            maxVisibleAltitude: 20000,
            visibleDistanceMax: 15000,
            selected: true //图层是否可以选中,选中表示可以获取到数据转换是对应的要素图层属性信息
          },
          queryParameter: {
            url:
              'http://172.26.155.186:8090/iserver/services/data-XiAn/rest/data', //走超图自定义查询，查询数据服务，人工max建模，倾斜数据一般都需要查询建筑基底
            dataSourceName: '西安纠正数据',
            dataSetName: 'ZGKG_Model' //,
            //keyWord: 'SMID',
            //hasGeometry: true
          }
        }
      ]
    }
  ]
}
