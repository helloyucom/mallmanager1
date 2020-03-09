import axios from 'axios'
const MyServerHttp = {}
const AUTH_TOKEN = localStorage.getItem('token')
MyServerHttp.install = function (Vue) {
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;    // 设置请求头的token验证，从localstorage中取
    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default MyServerHttp