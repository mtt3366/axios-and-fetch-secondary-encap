import axios from './http.js';
import instance from './http_file.js';
import request from './fetch_handle.js';

//axios测试
axios.get('/user/list').then(data => {
    console.log('axios1',data);
});
axios.get('/home',{//自己进行一些配置
    baseURL:'http://127.0.0.1:8888',
    withCredentials:false//有的后台不允许携带资源凭证
}).then(data => {
    console.log('axios2',data);
});
axios.post('/user/login', {
    account: '137000000',
    password: '11111111'
}).then(data => {
    console.log(data);
});

//fetch
request('/user/list').then(data => {
    console.log(data);
});
