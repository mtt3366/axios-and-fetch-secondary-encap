import axios from "./http.js";

// 创建一个和axios类似的相同实例instance
const instance = axios.create();
instance.defaults.baseURL = '';
// ...


export default instance;