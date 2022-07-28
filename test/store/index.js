import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        nav:[]
    },
    getters:{ // 相当于vue的computed
        navData:state => state.nav 
    },
    actions:{ // 提交给mutation处理
        setNav({commit},data){
            commit('setNav',data)
        }
    },
    mutations:{ // 对state的数据进行修改
        setNav(state,data){
            state.nav = data
        }
    },
    modules:{

    }
})