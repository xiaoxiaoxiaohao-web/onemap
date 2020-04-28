const path = require('path')

module.exports = {
  title: 'vue-tx',
  description: 'vue-tx',
  head: [['link', { rel: 'icon', href: '/logo.png' }]],
  themeConfig: {
    sidebar: [
      ['/', 'Start'], 
      ['/developingStanderd/developingStanderd.md', '开发规范/约定'],
      ['/一张图/公共组件.md', '一张图--公共组件'],
      ['/一张图/一张图.md', '一张图--一张图'],
      ['/一张图/核地类.md', '一张图--核地类'],
      ['/一张图/空间分析.md', '一张图--空间分析'],
      // ['/一张图', '一张图']
      // ['/一张图/一张图', '一张图', 
      //   [
      //     ['/一张图/一张图/一张图.md', '一张图'],
      //     ['/一张图/核地类/核地类.md', '核地类'],
      //     ['/一张图/空间分析/空间分析.md', '空间分析']
      //   ]
      // ]
    ],
    sidebarDepth: 2
  },
  dest: path.resolve('public', 'docs'),
  base: '/docs/'
}
