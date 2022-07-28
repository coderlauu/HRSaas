/* eslint-disable */
// 自定义组件全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import TagsView from './TagsView'
export default {
    install(Vue) {
        // 注册全局的通用栏组件对象
        Vue.component('PageTools', PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload', ImageUpload)
        Vue.use(Print) // 注册打印组件
        Vue.component('TagsView', TagsView)
    }
}