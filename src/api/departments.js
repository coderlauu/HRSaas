/* eslint-disable */
import request from '@/utils/request'

// 获取组织架构的数据 -- 对接接口
export function getDepartments() {
    return request({
        url: '/company/department'
    })
}

// 删除部门功能  -- 对接接口    
export function delDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        methods: 'delete'
    })
}

// 新增部门功能  -- 对接接口
export function addDepartments(data) {
    return request({
        url: '/company/department',
        methods: 'post',
        data
    })
}

// 获取部门详情
export function getDepartDetail(id) {
    return request({
        url: `company/department/${id}`
    })
}

//編輯部門
export function updateDepartments(data){
    return request({
        url:`/company/department/${data.id}`,
        method:'put',
        data
    })
}