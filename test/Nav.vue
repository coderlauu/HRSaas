<template>
    <div class="sidebar">
        <div class="title">XXX管理系统</div>
        <ul>
            <!-- 默认数据 -->
            <!-- 
                通过$store.state可以直接获取vuex中缓存的数据
                缺点：如果store的数据复杂，$store.state.xx.xx.xx 这样比较复杂 
             -->
            <li v-for="(v, i) in navData" :key="i">
                <router-link :to="v.path">
                    <i class="iconfont" :class="v.icon"></i>
                    <span>{{ v.title }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
/**
 * 辅助函数
 * mapActions/mapGetters
 * 如果想直接去触发store里的actions，就用mapActions
 * 如果想直接用store里的getters，就在computed里使用mapGetters
 *  */ 
import { mapGetters } from 'vuex'
export default {
    computed:mapGetters(['navData']) // 获取store中getters里的nav属性
}    
</script>