axios.defaults.baseURL = 'http://localhost:9999';
// 设置超时时间{10S} & 设置跨域请求中是否携带资源凭证
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;
// 配置公共的自定义请求头信息  headers['common']/headers['post/get...']/headers/...
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// POST系列请求对于请求主体信息的统一格式化
axios.defaults.transformRequest = function (data, headers) {
    if (data === null || typeof data !== "object") return data;
    let contentType = headers['Content-Type'] || headers.post['Content-Type'];
    if (contentType.includes('urlencoded')) return Qs.stringify(data);
    if (contentType.includes('json')) return JSON.stringify(data);
    return data;
};
// 设置响应状态码的校验处理{规定服务器返回的状态码哪些是算请求成功，哪些算失败}
axios.defaults.validateStatus = function (status) {
    return status >= 200 && status < 400;
};

// 请求拦截器，当所有配置处理完，在向服务器发送请求之前，我们拦截到现有的配置，再去做一些统一修改
axios.interceptors.request.use(function (config) {
    // 例如：传递Token
    /* const token = sessionStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = token;
    } */
    return config;
});

// 响应拦截器，当前请求有结果之后，我们在业务层自己调用then/catch方法之间拦截一下，这样可以做一些成功或者失败的统一提示处理等...
axios.interceptors.response.use(function onfulfilled(response) {
    // 成功:服务器正常返回结果 & validateStatus状态码校验成功
    return response.data;
}, function onrejected(reason) {
    // 失败:@1服务器返回了结果但是状态码没有经过validateStatus校验 || @2服务器压根没有返回任何的结果 || @3请求中断或者超时...
    let response = reason.response;
    if (response) {
        // @1
        switch (response.status) {
            case 401:
                break;
                // ...
        }
    } else {
        if (reason && reason.code === 'ECONNABORTED') {
            // @3
        }
        if (!navigator.onLine) {
            // @2
        }
    }
    return Promise.reject(reason);
});

export default axios;