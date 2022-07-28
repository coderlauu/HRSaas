<!-- eslint-disable -->
<template>
    <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="addEmployee" :model="formData" :rules="rules" label="width=120px">
            <el-form-item prop="username" label="姓名">
                <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item prop="mobile" label="手机">
                <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="timeOfEntry" label="入职时间">
                <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
            </el-form-item>
            <el-form-item prop="formOfEmployment" label="聘用形式">
                <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
                    <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="workNumber" label="工号">
                <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
            </el-form-item>
            <el-form-item prop="departmentName" label="部门">
                <el-input @focus="getDepartments" v-model="formData.departmentName" style="width:50%"
                    placeholder="请输入部门" />
            </el-form-item>
            <el-form-item prop="correctionTime" label="转正时间">
                <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
                <el-tree v-loading="loading" v-if="showTree" :data="treeData" :props="{ label: 'name' }"
                    :default-expand-all="true" @node-click="selectNode">
                </el-tree>
            </el-form-item>
        </el-form>
        <!-- footer插槽 -->
        <template v-slot:footer>
            <el-row type="flex" justify="center">
                <el-col :span="6">
                    <el-button @click="btnCancel" size="small">取消</el-button>
                    <el-button @click="btnOK" type="primary" size="small">确定</el-button>
                </el-col>
            </el-row>
        </template>
    </el-dialog>
</template>

<script>
/* eslint-disable */
import { getDepartments} from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
import {addEmployee } from '@/api/employees'
export default {
    props: {
        showDialog: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            EmployeeEnum, // 在data中定义数据
            treeData: [], // 接收树形结构
            showTree: false,
            loading: false, // 添加一个进度条
            formData: {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            },
            rules: {
                username: [
                    { required: true, message: '用户姓名不能为空', trigger: 'blur' },
                    { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
                ],
                formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
                workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
                departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
                timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
            }
        }
    },
    methods: {
        async getDepartments() {
            this.showTree = true
            this.loading = true
            const { depts } = await getDepartments()
            // depts是个数组，它需要转化为树形结构才可以被el-tree显示
            this.treeData = tranListToTreeData(depts, '')
            this.loading = false
        },
        selectNode(node) {
            // 当前点击的节点名字赋到输入框中
            this.formData.departmentName = node.name
            this.showTree = false
        },
        // 点击确定，校验整个表单
        async btnOK() {
            try {
                await this.$refs.addEmployee.validate()
                // 调用新增接口
                await addEmployee(this.formData)
                // 通知父组件更新数据
                // this.$parent  直接调用父组件实例，实际是父组件的this
                this.$parent.getEmployeeList()
                this.$parent.showDialog = false
            } catch (error) {
                console.log(error);
            }
        },
        btnCancel() {
            // 重置原来的数据
            this.formData = {
                username: '',
                mobile: '',
                formOfEmployment: '',
                workNumber: '',
                departmentName: '',
                timeOfEntry: '',
                correctionTime: ''
            }
            this.$refs.addEmployee.resetFields() // 重置校验结果
            this.$emit('update:showDialog', false) // 子组件可以控制父组件的显隐
            // update:props名称 可以在父组件使用sync修饰符处理
        }
    }
}
</script>