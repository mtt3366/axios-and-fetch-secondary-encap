/* 
 * 对Fetch的封装：让其支持params/请求主体的格式化/请求地址的公共前缀 
 */
/* const env = process.env.NODE_ENV || 'development',
    baseURL = '';
switch (env) {
    case 'development':
        baseURL = 'http://127.0.0.1:9999';
        break;
    case 'test':
        baseURL = 'http://168.1.123.1:9999';
        break;
    case 'production':
        baseURL = 'http://api.zhufengpeixun.cn';
        break;
} */

// 公用前缀 & 默认配置
let baseURL = 'http://127.0.0.1:9999',
    inital = {
        method: 'GET',
        params: null,
        body: null,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        credentials: true,
        responseType: 'JSON',
        cache: 'no-cache'
    };

// 校验是否为纯粹的对象
const isPlainObject = function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || typeof obj !== "object") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

// 发送数据请求
const request = function request(url, config) {
    // 合并配置项{不要去更改inital中的内容}
    (config == null || typeof config !== "object") ? config = {}: null;
    if (config.headers && isPlainObject(config.headers)) {
        // 单独的给HEADERS进行深度合并
        config.headers = Object.assign({}, inital.headers, config.headers);
    }
    let {
        method,
        params,
        body,
        headers,
        credentials,
        responseType,
        cache
    } = Object.assign({}, inital, config);

    // 处理URL{格式校验 & 公共前缀 & 拼接params中的信息到URL的末尾}
    if (typeof url !== "string") throw new TypeError(`${url} is not an string!`);
    if (!/^http(s?):\/\//i.test(url)) url = baseURL + url;
    if (params != null) {
        if (isPlainObject(params)) {
            params = Qs.stringify(params);
        }
        url += `${url.includes('?')?'&':'?'}${params}`;
    }

    // 处理请求主体的数据格式{根据headers中的Content-Type处理成为指定的格式}
    if (body != null) {
        if (isPlainObject(body)) {
            let contentType = headers['Content-Type'] || 'application/json';
            if (contentType.includes('urlencoded')) body = Qs.stringify(body);
            if (contentType.includes('json')) body = JSON.stringify(body);
        }
    }

    // 处理credentials{如果传递的是true,我们让其为include,否则是same-origin}
    credentials = credentials ? 'include' : 'same-origin';

    // 基于fetch请求数据
    method = method.toUpperCase();
    responseType = responseType.toUpperCase();
    config = {
        method,
        credentials,
        cache,
        headers
    };
    /^(POST|PUT|PATCH)$/i.test(method) ? config.body = body : null;
    return fetch(url, config).then(function onfulfilled(response) {
        // 不一定是成功的：Fetch的特点的是，只要服务器有返回结果，不论状态码是多少，它都认为是成功
        let {
            status,
            statusText
        } = response;
        if (status >= 200 && status < 400) {
            // 真正成功获取数据
            let result;
            switch (responseType) {
                case 'TEXT':
                    result = response.text();
                    break;
                case 'JSON':
                    result = response.json();
                    break;
                case 'BLOB':
                    result = response.blob();
                    break;
                case 'ARRAYBUFFER':
                    result = response.arrayBuffer();
                    break;
            }
            return result;
        }
        // 应该是失败的处理
        return Promise.reject({
            code: 'STATUS ERROR',
            status,
            statusText
        });
    }).catch(function onrejected(reason) {
        // @1:状态码失败
        if (reason && reason.code === "STATUS ERROR") {
            switch (reason.status) {
                case 401:
                    break;
                    // ...
            }
        }

        // @2:断网
        if (!navigator.onLine) {
            // ...
        }

        // @3:处理返回数据格式失败
        // ...

        return Promise.reject(reason);
    });
};
export default request;