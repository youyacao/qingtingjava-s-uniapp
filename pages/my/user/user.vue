<template>
	<view>
		<view class="avatar-box">
			<u-avatar :src="userinfo.avatar" size="large" @tap="_chooseAvatar"></u-avatar>
			<text class="avatar-box__text">点击更换头像</text>
		</view>
		<u-cell-group :border="false">
			<u-cell-item icon="account" title="用户名" :value-style="valueStyle" :value="userinfo.username" :border-top="false" @click="_setUsername"></u-cell-item>
			<u-cell-item icon="edit-pen" title="个性签名" :value-style="valueStyle" :value="userinfo.sign" @click="_setSignature"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import { BASE_URL } from '@/common/config.js'
	import { UpdateUserinfo } from '@/common/api.js'
	import { mapState, mapActions } from 'vuex'
	import { getToken } from '@/common/common.js'
	
	export default {
		data() {
			return {
				valueStyle: {
					'overflow': 'hidden',
					'white-space': 'nowrap',
					'text-overflow': 'ellipsis'
				},
				uploadProgress: 0,
				loading: false,
				src: ''
			};
		},
		computed: {
			...mapState(['userinfo'])
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_chooseAvatar() {
				uni.chooseImage({
				    count: 1,
				    sizeType: ['original', 'compressed'],
				    sourceType: ['album', 'camera'],
				    success: (res) => {
						this.src = res.tempFilePaths[0]
						this._uploadAvatar()
				    }
				})
			},
			_uploadAvatar() {
				const uploadTask = uni.uploadFile({
					url: `${BASE_URL}updateInfo`,
					header: {
						token: getToken()
					},
					filePath: this.src,
					name: 'file',
					formData: {
						data: ''
					},
					success: (uploadFileRes) => {
						const { message, data } = JSON.parse(uploadFileRes.data)
						if (message.code === '200') {
							this.updateUserinfo()
						}
						uni.showToast({
							title: message.msg,
							icon: 'none'
						})
					},
					fail: (err) => {
						console.log('上传失败', err)
					},
					complete: () => {
						this.loading = false
					}
				})
				uploadTask.onProgressUpdate((res) => {
					this.uploadProgress = res.progress
				})
			},
			_setUsername() {
				uni.navigateTo({
					url: '/pages/my/user/username'
				})
			},
			_setSignature() {
				uni.navigateTo({
					url: '/pages/my/user/signature'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avatar-box__text {
		margin-top: 12rpx;
		font-size: 26rpx;
	}
	.avatar-box {
		padding: 92rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
