/* eslint-disable */
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 数据状态
const state = {
  token: getToken(),  // token放到vuex中，达到持久化
  userInfo: {} // 定义空对象 不是null
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token
    // 将新设置的token存到vuex中
    setToken(token) // 同时更新缓存数据的token
  },
  removeToken(state) {
    state.token = null // 删除vuex中的token
    removeToken() // 同时清除缓存数据
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo  // 这样是响应式的
    // state.userInfo = { ...userInfo } // 用浅拷贝的方式去赋值对象，这样的话，当数据更新之后可以触发组件更新
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const result = await login(data) //拿到token
    context.commit('setToken', result) //设置token
    // 写入时间戳
    setTimeStamp()
  },
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId) // 获取用户资料里的用户id
    const baseResult = { ...result, ...baseInfo } // 将两个接口合并
    context.commit('setUserInfo', baseResult) // 将个人信息设置到用户的vuex中
    return result
  },
  logout(context) {
    // 删除token
    context.commit('removeToken') // 删除vuex以及缓存中的token
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    /**
     * 初始化权限模块下的路由
     * vuex的子模块user.js调用同级子模块的permission.js的mutations：
     *    如果子模块没有加锁或没有加命名空间，可以直接调用
     *    如果加了命名空间，调用mutations时需要加第三个参数{root:true}
     */
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

