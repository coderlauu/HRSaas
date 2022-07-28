/* eslint-disable */
// 负责管理所有的自定义指令

export const imageerror = {
    // 指定对象 会在当前的Dom元素插入到节点之后执行
    inserted(dom, options) {
        // options：指令中的变量
        // dom：当前指令作用的Dom对象
        // 1.先初始化判断src是否为空
        dom.src = dom.src || options.value // 初始化时，如果有值则赋值，没值需要进行默认值赋值
        // 当图片有地址但没有加载成功时，会报错
        // 2.监听错误事件
        dom.onerror = function () {
            dom.src = options.value
        }
    },
    // 该钩子函数，在组件更新或赋值时也会执行
    // 3.当组件更新了，重新进行inserted钩子函数执行
    componentUpdate(dom, options) {
        dom.src = dom.src || options.value
    }
}   