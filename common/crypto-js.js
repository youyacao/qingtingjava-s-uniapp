// import CryptoJS from 'crypto-js'

// const key = CryptoJS.enc.Utf8.parse('tt3217834abcdefg')
// const iv = CryptoJS.enc.Utf8.parse('ee34567890123456')

// /**
//  * AES加密
//  * @param {any} word 加密数据
//  */
// export const cryptoEncrypt = (word) => {
// 	let encrypted = ''
// 	let srcs = ''
// 	if (typeof(word) == 'string') {
// 		srcs = word
// 	} else if (typeof(word) == 'object') {
// 		// 对象格式的转成json字符串
// 		srcs = CryptoJS.enc.Utf8.parse(word)
// 	}
// 	encrypted = CryptoJS.AES.encrypt(srcs, key, {
// 		iv,
// 		mode: CryptoJS.mode.CBC,
// 		padding: CryptoJS.pad.Pkcs7
// 	})
// 	return encrypted.ciphertext.toString()
// }

// /**
//  * AES解密
//  * @param {any} word 解密数据
//  */
// export const cryptoDecrypt = (word) => {
// 	let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
// 	let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
// 	let decrypt = CryptoJS.AES.decrypt(srcs, key, {
// 		iv,
// 		mode: CryptoJS.mode.CBC,
// 		padding: CryptoJS.pad.Pkcs7
// 	})
// 	let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
// 	return decryptedStr.toString()
// }
