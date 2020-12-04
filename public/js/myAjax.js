// 封装ajax请求函数
function myAjax(options) {

	// 默认参数
	let defaults = {
		type: 'get',
		url: '',
		withCredentials: false,
		data: {},
		header: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		success: function() {},
		error: function() {}
	}

	// 把options和default进行合并获取最新的参数
	Object.assign(defaults, options);

	// 封装一个ajax请求函数
	let xhr = new XMLHttpRequest();
	xhr.withCredentials = defaults.withCredentials; // 设置允许跨域携带cookie

	let type = defaults.type; // 请求方式
	let url = defaults.url;
	let params = defaults.data;

	if (type == 'get') {
		let joinParam = '';
		if (params.length>0) {
			for (let key in params) {
				if (params.hasOwnProperty(key)) {
					joinParam += (key + '=' + params[key] + '&')
				}
			}
			url = url + '?' + joinParam.substr(0, joinParam.length - 1);
		}

		xhr.open(type, url);
		// xhr.withCredentials = true; // 设置允许跨域携带cookie
		xhr.send();
	} else if (type == 'post') {
		params = JSON.stringify(params);

		xhr.open(type, url);
		// xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded'); // 键值对形式传参
		xhr.setRequestHeader('content-type', 'application/json');
		
		xhr.send(params);
	}

	xhr.onload = function() {
		if(xhr.status == 200){
			let result = xhr.getResponseHeader('Content-Type').includes('application/json')?JSON.parse(xhr.responseText):xhr.responseText;
			defaults.success(result);
		}else {
			defaults.error(xhr.responseText);
		}
	}
}

// 封装jsonp请求函数
function jsonp(options) {
	let url = options.url;
	let funName = 'jsonp' + Math.random().toString().replace('.', '');
	// 因为jsonp要求客户端对应的函数必须是全局作用域的,所以这里要把这个函数挂载到window上
	window[funName] = options.success;
	let params = options.data;
	// 因为利用script发送底请求只能是get请求,所以请求参数只能拼接到url后面
	for (let key in params) {
		funName += '&' + key + '=' + params[key];
	}

	let myScript = document.createElement('script');
	myScript.src = url + funName;
	document.body.appendChild(myScript);

	// 当这个script加载完之后,也代表这个请求已经发送到服务器,就要把这个script清除掉
	myScript.onload = () => {
		document.body.removeChild(myScript);
	}
}

// formData对象转json对象
function formDataToObject(formdata) {
	let obj = {};
	transform(obj,formdata);
	function transform(obj,formdata) {
		formdata.forEach((value, key) => {
			if (value instanceof Array) {
				transform(obj,value);
			}else if(value instanceof Object){
				transform(obj,value);
			}else{
				obj[key] = value;
			}
		})
	}
	return obj;
}

// json对象转FormData(暂时只支持一层)
function objToFormData(obj){
	let formData = new FormData();
	for (let key in obj) {
		formData.append(key,obj[key]);
	}
	return formData;
}
