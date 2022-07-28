/* eslint-disable */
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import Component from '@/components'
Vue.use(Component) // 注册自己的组件

// 工具方法转化成过滤器
import * as filters from '@/filters'
// 注册全局的过滤器
/**
 * filters：对象
 * key：对象内的函数名
 * filters[key]：对应的函数
 */
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

import * as directives from '@/directives'
// `import * as 变量` 得到的是一个对象**`{ 变量1：对象1，变量2：对象2...}`
// 注册自定义指令
// 遍历所有导出的指令对象
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

import checkPermission from '@/mixin/checkPermission'
// 全局混入检查对象
Vue.mixin(checkPermission) // 所有组件都拥有这个检查的方法

import i18n from '@/lang'
Vue.use(ElementUI, {
  // i18n会根据当前的locale属性去寻找对应的语言包
  i18n: (key, value) => i18n.t(key, value) // t方法会去对应的语言包里寻找对应的内容
})


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
