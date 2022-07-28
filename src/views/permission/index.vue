<!-- eslint-disable -->
<template>
    <div class="dashboard-container">
        <div class="app-container">
            <!-- 靠右的按钮 -->
            <page-tools>
                <template v-slot:after>
                    <el-button type="primary" size="small" @click="addPermission('0', 1)">添加权限</el-button>
                </template>
            </page-tools>
            <!-- 表格 -->
            <el-table :data="list" row-key="id" border>
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="code" align="center" label="标识" />
                <el-table-column prop="description" align="center" label="描述" />
                <el-table-column align="center" label="操作">
                    <template slot-scope="{row}">
                        <el-button v-if="row.type === 1" type="text" @click="addPermission(row.id, 2)">添加</el-button>
                        <el-button @click="editPermission(row.id)" type="text">编辑</el-button>
                        <el-button @click="delPermission(row.id)" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹层：用于编辑和新增操作 -->
        <el-dialog :title="showText" :visible="showDialog" @close="btnCancel">
            <!-- 表单 -->
            <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="formData.name" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" prop="code">
                    <el-input v-model="formData.code" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="权限描述">
                    <el-input v-model="formData.description" style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="开启">
                    <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                    <el-button size="small" type="primary" @click="btnOK">确定</el-button>
                    <el-button size="small" @click="btnCancel">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { getPermissionList, getPermissionDetail, addPermission, delPermission, updatePermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { pid } from 'process'
export default {
    data() {
        return {
            list: [],
            showDialog: false,
            formData: {
                name: '',  // 名称
                code: '', // 标识
                description: '', // 描述
                type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
                pid: '', // 因为做的是树 需要知道添加到哪个节点下了
                enVisible: '0' // 开启
            },
            rules: {
                name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
                code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
            }
        }
    },
    computed: {
        showText() {
            return this.formData.id ? "编辑权限" : "新增权限"
        }
    },
    created() {
        this.getPermissionList()
    },
    methods: {
        // 获取权限列表数据，并将数组格式转化为树形格式
        async getPermissionList() {
            this.list = tranListToTreeData(await getPermissionList(), '0')
        },
        // 删除
        async delPermission(id) {
            try {
                await this.$confirm('确定要删除该数据吗？')
                await delPermission(id)
                this.getPermissionList()
                this.$message.success('删除成功')
            } catch (error) {
                console.log('删除失败', error)
            }
        },
        btnOK() {
            // 表单校验
            this.$refs.perForm.validate().then(() => {
                // 校验成功后，判断该表单是否是新增数据还是编辑数据
                if (this.formData.id) {
                    // 有id，则该操作是编辑，调用编辑接口
                    return updatePermission(this.formData)
                }
                // 否则该操作为新增
                return addPermission(this.formData)
            }).then(() => {
                // 提示消息
                this.$message.success('新增成功')
                this.getPermissionList() // 重新刷新页面数据
                this.showDialog = false // 关闭弹层
            })
        },
        btnCancel() {
            // 重置数据
            this.formData = {
                name: '',  // 名称
                code: '', // 标识
                description: '', // 描述
                type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
                pid: '', // 因为做的是树 需要知道添加到哪个节点下了
                enVisible: '0' // 开启
            }
            this.$refs.perForm.resetFields()
            this.showDialog = false
        },
        // 新增
        // 新增又区分新增页面访问权限还是新增按钮权限
        // 这时，可根据pid和type来判断；给父和子指定type和pid
        // 根的pid = 0；子的pid等于它父节点的id，即pid = row.id 
        addPermission(pid, type) {
            this.formData.pid = pid
            this.formData.type = type
            this.showDialog = true
        },
        // 改
        async editPermission(id) {
            // 根据id获取详情
            this.formData = await updatePermission(id)
            this.showDialog = true
        }
    }
}
</script>

<style>
/* eslint-disable */
</style>