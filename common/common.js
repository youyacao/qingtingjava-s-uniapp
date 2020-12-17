export const getToken = () => {
	let token = null
	try {
		const _token = uni.getStorageSync('TOKEN')
		if (_token) {
			token = _token
		}
	} catch (e) {
		// error
	}
	return token
}

// 1维数组转2维数组
export const toTwoArray = (arr, count) => {
	let result = []
	let num = Math.ceil(arr.length / count);
	for(let i = 0 ;i < num; i++){
		result.push(arr.slice(i * count, i * count + count))
	}
	return result
}