// 等页面加载完成开始执行
window.onpageshow = function() {
	let dataArr = [];

	getAll();

	// 获取全部数据
	$('.selected').on('click', function() {
		this.classList = 'selected';
		$(this).parent().siblings().children().removeClass('selected');
		render(dataArr);
	})

	// 新增数据
	$("#taskInput").on('keyup', function(e) {
		let title = this.value;
		if (e.keyCode === 13) {
			if (title.trim() === '') {
				alert('请输入任务内容!!!')
				return;
			}
			myAjax({
				type: 'post',
				url: '/task/add',
				data: {
					title: title
				},
				success: (result) => {
					console.log(result);
					this.value = '';
					$('#all').addClass('selected');
					$('#all').parent().siblings().children().removeClass('selected');
					dataArr.push(result);
					render(dataArr);
				}
			})
		}
	})

	// 删除数据(由于li标签是后天添加上去的,所以这里要使用事件委托)
	$('.todo-list').on('click', '.destroy', function() {
		if (confirm('确定要删除该条数据?')) {
			// 获取要删除数据的ID
			let dataId = $(this).attr('data-id');
			// 请求后台删除数据
			myAjax({
				type: 'post',
				url: '/task/del',
				data: {
					_id: dataId
				},
				success: function(result) {
					if (result == '删除成功') {
						// for (var i = 0; i < dataArr.length; i++) {
						// 	if (dataArr[i]._id == dataId) {
						// 		dataArr.splice(i, 1);
						// 	}
						// }
						// es6语法 ie12才支持
						let index = dataArr.findIndex(val => val._id == dataId);
						dataArr.splice(index, 1);
						$('#all').addClass('selected');
						$('#all').parent().siblings().children().removeClass('selected');
						render(dataArr);
					}
				}
			})
		}
	})

	// 双击标签改变内容
	$('.todo-list').on('dblclick', 'label', function(e) {
		e.stopPropagation();
		$(this).html('<input type="text" value="' + $(this).text() + '"></input>');
		// 获取修改内容对应id
		let id = $(this).siblings('button').attr('data-id');
		let put = $(this).children('input');
		put.select();
		let newValue = '';
		put.on('blur', () => {
			newValue = put.val();
			$(this).html(newValue);
		})
		// 把新内容保存到数据库
		myAjax({
			type: 'post',
			url: '/task/update',
			data: {
				id: id,
				title: newValue
			},
			success: function (result){
				if(result == '更新成功'){
					dataArr.some((obj)=>{
						if(obj._id == id){
							obj.title = newValue;
							return true;
						}
					})
				}
				render(dataArr);
			}
		})
	})

	// 获取未完成任务
	$('#active').on('click', function() {
		this.classList = 'selected';
		$(this).parent().siblings().children().removeClass('selected');
		let activeArr = dataArr.filter((value) => !value.completed);
		render(activeArr);
	})

	// 获取已完成任务
	$('#completed').on('click', function() {
		this.classList = 'selected';
		$(this).parent().siblings().children().removeClass('selected');
		let activeArr = dataArr.filter((value) => value.completed);
		render(activeArr);
	})

	// 清除已完成
	$('.clear-completed').on('click', function() {

		if (confirm('确定清除已完成?')) {
			// 把任务队列中已完成底全部清除
			myAjax({
				url: '/task/clearActive',
				success: function(result) {
					if (result == '清除成功') {
						for (var i = 0; i < dataArr.length; i++) {
							if (dataArr[i].completed) {
								dataArr.splice(i, 1);
								i--;
							}
						}
						render(dataArr);
					}
				}
			})
		}

	})

	// 切换任务状态
	$('.todo-list').on('change', '.toggle', function() {
		let _id = $(this).siblings('.destroy').attr('data-id');
		let flag = this.checked;
		// 更新数据
		myAjax({
			type: 'post',
			url: '/task/update',
			data: {
				id: _id,
				completed: flag
			},
			success: function(result) {
				var that = this;
				if (result == '更新成功') {
					dataArr.some(obj => {
						if (obj._id == _id) {
							obj.completed = flag;
							return true;
						}
					});
					render(dataArr);
				}
			}
		})
	})


	// 获取全部数据
	function getAll() {
		// 向服务器发送ajax请求获取全部任务
		myAjax({
			url: '/task/all',
			success: function(result) {
				dataArr = result;
				render(result);
			}
		})
	}

	function render(dataArr1) {
		// console.log(typeof data);
		let html = template('allTemp', {
			tasks: dataArr1
		});
		$('.todo-list').html(html);
		let activeArr = dataArr.filter((obj => !obj.completed));
		let activeNum = activeArr.length;
		$('.todo-count').children().html(activeNum);
	}
}
