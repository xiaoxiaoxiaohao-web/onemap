let Map3DSnapot = {
  exportPic: function(map3d) {
    var promise = map3d.scene.outputSceneToFile()
    var _this = this
    Cesium.when(promise, function(base64data) {
      _this.download(base64data)
    })
  },
  download: function(base64data) {
    var image = new Image()
    image.src = base64data
    var _this = this
    image.onload = function() {
      var canvas = _this.convertImageToCanvas(image)
      var url = canvas.toDataURL('image/jpeg')

      if (window.navigator.msSaveOrOpenBlob) {
        // var bstr = atob(url.split(',')[1])
        // var n = bstr.length
        // var u8arr = new Uint8Array(n)
        // while (n--) {
        //     u8arr[n] = bstr.charCodeAt(n)
        // }
        // var blob = new Blob([u8arr])
        // window.navigator.msSaveOrOpenBlob(blob, (new Date()).getTime() + '.' + 'jpg')

        var blob = canvas.msToBlob()
        window.navigator.msSaveBlob(blob, new Date().getTime() + '.jpg')
      } else {
        var obj = document.createElement('a')
        var event = new MouseEvent('click')
        obj.download = new Date().getTime() + '.jpg' // 指定下载图片的名称
        obj.href = url
        obj.dispatchEvent(event) // 触发超链接的点击事件
      }
    }
  },
  convertImageToCanvas: function(image) {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    canvas.getContext('2d').drawImage(image, 0, 0)
    return canvas
  }
}
export { Map3DSnapot }
