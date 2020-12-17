import Request from '@/js_sdk/luch-request/luch-request/index.js'
import {
	cryptoEncrypt
} from '@/common/crypto-js.js'
import { BASE_URL } from '@/common/config.js'

const http = new Request()
const _config = {
	baseURL: '',
	header: {},
	method: 'GET',
	dataType: 'json',
	// #ifndef MP-ALIPAY || APP-PLUS
	responseType: 'text',
	// #endif
	// 注：如果局部custom与全局custom有同名属性，则后面的属性会覆盖前面的属性，相当于Object.assign(全局，局部)
	custom: {}, // 全局自定义参数默认值
	// #ifdef MP-ALIPAY || MP-WEIXIN
	timeout: 30000,
	// #endif
	// #ifdef APP-PLUS
	sslVerify: true,
	// #endif
	// #ifdef H5
	// 跨域请求时是否携带凭证（cookies）仅H5支持（HBuilderX 2.6.15+）
	withCredentials: false,
	// #endif
	// #ifdef APP-PLUS
	firstIpv4: false, // DNS解析时优先使用ipv4 仅 App-Android 支持 (HBuilderX 2.8.0+)
	// #endif
	// 局部优先级高于全局，返回当前请求的task,options。请勿在此处修改options。非必填
	// getTask: (task, options) => {
	// 相当于设置了请求超时时间500ms
	//   setTimeout(() => {
	//     task.abort()
	//   }, 500)
	// },
	// 全局自定义验证器。参数为statusCode 且必存在，不用判断空情况。
	validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置
		return statusCode >= 200 && statusCode < 300
	}
}

export const get = (url, params) => {
	return http.get(`${BASE_URL}${url}`, {
		params,
		..._config
	})
}

export const post = (url, data) => {
	console.log('请求参数', data || {})
	// console.log('请求参数加密后：', data ? cryptoEncrypt(data) : {})
	// return http.post(`${BASE_URL}${url}`, { datas: data ? cryptoEncrypt(data) : {}, timestamp: new Date().getTime() }, {..._config, method: 'POST'})
	return http.post(`${BASE_URL}${url}`, data, { ..._config,
		method: 'POST'
	})
}

// export const upload = (url, data) => {
// 	const { filePath, name } = data
// 	return http.upload(`${BASE_URL}${url}`, {
//     params: {}, /* 会加在url上 */
//     // #ifdef APP-PLUS || H5
//     files: [], // 需要上传的文件列表。使用 files 时，filePath 和 name 不生效。App、H5（ 2.6.15+）
//     // #endif
//     // #ifdef MP-ALIPAY
//     fileType: 'image/video/audio', // 仅支付宝小程序，且必填。
//     // #endif
//     filePath, // 要上传文件资源的路径。
//     name, // 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
//     header: {}, /* 会与全局header合并，如有同名属性，局部覆盖全局 */
//     custom: {}, // 自定义参数
//     formData: {}, // HTTP 请求中其他额外的 form data
//     // 返回当前请求的task, options。请勿在此处修改options。非必填
//     getTask: (task, options) => {
//       // setTimeout(() => {
//       //   task.abort()
//       // }, 500)
//     },
//     //validateStatus: (statusCode) => { // statusCode 必存在。此处示例为全局默认配置。演示，非必填选项
//     //	return statusCode >= 200 && statusCode < 300
//     //}
//   })
// }

// 请求之前
http.interceptors.request.use((config) => {
	try {
		const _token = uni.getStorageSync('TOKEN')
		if (_token) {
			config.header = {
				...config.header,
				token: _token
			}
		}
	} catch (e) {
		// error
	}
	return config
}, config => {
	return Promise.reject(config)
})

// 请求之后
http.interceptors.response.use((response) => {
	const {
		code
	} = response.data.message
	if (code === '100') {
		uni.navigateTo({
			url: '/pages/login/index/index'
		})
	}
	if (code === '200') {
		const _token = response.header.authorization
		if (_token) {
			try {
				uni.setStorageSync('TOKEN', _token)
			} catch (e) {
				// error
			}
		}
	}
	console.log('请求接口', response.config.url)
	console.log(response.data)
	return response.data
}, (response) => {
	console.log(response)
	return Promise.reject(response)
})
