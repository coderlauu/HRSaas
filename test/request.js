// axios二次封装:具有可扩展性、便于多人协作开发、便于后期维护
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { getNavData } from './http'
axios.defaults.baseURL = 'http://127.0.0.1.8888'
// 请求拦截器
/**
 * 前端向后端传token的值或者在请求头添加一些代码时可以进行拦截
 */
axios.interceptors.request.use(config => config)

// 响应拦截器
/**
 * 后端给前端返回数据时，可以进行拦截
 */
axios.interceptors.response.use(res => {
    return res
}, err => {
    return Promise.reject(err)
})

export default axios

