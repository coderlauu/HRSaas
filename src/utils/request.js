/* eslint-disable */
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'

const TimeOut = 3600 // 定义超时时间
const service = axios.create({ // 创建axios实例
    baseURL: process.env.VUE_APP_BASE_API, // 
    timeout: 5000 // 设置超时时间，没响应就报错
})
// 请求拦截器
service.interceptors.request.use(config => {
    // 统一注入token
    if (store.getters.token) {
        // token存在，注入到请求头的'Authorization'字段中
        config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
    // axios默认多了一层data
    // 通过解构来获取一下三个参数
    const { success, message, data } = response.data
    // 要根据success的成功与否决定下面的操作
    if (success) {
        return data
    } else {
        // 提示错误并执行rejecte
        Message.error(message)
        return Promise.reject(new Error(message))
    }
}, error => {
    if (error.response && error.response.data && error.response.data.code === 10002) {
        // 当code等于10002时，后端告诉我超时了
        store.dispatch('user/logout') // 退出登录，删除token
        router.push('/login')
    } else {
        // 提示错误并执行reject
        Message.error(error.message)
    }
    return Promise.reject(error)
})

function IsCheckTiemOut() {
    var currentTime = Date.now() //当前时间
    var timeStamp = getTimeStamp() //缓存时间戳
    return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service



