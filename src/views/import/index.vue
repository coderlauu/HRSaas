<!-- eslint-disable -->
<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="onSuccess" />
</template>

<script>
/* eslint-disable */
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async onSuccess({ header, results }) {
      const userRelations = {
        // 将header中的中文数据转化为英文
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr) // 调用员工导入接口
      this.$router.back() // 导入完之后返回上一级
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  },
  data() {
    return {
      // type: this.$route.query.type
    }
  }
}
</script>