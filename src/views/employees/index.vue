<!-- eslint-disable -->
<template>
    <div class="dashboard-container">
        <div class="app-container">
            <!-- 使用自己封装的工具栏组件 -->
            <page-tools :show-before="true">
                <!-- 使用插槽 -->
                <span slot="before">共{{ page.total }}条记录</span>
                <template slot="after">
                    <el-button @click="$router.push('/import?type=user')" size="small" type="warning">excel导入
                    </el-button>
                    <el-button @click="exportData" size="small" type="danger">excel导出</el-button>
                    <el-button :disabled="checkPermission('POINT-USER-ADD')" icon="plus" type="primary" size="small"
                        @click="showDialog = true">新增员工</el-button>
                </template>
            </page-tools>
            <!-- 放置表格和分页 -->
            <el-card v-loading="loading">
                <el-table border :data="list">
                    <el-table-column label="序号" sortable="" type="index" />
                    <el-table-column label="姓名" sortable="" prop="username" />
                    <el-table-column label="头像" align="center">
                        <template v-slot="{ row }">
                            <img @click="showQrCode(row.staffPhoto)" slot="reference"
                                v-imageerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto"
                                style="border-radius:50%;width:100px;height:100px;padding:10px" alt="">
                        </template>
                    </el-table-column>
                    <el-table-column label="工号" sortable="" prop="wordkNumber" />
                    <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
                    <el-table-column label="部门" sortable="" prop="departmentName" />
                    <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
                        <template slot-scope="{row}">
                            <!-- 将时间进行格式化 -->
                            {{ row.timeOfEntry | formatDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="账户状态" sortable="" prop="enableState">
                        <template slot-scope="{row}">
                            <!-- 根据当前状态来确定是否打开 -->
                            <el-switch :value="row.enableState === 1"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" sortable="" fixed="right" width="280">
                        <template v-slot="{ row }">
                            <el-button @click="$router.push(`/employees/detail/${row.id}`)" type="text" size="small">查看
                            </el-button>
                            <el-button type="text" size="small">转正</el-button>
                            <el-button type="text" size="small">调岗</el-button>
                            <el-button type="text" size="small">离职</el-button>
                            <el-button @click="editRole(row.id)" type="text" size="small">角色</el-button>
                            <el-button @click="delRole(row.id)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页组件 -->
                <el-row type="flex" justify="center" align="middle" style="height: 60px">
                    <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page"
                        :total="page.total" @current-change="changePage" />
                </el-row>
            </el-card>
        </div>
        <!-- 放置新增组件 -->
        <!-- 父组件通过 showDialog.sync="showDialog"接收；相当于@update="showDialog" -->
        <AddEmployee :showDialog.sync="showDialog" />
        <!-- 二维码弹层 -->
        <el-dialog title="二维码" :visible.sync="showCodeDialog">
            <el-row type="flex" justify="center">
                <canvas ref="myCanvas"></canvas>
            </el-row>
        </el-dialog>
        <!-- 放置分配组件 -->
        <!-- .sync修饰符：可以直接在子组件内更新父组件的值 -->
        <AssignRole ref="assignRole" :showRoleDialog.sync="showRoleDialog" :userId="userId"></AssignRole>
    </div>
</template>

<script>
/* eslint-disable */
import { getEmployeeList } from '@/api/employees'
import { deleteRole } from '@/api/setting'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import AssignRole from './components/assign-role.vue'
import QrCode from 'qrcode'
export default {
    components: { AddEmployee, AssignRole },
    data() {
        return {
            loading: false,
            showDialog: false,
            userId: null, // 记录当前点击的id
            showCodeDialog: false,
            showRoleDialog: false,
            userId: null,
            list: [], // 接数据
            page: {
                page: 1, // 当前页码
                size: 10,
                total: 0  // 总数
            },
        }
    },
    created() {
        this.getEmployeeList() // 获取员工列表数据
    },
    methods: {
        changePage(newPage) {
            this.page.page = newPage
            this.getEmployeeList() // 重新获取数据
        },
        async getEmployeeList() {
            this.loading = true
            const { total, rows } = await getEmployeeList(this.page)
            this.page.total = total
            this.list = rows
            this.loading = false
        },
        // 格式化聘用形式
        formatEmployment(row, column, cellValue, index) {
            // cellvalue：单元格的值
            const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
            return obj ? obj.value : '未知'
        },
        exportData() {
            // 数据的key是英文的，导出的数据要中文，所以需要将中文和英文做对应
            const headers = {
                '手机号': 'mobile',
                '姓名': 'username',
                '入职日期': 'timeOfEntry',
                '聘用形式': 'formOfEmployment',
                '转正日期': 'correctionTime',
                '工号': 'workNumber',
                '部门': 'departmentName'
            }
            // 导出excel
            import('@/vendor/Export2Excel').then(async excel => {
                const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
                const data = this.formatJson(headers, rows) // data就是要导出的结构
                excel.export_json_to_excel({
                    header: Object.keys(headers), // 表头,拿到对象中的key，返回数组
                    data, // 具体数据
                    filename: '员工信息',
                    bookType: 'xlsx' // 导出文件格式-- txt,xlsx,doc等等
                })
            })
        },
        // 该方法负责将数组转化成二维数组
        formatJson(headers, rows) {
            // 首先遍历数组
            // [{username:'张三'},{},{}]  ==>  [['张三'],[],[]]
            return rows.map(item => {
                return Object.keys(headers).map(key => {
                    if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
                        // 格式化日期
                        return formatDate(item[headers[key]])
                    } else if (headers[key] === 'formOfEmployment') {
                        const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
                        return obj ? obj.value : '未知'
                    }
                    return item[headers[key]]
                })
            })
        },
        showQrCode(url) {
            // url若存在，弹层
            if (url && url.trim()) {
                this.showCodeDialog = true
                // 页面渲染完毕之后调用该方法
                this.$nextTick(() => {
                    QrCode.toCanvas(this.$refs.myCanvas, url) //将地址转化为二维码地址
                })
            } else {
                this.$message.warning('该用户未上传头像')
            }
        },
        // 编辑
        async editRole(id) {
            this.userId = id
            await this.$refs.assignRole.getUserDetailById(id) // 调用子组件方法
            // 弹出层
            this.showRoleDialog = true

        },
        // 删除
        async delRole(id){
            try {
                await this.$confirm('确定要删除该数据吗？')
                await deleteRole(id)
                this.getEmployeeList() // 刷新页面的员工列表数据
                this.$message.success('删除成功')
            } catch (error) {
                console.log('删除失败',error);
            }
        }
    }
}
</script>

<style>
/* eslint-disable */
</style>