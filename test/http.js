import axios from './request'

export function getNavData(){
    return axios({
        url:'./',
        method:'get'
    })
}