/* eslint-disable */
import store from '@/store'
export default {
    methods: {
        // 检查权限，key为标识
        checkPermission(key) {
            const { userInfo } = store.state.user
            // 判断用户信息中的points中是否有这个标识，有则标识有权限，返回true；
            if (userInfo.roles.point && userInfo.roles.points.length) {
                return userInfo.roles.points.some(item => item === key)
            }
            // 否则返回false
            return false
        }
    }
}