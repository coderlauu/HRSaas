<!-- eslint-disable -->
<template>
    <div class="dashboard-container">
        <div class="app-container">
            <el-tabs>
                <!-- 放置页签 -->
                <el-tab-pane label="角色管理">
                    <!-- 新增角色按钮 -->
                    <el-row style="height:60px">
                        <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog = true">新增角色
                        </el-button>
                    </el-row>
                    <!-- 表格 -->
                    <el-table border="" :data="list">
                        <el-table-column type="index" align="center" label="序号" width="120" />
                        <el-table-column align="center" prop="name" label="角色名称" width="240" />
                        <el-table-column align="center" prop="description" label="描述" />
                        <el-table-column align="center" label="操作">
                            <template slot-scope="{row}">
                                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                                <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                                <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页组件 -->
                    <el-row type="flex" justify="center" align="middle" style="height: 60px">
                        <!-- 分页组件 -->
                        <el-pagination :current-page="page.page" :page-size="page.pageSize" :total="page.total"
                            layout="prev,pager,next" @current-change="changePage" />
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="公司信息">
                    <el-alert title="XX公司-人力资源管理系统" type="info" show-icon :closable="false" />
                    <el-form label-width="120px" style="margin-top:50px">
                        <el-form-item label="公司名称">
                            <el-input value='这里可以定义公司名' disabled style="width:400px" />
                        </el-form-item>
                        <el-form-item label="公司地址">
                            <el-input value='这里可以定义公司地址' disabled style="width:400px" />
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input value='coderlauuu@gmail.com' disabled style="width:400px" />
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input v-model="formData.state" type="textarea" :rows="3" disabled
                                style="width:400px" />
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 放置一个弹层组件 -->
        <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
            <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
                <el-form-item prop="name" label="角色名称">
                    <el-input v-model="roleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                    <el-input v-model="roleForm.description"></el-input>
                </el-form-item>
            </el-form>
            <!-- 放置footer插槽 -->
            <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                    <el-button size="small" @click="btnCancel">取消</el-button>
                    <el-button size="small" type="primary" @click="btnOK">确定</el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
            <!-- 将数据绑定到组件上 -->
            <!-- check-strictly 若为true，父子之间勾选时，不关联；false则关联 -->
            <!-- default-checked-keys='变量' 表示默认勾选的节点 -->
            <!-- node-key='id' 用id作为唯一标识 -->
            <el-tree :data="permData" :props="defaultProps" :show-checkbox="true" :check-strictly="true"
                :default-expand-all="true" :default-checked-keys="selectCheck" node-key="id" ref="permTree">

            </el-tree>
            <!-- 确定 取消 -->
            <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                    <el-button size="small" type="primary" @click="btnPermOK">确定</el-button>
                    <el-button size="small" @click="btnPermCancel">取消</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            list: [],
            page: {
                // 放置页码
                page: 1,
                pagesize: 10,
                total: 0
            },
            showDialog: false,
            roleForm: {
                name: '',
                description: ''
            },
            rules: {
                name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
            },
            // 公司信息
            formData: {},
            showPermDialog: false, // 控制分配权限弹层的显隐
            permData: [], // 存放权限数据
            defaultProps: {
                label: 'name'
            }, // 定义显示字段的名称 和 子属性的字段名称
            roleId: null, // 记录分配角色的id
            selectCheck: [], // 定义一个数组来接收 已经选中的节点
        }
    },
    created() {
        this.getRoleList() // 获取角色列表
        this.getCompanyInfo()
    },
    methods: {
        // 获取角色列表 -- 调用接口方法
        async getRoleList() {
            const { total, rows } = await getRoleList(this.page)
            this.page.total = total
            this.list = rows
        },
        // 页码变化
        changePage(newPage) {
            // newPage当前点击的页码
            this.page.page = newPage
            this.getRoleList // 重新加载数据
        },
        // 获取公司信息 -- 调用接口方法
        async getCompanyInfo() {
            this.formData = await getCompanyInfo(this.companyId)
            console.log(this.formData);
        },
        // 删除角色 -- 调用接口方法
        async deleteRole(id) {
            // 提示
            try {
                await this.$confirm('确定删除该角色吗？')
                // 确定
                await deleteRole(id) // 调用删除接口
                this.getRoleList() // 重新加载数据
                this.$message.success('删除角色成功')
            } catch (error) {
                console.log(error);
            }
        },
        async editRole(id) {
            this.roleForm = await getRoleDetail(id) // 数据的回显
            this.showDialog = true  // 显示弹层
        },
        // 点击确定按钮之后，判断是新增还是编辑
        async btnOK() {
            try {
                // 首先对表单进行校验
                await this.$refs.roleForm.validate()
                // 若校验通过
                // 判断roleForm是否有id，有id是编辑，没有就是新增
                if (this.roleForm.id) {
                    // 编辑
                    await updateRole(this.roleForm)
                } else {
                    // 新增
                    await addRole(this.roleForm)
                }
                // 重新获取数据
                this.getRoleList()
                this.$message.success('操作成功')
                this.showDialog = false // 关闭弹层 
            } catch (error) {
                console.log(error);
            }
        },
        btnCancel() {
            this.roleForm = {
                name: '',
                description: ''
            }
            // 移除校验
            this.$refs.roleForm.resetFields()
            this.showDialog = false
        },
        // 弹出层
        async assignPerm(id) {
            // 获取所有权限点数据
            this.permData = tranListToTreeData(await getPermissionList(), '0')
            // 获取到当前点击用户的id，并记录下来
            this.roleId = id
            // 根据这个id来获取对应的权限点
            const { permIds } = await getRoleDetail(id) // permIds是当前角色所拥有的权限点数据
            this.selectCheck = permIds
            this.showPermDialog = true
        },
        btnPermOK() {
            // 调用el-tree的方法
            // 调用配分权限接口，传递两个参数（当前选中的权限点，当前用户id）
            assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
            this.$message.success('分配权限成功')
            this.showPermDialog = false // 会去触发close事件，而close事件又会执行btnCancel方法
        },
        btnPermCancel() {
            this.selectCheck = [] // 重置
            this.showPermDialog = false
        }
    },
    computed: {
        ...mapGetters(['companyId']),
        // 通过角色名字的有无，来动态的显示弹层title
        showTitle() {
            return this.roleForm.name ? '编辑角色' : '新增角色'
        }
    }
}
</script>

<style>
/* eslint-disable */
</style>