const mongoose = require('mongoose');

// 创建任务集合规则
const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	completed: {
		type: Boolean,
		default: false
	}
}, {versionKey: false});

// 创建todo集合
const Task = mongoose.model('task', taskSchema);

module.exports = Task;