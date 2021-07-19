import axios from './http.js';
import instance from './http_file.js';
import request from './fetch_handle.js';

axios.get('/user/list').then(data => {
    console.log('axios',data);
});


request('/user/list').then(data => {
    console.log(data);
});
