<!-- eslint-disable -->
<template>
    <!-- 新增部门的弹层 -->
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <!-- 表单组件  el-form   label-width设置label的宽度   -->
        <!-- 匿名插槽 -->
        <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
            <el-form-item prop="name" label="部门名称">
                <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item prop="code" label="部门编码">
                <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
            </el-form-item>
            <el-form-item prop="manager" label="部门负责人">
                <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
                    <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username">
                        <!-- label显示值；value存储值 -->
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="introduce" label="部门介绍">
                <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea"
                    :rows="3" />
            </el-form-item>
        </el-form>
        <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
        <el-row slot="footer" type="flex" justify="center">
            <!-- 列被分为24 -->
            <el-col :span="6">
                <el-button type="primary" size="small" @click="btnOK">确定</el-button>
                <el-button size="small" @click="btnCancel">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
/* eslint-disable */
import { addDepartments, getDepartDetail, getDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
import { is } from '@babel/types'
export default {
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        // 当前操作的节点
        treeNode: {
            type: Object,
            default: null
        }
    },
    data() {
        const checkNameRepeat = async (rule, value, callback) => {
            // 先要获取最新的组织架构数据
            const { depts } = await getDepartments()
            let isRepeat = false
            if (this.formData.id) { // 有id，编辑模式
                // depts是所有部门的数据;这里需要去找当前所在部门的子节点
                // depts.filter(item => item.pid === this.treeNode.id)找到同级部门所有的子部门
                // some方法，找该数组中是否有输入的value，如果有则报错提示名字重复，否则接着进行执行
                isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
                isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
            }
        }


        const checkCodeRepeat = async (rule, value, callback) => {
            const { depts } = await getDepartments()
            let isRepeat = false
            if (this.formData.id) {
                // 编辑模式
                isRepeat = depts.some(item => item.id && item.code === value && value)
            } else {
                // 新增模式
                isRepeat = depts.some(item => item.code === value && value)
            }
            isRepeat ? callback(new Error(`组织架构已经有部门使用${value}编码`)) : callback()
        }

        return {
            // 定义表单数据对象
            // formData绑定在:model中；里面的每个属性绑定在prop中
            formData: {
                name: '',
                code: '',
                manager: '',
                introduce: ''
            },
            // 定义校验规则
            // rules绑定在:rules中
            rules: {
                name: [
                    { required: true, message: '部门名称不能为空', trigger: 'blur' },
                    { min: 1, max: 50, message: '部门名称要求1-50个字符', trigget: 'blur' },
                    { trigger: 'blur', validator: checkNameRepeat }
                ],
                code: [
                    { required: true, message: '部门编码不能为空', trigger: 'blur' },
                    { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
                    { trigger: 'blur', validator: checkCodeRepeat }
                ],
                manager: [
                    { required: true, message: '部门负责人不能为空', trigger: 'blur' }
                ],
                introduce: [
                    { required: true, message: '部门介绍不能为空', trigger: 'blur' },
                    { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }
                ]
            },
            peoples: []
        }
    },
    methods: {
        // 获取员工简单列表数据
        async getEmployeeSimple() {
            this.peoples = await getEmployeeSimple()
        },
        // 获取部门详情
        async getDepartDetail(id) {
            this.formData = await getDepartDetail(id)
        },
        // 点击确定时触发
        btnOK() {
            this.$refs.deptForm.validate(async isOK => {
                if (isOK) {
                    if (this.formData.id) {
                        // 有id，编辑模式，调用编辑接口
                        await updateDepartments(this.formData)
                    } else {
                        // 表示可以提交
                        // 这时，将新增的部门pid设置为当前部门的id
                        await addDepartments({ ...this.formData, pid: this.treeNode.id })
                    }

                    // 通知父组件
                    this.$emit('addDepts')
                    // 子组件通过'update:props属性名'，父组件通过sync修饰符可以省去父组件的监听和方法，直接赋值
                    this.$emit('update:showDialog', false)
                }
            })
        },
        // 点击取消时触发
        btnCancel() {
            // resetFields只能重置表单上的数据，不能重置非表单数据，比如id
            this.formData = {
                name: '',
                code: '',
                manager: '',
                introduce: ''
            }
            // 利用el-form内置的方法->resetFields 重置表单
            this.$refs.deptForm.resetFields()
            this.$emit('update:showDialog', false)
        }
    },
    computed: {

        showTitle() {
            return this.formData.id ? '编辑部门' : '新增子部门'
        }
    }
}
</script>