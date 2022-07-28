<!-- eslint-disable -->
<!-- 图片组件封装 -->
<template>
    <div>
        <el-upload list-type="picture-card" action="#" :on-preview="preview" :class="{ disabled: fileComputed }"
            :on-remove="handleRemove" :on-change="changeFile" :before-upload="beforeUpload" :http-request="upload"
            :file-list="fileList">
            <i class="el-icon-plus" />
        </el-upload>
        <el-progress v-if="showPercent" style="width:180px" :percentage="percent"></el-progress>
        <el-dialog title="图片预览" :visible.sync="showDialog">
            <img :src="imgUrl" style="width:100%" alt="">
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 实例化COS
const cos = new COS({
    SecretId: 'AKIDiFXaOxGK9i7HBqFPJyNZWDfroWzC9rJV', // 身份识别ID
    SecretKey: 'ziBOM5apoa7OPBhxyjEUUEjSwBBwRgfR'   // 身份密钥 
})
export default {
    props: {
        limit: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            fileList: [], // 图片地址设置为数组
            showDialog: false, // 控制显示弹层
            imgUrl: '',
            currentFileUid: '', // 用一个变量 记住当前上传的图片id
            percent: 0,
            showPercent: false // 默认不显示进度条
        }
    },
    methods: {
        // 点击预览事件
        preview(file) {
            // 这里应该弹出一个层，层里是点击的图片地址
            this.imgUrl = file.url
            this.showDialog = true
        },
        // file：要删除的文件 ；fileList：删除之后的数组
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        changeFile(file, fileList) {
            this.fileList = fileList.map(item => item)
        },
        beforeUpload(file) {
            // 文件上传检查
            // 文件类型 文件大小
            const types = ['image/jpg', 'image/gif', 'image/bmp', 'image/png']
            if (!types.includes(file.type)) {
                this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式！')
                return false
            }
            // 检查大小
            const maxSize = 5 * 1024 * 1024
            if (maxSize < file.size) {
                this.$message.error('图片大小最大不能超过5M')
                return false
            }
            this.currentFileUid = file.uid
            return true
        },
        upload(params) {
            if (params.file) {
                // 执行上传操作
                cos.putObject({
                    Bucket: 'coderlau-1313038078', //  存储桶
                    Region: 'ap-guangzhou', // 地域
                    Key: params.file.name, // 文件名
                    Body: params.file, // 要上传的文件对象
                    StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
                    // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
                    onProgress: (params) => {
                        this.percent = params.percent * 100
                    }
                }, (err, data) => {
                    // data返回数据之后 应该如何处理
                    console.log(err || data)
                    if (!err && data.statusCode === 200) {
                        // 文件上传成功
                        this.fileList = this.fileList.map(item => {
                            if (item.uid === this.currentFileUid) {
                                return { url: 'http://' + data.Location, upload: true }
                            }
                            return item
                        })
                        setTimeout(() => {
                            this.showPercent = false // 隐藏进度条
                            this.percent = 0 // 进度归0
                        }, 2000)
                    }
                })
            }
        }

    },
    computed: {
        // 设定一个计算属性 判断是否已经上传完了一张
        fileComputed() {
            return this.fileList.length === this.limit
        }
    },
}
</script>

<style>
/* eslint-disable */
.disabled .el-upload--picture-card {
    display: none;
}
</style>