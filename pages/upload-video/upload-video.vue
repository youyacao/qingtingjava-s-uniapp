<template>
	<view class="body">
		<view class="head">
			<textarea class="textarea" placeholder="请输入标题~" v-model="title" />
			<view class="head-right" @tap="_chooseVideo">
				<view class="video-box">
					<video class="video" id="video" :src="src" v-if="src" :controls="false" autoplay></video>
					<image class="add-icon" src="/static/images/add-icon-1.png" mode="" v-else></image>
				</view>
				<view class="progress-box" v-if="uploadProgress">
					<text class="progress-text">{{ uploadProgress }}%</text>
				</view>
			</view>
		</view>
		<view class="line"></view>
		<view class="select" @tap="show = true">
			<view class="select-left">
				<image class="select-left__right" src="/static/images/categories.png" mode=""></image>
				<text>{{ selectItem.label }}</text>
			</view>
			<image class="select-icon" src="/static/images/right-arrow.png" mode=""></image>
		</view>
		<view class="btn-box">
			<u-button type="success" @click="_verify" :loading="loading">发布</u-button>
		</view>
		<u-select v-model="show" :list="list" @confirm="_confirm"></u-select>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { Categories } from '@/common/api.js'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	import { mapActions } from 'vuex'
	
	export default {
		data() {
			return {
				src: '',
				show: false,
				list: [],
				selectItem: {
					value: '',
					label: '选择分类'
				},
				title: '',
				loading: false,
				uploadProgress: 0,
				videoContext: null
			};
		},
		onLoad(options) {
			this.src = options.url
			uni.hideTabBar()
			this._getCategories()
		},
		onShow() {
			if (this.videoContext) {
				this.videoContext.play()
			}
			this.updateUserinfo()
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_chooseVideo() {
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: (res) => {
						this.src = res.tempFilePath
						this.videoContext = uni.createVideoContext('video', this)
					}
				})
			},
			_getCategories() {
				Categories().then(({ message, data }) => {
					if (message.code === '200') {
						data.map((item, index) => {
							this.list.push({
								value: item.id,
								label: item.name
							})
						})
					}
				})
			},
			_confirm(e) {
				this.selectItem = e[0]
			},
			_verify() {
				if (!this.title) {
					return this.$refs.uToast.show({
						title: '请输入标题',
						type: 'warning'
					})
				}
				if (!this.src) {
					return this.$refs.uToast.show({
						title: '请选择视频',
						type: 'warning'
					})
				}
				if (!this.selectItem.value) {
					return this.$refs.uToast.show({
						title: '请选择分类',
						type: 'warning'
					})
				}
				this._uploadVideo()
			},
			_uploadVideo() {
				this.loading = true
				const _formData = JSON.stringify({
					categoryId: this.selectItem.value,
					title: this.title,
					content: ''
				})
				const uploadTask = uni.uploadFile({
					url: `${BASE_URL}addVideo`,
					header: {
						token: getToken()
					},
					filePath: this.src,
					name: 'file',
					formData: {
						data: _formData
					},
					success: (uploadFileRes) => {
						const { message, data } = JSON.parse(uploadFileRes.data)
						if (message.code === '200') {
							this.title = ''
							this.src = ''
							setTimeout(() => {
								this.uploadProgress = 0
							}, 200)
							this.selectItem = {
								value: '',
								label: '选择分类'
							}
						}
						uni.showToast({
							title: message.msg,
							icon: 'none'
						})
					},
					fail: (err) => {
						console.log('视频上传失败', err)
					},
					complete: () => {
						this.loading = false
					}
				})
				uploadTask.onProgressUpdate((res) => {
					this.uploadProgress = res.progress
					console.log('上传进度', res.progress)
				})
			}
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.progress-box {
		width: 150rpx;
		text-align: center;
	}
	.progress-text {
		font-size: 24rpx;
		color: #808080;
		margin-top: 12rpx;
	}
	.video {
		width: 150rpx;
		height: 200rpx;
	}
	.select-left {
		display: flex;
		align-items: center;
	}
	.select-left__right {
		width: 45rpx;
		height: 45rpx;
		margin-right: 12rpx;
	}
	.select {
		height: 80rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 32rpx;
		align-items: center;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.select-icon {
		width: 40rpx;
		height: 40rpx;
	}
	.btn-box {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		padding: 32rpx;
	}
	.line {
		margin: 32rpx;
		height: 1rpx;
		background-color: #808080;
	}
	.add-icon {
		width: 50rpx;
		height: 50rpx;
	}
	.textarea {
		flex: 1;
		color: #FFFFFF;
	}
	.video-box {
		height: 200rpx;
		border-radius: 12rpx;
		background-color: #808080;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.head-right {
		width: 150rpx;
	}
	.head {
		display: flex;
		padding: 32rpx;
	}
	.body {
		height: 100vh;
		background-color: #252a34;
	}
</style>
