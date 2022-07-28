/* eslint-disable */
// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
    path: '/departments', // 路径
    name: 'departments', // 给路由规则添加一个name
    component: Layout, // 组件
    // 配置二级路由表
    children: [{
        path: '', //二级路由表的默认路由
        component: () => import('@/views/departments'),
        name:'departments',
        // 路由元信息  存储数据的对象；用于读取一些配置和参数
        meta: {
            title: '组织架构', //meta里的属性为自定义；title表示左侧导航栏的菜单名称
            icon:'tree'
        }
    }]
}