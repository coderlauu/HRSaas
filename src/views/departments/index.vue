<!-- eslint-disable -->
<template>
    <div v-loading="loading" class="dashboard-container">
        <div class="app-container">
            <el-card class="tree-card">
                <!-- 行列布局 -->
                <!-- 这里的组件名也可以使用小写形式：tree-tools -->
                <!-- 组件内的属性名treeNode,也可以使用小写形式：tree-node -->
                <TreeTools :treeNode="company" :isRoot="true" @addDepts="addDepts"></TreeTools>

                <!-- 树形布局 -->
                <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
                    <!-- 传入的内容为插槽内容；他会循环多次，有多少节点就循环多少次 -->
                    <!-- 这里将data对象传递给封装组件中的treeNode属性 -->
                    <TreeTools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts"
                        @editDepts="editDepts">
                    </TreeTools>
                </el-tree>
            </el-card>
        </div>
        <!-- 放置新增弹层组件 -->
        <!-- :treeNode="node" 将当前的节点记录下来,用于判断添加部门时,名称不能重复 -->
        <add-dept ref="addDept" :showDialog.sync="showDialog" :treeNode="node" @addDepts="getDepartments"></add-dept>
    </div>
</template>

<script>
/* eslint-disable */
import TreeTools from './components/tree-tools'
import addDept from './components/add-dept'  // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
    components: {
        TreeTools,
        addDept
    },
    data() {
        return {
            // 定义company变量
            company: {
                name: 'xx公司-人力资源管理系统',
                manager: '负责人'
            },
            // props属性：配置选项
            defaultProps: {
                label: 'name'
            },
            // :data属性：展示数据
            departs: [
                {
                    name: '总裁办',
                    manager: '曹老板',
                    children: [{
                        name: '董事会',
                        manager: '曹丕'
                    }]
                },
                {
                    name: '行政部',
                    manager: '刘备'
                },
                {
                    name: '人事部',
                    manager: '孙权'
                }
            ],
            showDialog: false, // 默认不显示弹层
            node: null, // 记录当前点击的node节点,
            loading: false // 用来控制进度弹层的显示和隐藏
        }
    },
    // 在钩子函数中调用接口
    created() {
        this.getDepartments()
    },
    methods: {
        async getDepartments() {
            this.loading = true
            const result = await getDepartments()
            this.company = { name: 'xx公司-人力资源管理系统', manager: '负责人', id: '' }
            this.departs = tranListToTreeData(result.depts, '')
            console.log(result);
            this.loading = false
        },
        // 监听tree-tools中触发的点击添加子部门的事件
        addDepts(node) { // 接收treeNode我们当前点击的节点
            this.showDialog = true // 显示弹层
            // 记录当前点击的部门
            this.node = node
        },
        // 编辑部门节点
        editDepts(node) {
            // 首先打开弹层
            this.showDialog = true
            this.node = node // 存储传递过来的node数据
            // 父组件调用子组件的方法,通过$refs获取子组件的this,然后调用子组件里的方法
            this.$refs.addDept.getDepartDetail(node.id)
        }
    }
}
</script>

<style scoped>
/* eslint-disable */
.tree-card {
    padding: 30px 140px;
    font-size: 14px;
}
</style>