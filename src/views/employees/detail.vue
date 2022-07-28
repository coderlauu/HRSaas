<!-- eslint-disable -->
<template>
    <div class="dashboard-container">
        <div class="app-container">
            <el-card>
                <el-tabs>
                    <el-tab-pane label="登录账户设置">
                        <!-- 放置表单 -->
                        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="120px"
                            style="margin-left: 120px; margin-top:30px">
                            <el-form-item prop="username" label="姓名:">
                                <el-input v-model="userInfo.username" style="width:300px" />
                            </el-form-item>
                            <el-form-item prop="password2" label="新密码:">
                                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="saveUser" type="primary">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="个人详情">
                        <el-row type="flex" justify="end">
                            <el-tooltip content="打印个人基本信息">
                                <router-link :to="`/employees/print/${userId}?type=personal`">
                                    <i class="el-icon-printer" />
                                </router-link>
                            </el-tooltip>
                        </el-row>
                        <!-- vuejs中 内置了一个组件 component , :is属性可以指定任何组件-->
                        <component :is="UserComponent"></component>
                        <!-- 动态组件：可以切换组件-->
                    </el-tab-pane>
                    <el-tab-pane label="岗位信息">
                        <el-row type="flex" justify="end">
                            <el-tooltip content="打印岗位信息">
                                <router-link :to="`/employees/print/${userId}?type=job`">
                                    <i class="el-icon-printer" />
                                </router-link>
                            </el-tooltip>
                        </el-row>
                        <component :is="JobComponent"></component>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
// 调用接口来查询用户的基本资料
import { getUserDetailById } from "@/api/user";
import { saveUserDetailById } from "@/api/employees";
import { thisExpression } from "@babel/types";
import UserInfo from './components/user-info.vue'
import JobInfo from './components/job-info.vue'
export default {
    components: { UserInfo, JobInfo },
    data() {
        return {
            UserComponent: 'UserInfo',
            JobComponent: 'JobInfo',
            userId: this.$route.params.id,
            userInfo: {
                // 专门存放基本信息
                username: '',
                password2: '' // 存储修改值，
            },
            rules: {
                username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getUserDetailById()
    },
    methods: {
        async getUserDetailById() {
            const result = await getUserDetailById(this.userId)
            this.userInfo = result
        },
        saveUser() {
            // 校验自定义表单---绑定ref
            this.$refs.userForm.validate().then(async () => {
                await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // ...this.userInfo浅拷贝，后面定义的password:passoword2会覆盖前一个定义的属性
                this.$message.success('修改用户信息成功')
            })
        }
    }
}
</script>