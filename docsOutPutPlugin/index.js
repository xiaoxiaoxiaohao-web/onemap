const path = require('path')
const fs = require('fs')
const cmd = require('node-cmd')

/**
 * 文档转换插件，将vuePree的md文档输出word文档
 * 使用前，必须安装pandoc并设置所有用户都有权限
 * tx 20190705
 */

class DocsOutPutPlugin {
  constructor(options) {
    const defaultOptions = {
      basePath: '', // 基本目录上下文
      output: 'docsOutput', // 导出的目标目录
      dir: 'docs' // 包含md文档的顶层目录
    }
    if (!options || !options.basePath) {
      throw new Error('basePath is required')
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.outputPath = path.resolve(this.options.basePath, this.options.output)
    this.docsPath = path.resolve(this.options.basePath, this.options.dir)
  }
  // export docx document
  exportWordDoc() {
    this.createDir(this.outputPath)
    this.makeDocxFile(this.docsPath)
  }
  // create output dir
  createDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }
  // create output file
  makeDocxFile(_path) {
    fs.readdir(_path, (readErr, files) => {
      if (readErr) {
        throw readErr
      }
      files.forEach(file => {
        const stats = fs.statSync(_path + '\\' + file)
        if (stats.isFile()) {
          const extname = path.extname(file).toLowerCase()
          if (extname === '.md') {
            const commond = `pandoc ${_path + '\\' + file} -o ${this
              .outputPath +
              '\\' +
              file.replace('.md', '')}.docx`
            cmd.run(commond)
          }
        } else if (stats.isDirectory()) {
          const newPath = _path + '\\' + file
          this.makeDocxFile(newPath)
        }
      })
    })
  }
}

// module.exports = DocsOutPutPlugin

const outPut = new DocsOutPutPlugin({
  basePath: process.cwd(),
  output: 'docsOutput', // 导出的目标目录
  dir: 'docs' // 包含md文档的顶层目录
})

outPut.exportWordDoc()
