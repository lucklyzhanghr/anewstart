
window.onload = function() {
	
	// 异步ajax请求
	let xhr = new XMLHttpRequest();

	// 点击上传开始上传文件
	document.querySelector("#up").addEventListener('click', function() {
		// myAjax({
		// 	type: 'get',
		// 	url: '/',
		// 	params: {
		// 		name: '张三',
		// 		age: 23
		// 	}
		// })
		if (!document.querySelector("#upload").files[0]) {
			alert('请选择文件')
			return false;
		}
		let file = document.querySelector("#upload").files[0];

		// 新建formData对象
		let data = new FormData();
		data.append('file', file); // 把上传文件设置到formdata中

		xhr.open('post', '/upload', true);

		let startTime;
		let startData = 0;
		// 上传开始
		xhr.onloadstart = function() {
			startTime = +new Date();
		}

		// 上传中
		xhr.upload.onprogress = function(e) {
			// console.log('上传中...');
			let progressTime = +new Date();
			// 时间差
			let time = (progressTime - startTime) / 1000;
			// console.log(time);
			// 上传进度 已上传大小/总大小
			let provalue = (e.loaded / e.total * 100).toFixed(0);
			// console.log(provalue);
			document.querySelector('.progress').value = provalue;
			document.querySelector('#rate').innerText = provalue + '%';

			// 时间差内上传的文件大小
			let loaded = e.loaded - startData;
			// console.log(loaded);
			startTime = progressTime;
			startData = e.loaded;
			// 上传大小/时间=速率
			let rate = (loaded / time);
			// console.log("rate:" + rate);
			let unit = 'b/s';
			if (rate / 1024 >= 1) {
				unit = 'kb/s'
				rate = rate / 1024
			}
			if (rate / 1024 >= 1) {
				unit = 'm/s'
				rate = rate / 1024;
			}
			// console.log(rate, unit);
			document.querySelector('.speed').innerHTML = `${rate.toFixed(2)} ${unit}`;
		}

		// 上传结束
		xhr.upload.onloadend = function() {

		}

		// 上传出错
		xhr.upload.onerror = function() {
			alert('文件上传失败,请重试!')
		}

		xhr.upload.onabort = () => {
			console.log('取消上传');
			document.querySelector('.speed').innerHTML = '';
			document.querySelector('.progress').value = 0;
			document.querySelector('#rate').innerText = '';
		}

		xhr.upload.onload = function() {
			console.log("上传完成...");
		}

		xhr.send(data);
	})

	// 取消上传
	document.querySelector('#abortUpload').addEventListener('click', function() {
		console.log(111);
		xhr.abort();
	})
}
