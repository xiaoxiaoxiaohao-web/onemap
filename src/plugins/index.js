import cidPlugin from './cidPlugin'
import libPlugin from './libPlugin'
function registerPlugins(vue) {
  vue.use(cidPlugin)
  vue.use(libPlugin)
}

export { registerPlugins }
