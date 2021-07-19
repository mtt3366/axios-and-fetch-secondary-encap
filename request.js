/* 对业务层的一些处理 */
import axios from './http.js';

const handle = function handle(data) {
    let code = +data.code;
    if (code === 0) return data;
    // 业务层失败：也可以做一些统一提示或者处理
    // ...
    return Promise.reject(data.codeText);
};

const requestGET = function requestGET(url, options) {
    return axios.get(url, options).then(handle);
};

const requestPOST = function requestPOST(url, data, options) {
    return axios.post(url, data, options).then(handle);
};

export default {
    requestGET,
    requestPOST
};