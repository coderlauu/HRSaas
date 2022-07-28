<!-- eslint-disable -->
<template>
    <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
        <!-- 多选框 -->
        <el-checkbox-group v-model="roleIds">
            <!-- 要循环的选项 -->
            <!-- 
                label属性是即显示又存储；如果标签内没有值，默认显示label的值；
                而实际要显示的是角色名称；存储的是角色ID 
            -->
            <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
                {{ item.name }}
            </el-checkbox>
        </el-checkbox-group>
        <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
                <el-button @click="btnOK" type="primary" size="small">确定</el-button>
                <el-button @click="btnCancel" size="small">取消</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
/* eslint-disable */
import { assignRoles } from '@/api/employees'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
export default {
    props: {
        showRoleDialog: {
            type: Boolean,
            default: false
        },
        // 用户的ID -- 需要知道当前要处理的哪个用户
        userId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            list: [], // 负责存储当前所有的角色id
            roleIds: [],  // 负责存储当前用户所拥有的角色id
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        async getRoleList() {
            const { rows } = await getRoleList({ page: 1, pagesize: 20 }) // rows是要循环的数据
            this.list = rows
        },
        // 当点击角色后，调用此接口
        async getUserDetailById(id) {
            const { roleIds } = await getUserDetailById(id)
            this.roleIds = roleIds
        },
        async btnOK() {
            // 该接口需要两个参数
            await assignRoles({ id: this.userId, roleIds: this.roleIds })
            // 关闭弹层 -- 控制父组件中的showRoleDialog
            this.$emit("update:showRoleDialog", false)
        },
        btnCancel() {
            // 取消
            this.roleIds = [] // 重置
            this.$emit("update:showRoleDialog", false)
        }
    }
}
</script>

<style>
/* eslint-disable */
</style>