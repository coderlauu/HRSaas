/* eslint-disable */
// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router' // 引入静态路由
const state = {
    routes: constantRoutes, // 路由表 -> 当前用户所拥有的所有路由的数组（静态路由：首页，登录页，404）
}
const mutations = {
    // 定义修改routes的mutations
    // 第二个参数payload：登录成功需要添加的新路由
    setRoutes(state, newRoutes) {
        state.routes = [...constantRoutes, ...newRoutes] // 在静态路由的基础上添加新路由
    }
}
const actions = {
    // 筛选权限路由
    // 第二个参数：当前用户所拥有的菜单权限
    // menus:["setting","permissions"]
    // asyncRoutes：所有的动态路由 => [{path:'setting',name:'setting'},{}]
    filterRoutes(context, menus) {
        const routes = []
        // 筛选出动态路由中和menus数组能匹配上的路由
        menus.forEach(key => {
            // key就是每一个标识
            // 如果menus中的key === 动态路由中的name，则有权限
            routes.push(...asyncRoutes.filter(item => item.name === key))
            // 由此得到当前用户所拥有的动态路由的权限
        })
        // 将动态路由提交给mutations
        context.commit('setRoutes', routes) // 这里的routes是改了state数据，state是显示左侧菜单
        return routes // 筛选之后的路由；这里的routes是给addRoutes用的
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}