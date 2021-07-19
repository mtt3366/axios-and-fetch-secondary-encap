const http = require('http')
const url = require('url')

const port = 9999;

const server = http.createServer(function (request, response) {

    const temp = url.parse(request.url, true)
    const path = temp.pathname
    // const query = temp.query
    // const method = request.method
    // console.log(query)

    //允许本地开启的静态服务器进行跨域请求

    response.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
    response.setHeader("Access-Control-Allow-Credentials","true")

    if (path === '/') {
        response.setHeader('Content-Type', 'text/html;charset=utf-8')  // 设置响应头 Content-Type
        response.write(`<html>html</html>`)   // 设置响应消息体
        response.end();
    }else if (path === '/user/list') {
        response.setHeader('Content-Type', 'application/json')//设置返回文件类型为javascript
        response.statusCode = 200;
        response.write(`{
                "success":true,
                "list":[1,2,3]
            }`)
        response.end()
    }else if (path === '/test') {
        response.setHeader('Content-Type', 'application/json')
        response.statusCode = 200;
        response.write(`{
                "success":true,
                "value":'test'
            }`)
        response.end()
    } else {  // 如果上面都不是用户请求的路径
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')  // 设置响应头 Content-Type
        response.write('找不到对应的路径，你需要自行修改 index.js')
        response.end()
    }
})

server.listen(port)
console.log('监听 ' + port + ' 成功,请求地址为 http://localhost:' + port)