import VueRouter from 'vue-router';
import navData from './navData'
import store from './store/index'
Vue.use(VueRouter)

// 静态路由
const routes = [
    {
        path: '/',
        component: () => import('....')
    }
]

// 动态路由
// navData.forEach(item => {
//     routes.push({
//         path: item.path,
//         name: item.name,
//         meta: { title: item.title },
//         component: () =>import(`../${item.component}`)
//     })
// });

/**
 * 路由拦截：路由地址一发生变化就会进行拦截
 */
router.beforeEach((to, from, next) => {
    // 当路由发生变化时，判断缓存中是否有数据，没有数据才去发起请求
    if (store && store.state.nav.length == 0) {
        // 0.请求数据
        getNavData().then(res => {
            // 1.拿到后端返回的动态数据，并做处理(转化为前端需要的数据格式)
            let dynamicRoutes = addDynamicRoutes(res.data.result)
            store.dispatch('setNav', res.data.result) // 2.将后端返回的数据缓存在vuex中：减少请求的发生
            router.addRoutes(dynamicRoutes) // 3.动态添加路由数据
        })
    } else { //有缓存，不请求
        next()
    }
})
// 路由数据转化
function addDynamicRoutes(result) {
    // result是后端路由表：数组对象
    result.forEach(item => {
        routes.push({
            path: item.path,
            name: item.name,
            meta: { title: item.title },
            component: () => import(`../${item.component}`)
        })
    })
    return result
}

export default router