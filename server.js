const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
// 引入获取post请求参数第三方模块
const bodyParser = require('body-parser');
// 引入第三方解析formdata数据模块
const formidable = require('formidable');
// 实现session功能
const session = require('express-session');
app.use(session({
  secret: 'keyboard tiger',
  resave: false,
  saveUninitialized: false
}));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public','views')));
app.use(express.static(path.join(__dirname, 'public','js')));
app.use(bodyParser.json()); // 获取json形式参数
// 设置允许跨域白名单
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin','http://localhost:3001');
	// res.header('Access-Control-Allow-Methods','get,post');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Credentials', true);
	next();
})
// app.use(bodyParser.urlencoded());  // 获取键值对形式 name=张三&age=23

// 设置监听端口
app.listen(3000);
console.log('node服务连接成功...');

// 上传功能
app.post('/upload', function(req, res) {
	// 解析formdata数据
	let parser = new formidable.IncomingForm();
	parser.parse(req, (err, fields, files) => {
		if (!err) {
			let file = fs.readFileSync(files.file.path);
			fs.writeFileSync(path.join(__dirname, 'upload',files.file.name),file);
		}
	})
	res.send("成功!");
})

app.get('/test', function(req, res) {
	// console.log(req.body);
	res.send("成功!");
})
app.get('/', function(req, res) {
	console.log(req.query);
	res.send("成功!");
})
// 测试jsonp请求
app.get('/testJsonp', function(req, res) {
	console.log(req.query);
	let data = {
		name: 'zhangsan',
		age: 23
	};
	// let result = JSON.stringify(data);
	// res.send(req.query.callback+'('+result+')');
	
	//在express框架中已经提供了jsonp方法来响应客户端底jsonp请求
	res.jsonp(data);  
})

// 登录
app.post('/login',(req,res)=>{
	console.log(req.body);
	if(req.body.username == 'zhangsan' && req.body.password == '123' || req.session.isLogin){
		// 代表验证成功
		req.session.isLogin = true;
		res.send('登录成功!')
	}else {
		req.session.isLogin = false;
	res.send("登录失败!请重新输入!")
	}
})

// 检测是否登录
app.get('/checkLogin',(req,res)=>{
	if (req.session.isLogin) {
		res.send("已登录!")
	} else{
		res.send("请重新登录!")
	}
})
