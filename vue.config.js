const proConfig = require('./webpack.pro.config')
const devConfig = require('./webpack.dev.config')


module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      return proConfig
    } else {
      return devConfig
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/styles/theme-blue.scss";'
      }
    }
  }
}
