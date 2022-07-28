<!-- eslint-disable -->
<!-- 组件封装 -->
<template>
    <!-- 模板内容：放置重复的部分 -->
    <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width: 100%">
        <el-col>
            <!-- 名称为：对应节点中的name -->
            <span>{{ treeNode.name }}</span>
        </el-col>
        <el-col :span="4">
            <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>{{ treeNode.manager }}</el-col>
                <el-col>
                    <!-- 下拉菜单 element -->
                    <el-dropdown @command="operateDepts">
                        <span>
                            操作<i class="el-icon-arrow-down" />
                        </span>
                        <!-- 下拉菜单 -->
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :disabled="!checkPermission('add-dept')" command="add">添加子部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
                            <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>

<script>/* eslint-disable */

import { delDepartments,addDepartments } from '@/api/departments'
export default {
    methods: {
        operateDepts(type) {
            if (type === 'add') {   
                // 增
                // 通知父组件，显示弹层
                this.$emit('addDepts',this.treeNode)
            } else if (type === 'edit') {
                // 改
                this.$emit('editDepts',this.treeNode)
            } else {
                // 删
                this.$confirm('确定要删除该部门吗？').then(() => {
                    // 确定
                    return delDepartments(this.treeNode.id) //返回promise对象
                }).then(() => {
                    // 删除成功，通过自定义事件通知父组件更新
                    this.$emit('delDepts') // 触发自定义事件
                    this.$message.success('删除部门成功')  
                })
            }   
        }
    },
    props: {
        treeNode: {
            type: Object, // 对象类型
            required: true // 要求使用该组件时必须穿treeNode属性，不传就报错
        },
        isRoot: {
            type: Boolean,
            default: false
        }
    }
}
</script>