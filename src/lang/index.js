/* eslint-disable */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie' //引入cookie工具
import elementZH from 'element-ui/lib/locale/lang/zh-CN' //中文包
import elementEN from 'element-ui/lib/locale/lang/en' //英文包
import customZH from './zh' // 自定义中文包
import customEN from './en' // 自定义英文包

Vue.use(VueI18n) //完成全局注册
export default new VueI18n({
    // i18n配置项
    locale: Cookie.get('language') || 'zh',  // 当前的多语言类型;先在当前存储找本地语言类型，如果没有就采用中文
    messages: {
        zh: {
            // 语言包：element的语言包 + 自定义的语言包，这样就能让页面的所有文字实现语言切换
            ...elementZH,
            ...customZH
        },
        en: {
            // 语言包
            ...elementEN,
            ...customEN
        },
    },  //当前的语言包
    // 隐藏警告
    silentTranslationWarn: true
})