/* eslint-disable */
// 导出属于员工的路由规则
import Layout from '@/layout'
import request from '@/utils/request'
export default {
    path: '/employees', // 路径
    name: 'employees', // 给路由规则添加一个name
    component: Layout, // 组件
    // 配置二级路由表
    children: [{
        path: '', //二级路由表的默认路由
        component: () => import('@/views/employees'),
        name:'employees',
        // 路由元信息  存储数据的对象；用于读取一些配置和参数
        meta: {
            title: '员工管理', //meta里的属性为自定义；title表示左侧导航栏的菜单名称
            icon: 'people'
        }
    },
    {
        path: 'detail/:id', // 动态路由参数 -- id? ?的含义表示有没有id都可以访问
        component: () => import('@/views/employees/detail'),
        hidden: true, // 表示该内容不在左侧菜单栏显示
        meta: {
            title: '员工详情'
        }
    },
    {
        path: 'print/:id',
        component: () => import('@/views/employees/print'),
        hidden: true,
        meta: {
            title: '员工打印',
            icon: 'people'
        }
    }
    ]
}
// 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
