const mongoose = require('mongoose');
const express = require('express');
const Task = require('../model/task');

const router = express.Router();

router.get('/all',(req,res)=>{
	Task.find().then((result)=>{
	// res.status(200);
		res.send(result);
	});
})

router.get('/clearActive',(req,res)=>{
		Task.deleteMany({completed: true}).then(()=>res.send('清除成功'))
	});

router.post('/add',(req,res)=>{
	let data = new Task(req.body);
	data.save().then((result)=>res.send(result))
										  .catch((err)=>res.send(err));
	// Task.save(req.body).then((result)=>{
	// // res.status(200);
	// console.log(typeof result);
	// res.send(result);
	// });
})

router.post('/del',(req,res)=>{
	let data = new Task(req.body);
	data.delete().then(()=>res.send('删除成功'))
										  .catch((err)=>res.send(err));
	// Task.save(req.body).then((result)=>{
	// // res.status(200);
	// console.log(typeof result);
	// res.send(result);
	// });
})

router.post('/update',(req,res)=>{
	let data = new Task(req.body);
	Task.updateOne({_id: req.body.id},req.body).then(()=>res.send("更新成功"))
										  .catch((err)=>res.send(err));
	// Task.save(req.body).then((result)=>{
	// // res.status(200);
	// console.log(typeof result);
	// res.send(result);
	// });
})

module.exports = router;