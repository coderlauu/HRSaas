/* eslint-disable */
import request from '@/utils/request'

export function login(data) {
    // 返回一个promise
    return request({
        url: '/sys/login',
        method: 'post',
        data
    })
}

// 封装获取用户的基本资料方法
export function getUserInfo() {
    return request({
        url: '/sys/profile',
        method: 'post'
    })
}

// 封装获取用户的基本信息，因为接口没有用户头像，这么做是为了显示头像
export function getUserDetailById(id) {
    return request({
        url: `/sys/user/${id}`
    })
}


