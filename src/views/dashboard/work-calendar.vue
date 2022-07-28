<!-- eslint-disable -->
<template>
    <div>
        <el-row type="flex" justify="end">
            <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
                <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
            </el-select>
            <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
                <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
            </el-select>
        </el-row>
        <el-calendar v-model="currentDate">
            <!-- date为单元格日期；data为对象，对象里又要显示的day -->
            <template v-slot:dateCell="{ date, data }" class="content">
                <div class="date-content">
                    <span class="text"> {{ data.day | getDay }}</span>
                    <span v-if="isWeek(date)" class="rest">休</span>
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    filters: {
        getDay(value) {
            const day = value.split('-')[2]
            return day.startsWith('0') ? day.substr(1) : day
        }
    },
    props: {
        startDate: {
            type: Date,
            default: () => new Date()  // 如果没有传递startDate就取当前时间
        }
    },
    data() {
        return {
            currentMonth: null, // 当前月份
            currentYear: null, // 当前年份
            currentDate: null, // 当前时间
            yearList: []  // 要遍历的年的数组
        }
    },
    created() {
        // 获取当前的年份 --new Date().getFullYear()
        this.currentYear = this.startDate.getFullYear()
        // 获取当前年份的前后五年的年份；使用Array.from(Array(),(value,index)=>{})方法
        this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5)
        // 获取当前的月份 --new Date().getMonth()+1
        this.currentMonth = this.startDate.getMonth() + 1
        // 页面加载完成，页面要展示当前最新的时间
        this.dateChange()
    },
    methods: {
        // 给select绑定change事件
        dateChange() {
            // 年月变化时，生成新的日期
            this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
        },
        // 判断是否为周末
        isWeek(value) {
            return value.getDay() === 6 || value.getDay() === 0
        }
    }
}
</script>

<style scoped>
/* eslint-disable */
/deep/ .el-calendar-day {
    height: auto;
}

/deep/ .el-calendar-table__row td,
/deep/ .el-calendar-table tr td:first-child,
/deep/ .el-calendar-table__row td.prev {
    border: none;
}

.date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
}

.date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
}

.date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;

}

/deep/ .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
}

/deep/ .el-calendar__header {
    display: none
}
</style>