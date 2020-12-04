const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 引入task路由
const taskRouter = require('./public/router/taskRouter');

app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json());

// 连接数据库
mongoose.connect('mongodb://todo:todo@localhost:27017/todo',{useNewUrlParser: true,useUnifiedTopology: true})
				.then(()=>console.log('数据库连接成功!'))
				.catch(err=>console.log(`数据库连接异常:${err}`))

// 请求task路径的请求都跳转到taskrouter路由进行处理
app.use('/task',taskRouter);

app.listen(3002);
console.log('node服务启动成功,端口号:3002');