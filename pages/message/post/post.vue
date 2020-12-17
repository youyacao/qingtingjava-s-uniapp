<template>
	<view class="body">
		<view class="content">
			<u-input v-model="content" type="textarea" height="250" auto-height placeholder="此刻的想法..." />
		</view>
		<view class="upload-box">
			<u-upload ref="uUpload" :auto-upload="false" max-count="6" @on-choose-complete="onChooseComplete" @on-remove="onRemove"></u-upload>
		</view>
		<u-cell-item icon="grid" :title="selectItem.label" @click="show = true"></u-cell-item>
		<u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="_confirm"></u-select>
		<u-toast ref="uToast" />
		<view class="btn-box">
			<u-button type="success" :loading="loading" @click="_submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import { Categories, PostArticle, UploadImage } from '@/common/api.js'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	
	export default {
		data() {
			return {
				content: '',
				show: false,
				list: [],
				selectItem: {
					value: '',
					label: '选择分类'
				},
				fileList: [],
				loading: false
			};
		},
		onLoad() {
			this._getCategories()
			// UploadImage().then(({ code, msg }) => {
			// 	console.log(code, msg)
			// })
			
			// uni.chooseImage({
			//     success: (chooseImageRes) => {
			//         const tempFilePaths = chooseImageRes.tempFilePaths
			// 		let _time = 0
			// 		const _timer = setInterval(() => {
			// 			_time++
			// 		}, 100)
			//         uni.uploadFile({
			//         	url: `${BASE_URL}upload`,
			//         	filePath: tempFilePaths[0],
			//         	header: {
			//         		authorization: getToken()
			//         	},
			//         	name: 'file',
			//         	success: (uploadFileRes) => {
			//         		console.log(uploadFileRes)
			//         	},
			//         	fail: (error) => {
			//         		console.log(error)
			//         	},
			//         	complete: () => {
			// 				clearInterval(_timer)
			//         		console.log('complete', _time)
			//         	}
			//         })
			//     }
			// })
		},
		methods: {
			_submit() {
				if (!this.content) {
					return this.$refs.uToast.show({
						title: '请输入内容',
						type: 'warning'
					})
				}
				if (!this.selectItem.value) {
					return this.$refs.uToast.show({
						title: '请选择分类',
						type: 'warning'
					})
				}
				this.loading = true
				PostArticle({
					type: 1,
					category_id: this.selectItem.value,
					content: this.content,
					images: this.fileList
				}).then(({ code, msg }) => {
					this.loading = false
					if (code === 200) {
						this.$refs.uToast.show({
							title: msg,
							type: 'success',
							back: true
						})
					} else {
						this.$refs.uToast.show({
							title: msg,
							type: 'error'
						})
					}
				})
			},
			onChooseComplete(lists) {
				uni.showLoading({
				    title: '上传中'
				})
				let _length = 0
				let _count = 0
				let _errIndex = []
				console.log(lists)
				lists.map((item, index) => {
					uni.uploadFile({
						url: `${BASE_URL}upload`,
						filePath: item.url,
						header: {
							authorization: getToken()
						},
						name: 'file',
						success: (uploadFileRes) => {
							const { code, data } = JSON.parse(uploadFileRes.data)
							console.log('上传成功', code, data)
							if (code === 200) {
								_length++
								if (data.url) {
									this.fileList.push(data.url)
								}
							} else {
								_errIndex.push(index)
							}
						},
						fail: (error) => {
							_errIndex.push(index)
						},
						complete: () => {
							_count++
							if (_count === lists.length) {
								if (_length === lists.length) {
									uni.hideLoading()
									this.$refs.uToast.show({
										title: '上传成功',
										type: 'success'
									})
								} else {
									uni.hideLoading()
									this.$refs.uToast.show({
										title: `成功上传${_length}张，${lists.length - _length}张上传失败`,
										type: 'success'
									})
									_errIndex.map(item => {
										this.$refs.uUpload.remove(item)
									})
								}
							}
						}
					})
				})
			},
			onRemove(index, lists, name) {
				console.log(index, lists, name)
			},
			_getCategories() {
				Categories().then(({ code, data }) => {
					if (code === 200) {
						data.map((item, index) => {
							this.list.push({
								value: item.id,
								label: item.name,
								children: []
							})
							if (item.children.length) {
								item.children.map(item => {
									this.list[index].children.push({
										value: item.id,
										label: item.name
									})
								})
							} else {
								this.list[index].children[0] = {
									value: item.id,
									label: item.name
								}
							}
						})
					}
				})
			},
			_confirm(e) {
				this.selectItem = e[1]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-box {
		position: absolute;
		bottom: 32rpx;
		left: 32rpx;
		right: 32rpx;
 	}
	.upload-box {
		padding: 32rpx 22rpx;
		display: flex;
		flex-flow: row wrap;
	}
	.content {
		padding: 32rpx;
	}
	.body {
		height: 100vh;
	}
</style>
