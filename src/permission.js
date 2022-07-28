/* eslint-disable */
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login', '/404'] //定义白名单
// 不需要导出，main.js只是import此文件，并没有设置变量，他可以直接执行此文件代码
// 前置守卫
router.beforeEach(async (to, from, next) => {
    // 进度条
    NProgress.start()
    // 如果有token
    if (store.getters.token) {
        // 如果进的是登录页
        if (to.path === '/login') {
            // 跳到主页
            next('/')
        } else {
            // 如果有token但进的不是登录页，就判断是否有用户id，若没有，则获取用户资料，然后再放行
            if (!store.getters.userId) {
                // 如果没有id，会去调用vuex的获取资料的actions
                const { roles } = await store.dispatch('user/getUserInfo')
                // 筛选用户的可用路由
                const routes = await store.dispatch('permission/filterRoutes', roles.menus) // 筛选得到当前用户可用的动态路由
                // 把这个动态路由添加到路由表中，因为默认的路由表只有静态路由
                router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
                next(to.path) // 这里要多做一次跳转，让addRoutes把路由表加进去，再进来就可以跳转了
            } else {
                next()
            }
        }
    } else {
        // 如果没有token,判断是否在白名单
        if (whiteList.indexOf(to.path) > -1) { //indexOf返回元素位置
            // 在，放行
            next()
        } else {
            // 不在，跳转到登录页
            next('/login')
        }
    }
    NProgress.done()
})

// 后置守卫
router.afterEach(function () {
    NProgress.done()
})