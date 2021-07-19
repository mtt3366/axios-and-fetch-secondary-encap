import axios from './http.js';

axios.get('/user/list').then(data => {
    console.log('axios',data);
});
