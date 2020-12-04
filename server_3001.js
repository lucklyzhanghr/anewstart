const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const template = require('art-template');
// 引入获取post请求参数第三方模块
const bodyParser = require('body-parser');
// 引入第三方解析formdata数据模块
const formidable = require('formidable');


// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public','views')));
app.use(express.static(path.join(__dirname, 'public','js')));
app.use(bodyParser.json()); // 获取json形式参数
// app.use(bodyParser.urlencoded());  // 获取键值对形式 name=张三&age=23

// 设置监听端口
app.listen(3001);
console.log('node服务连接成功...');

app.get('/test',(req,res)=>{
	res.send('成功')
})
