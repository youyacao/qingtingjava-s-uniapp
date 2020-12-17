<template>
	<view class="body">
		<u-field
			v-model="value"
			label-width="0"
			type="textarea"
			placeholder="请填入个性签名"
			@confirm="_submit"
		></u-field>
		<view class="btn-box">
			<u-button type="success" :loading="loading" @click="_submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import { BASE_URL } from '@/common/config.js'
	import { getToken } from '@/common/common.js'
	
	export default {
		data() {
			return {
				value: '',
				loading: false
			};
		},
		computed: {
			...mapState(['userinfo'])
		},
		mounted() {
			this.value = this.userinfo.sign
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_submit() {
				if (!this.value) {
					return this.$refs.uToast.show({
						title: '请填入个性签名',
						type: 'warning'
					})
				}
				this.loading = true
				const _formData = JSON.stringify({
					sign: this.value
				})
				uni.uploadFile({
					url: `${BASE_URL}updateInfo`,
					header: {
						token: getToken()
					},
					filePath: '',
					name: 'file',
					formData: {
						data: _formData
					},
					success: (uploadFileRes) => {
						const { message, data } = JSON.parse(uploadFileRes.data)
						if (message.code === '200') {
							this.updateUserinfo()
							uni.navigateBack()
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn-box {
		position: absolute;
		left: 32rpx;
		right: 32rpx;
		bottom: 32rpx;
	}
	.body {
		padding: 32rpx;
		height: 100vh;
	}
</style>
