import axios from 'axios'
const MyServerHttp = {}
MyServerHttp.install = function (Vue) {
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    
    // 在请求发起之前 设置头部
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
        // Do something before request is sent
        if (config.url !== 'login') {   // 除了登录接口都拦截
            // 设置请求头的token验证，从localstorage中取
            const AUTH_TOKEN = localStorage.getItem('token')
            config.headers['Authorization'] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
        // Do something with response data
        return response;
    }, function (error) {
        // Do something with response error
        return Promise.reject(error);
    });

    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default MyServerHttp