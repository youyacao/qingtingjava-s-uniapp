<template>
	<view class="body">
		<view class="head">
			<image class="logo" src="/static/logo.png" mode=""></image>
		</view>
		<view class="form">
			<view class="form-body">
				<view class="form-item" style="padding: 0;">
					<u-field
						class="flex-1"
						v-model="mobile"
						icon="phone"
						label-width="0"
						placeholder="请填写手机号"
					>
					</u-field>
				</view>
				<view class="form-item" style="padding: 0;">
					<u-field
						class="flex-1"
						v-model="code"
						label-width="0"
						placeholder="请填写验证码"
					>
						<u-button size="mini" slot="right" type="success" @tap="_getCode">{{ countdown === 60 ? codeText : `${countdown}s` }}</u-button>
					</u-field>
				</view>
				<u-button shape="circle" type="success" @tap="_login" :loading="loading">一键登录</u-button>
			</view>
		</view>
		<view class="login-other__contaimer">
			<view class="login-other__title">
				<view class="login-other__line"></view>
				<view class="px-24">其他登录方式</view>
				<view class="login-other__line"></view>
			</view>
			<view class="login-other">
				<image class="login-icon" src="/static/images/QQ.png" mode=""></image>
				<image class="login-icon" src="/static/images/weixin.png" mode=""></image>
				<image class="login-icon" src="/static/images/weibo.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	import { Login, GetSMSCaptcha } from '@/common/api.js'
	import { mapActions } from 'vuex'
	
	export default {
		data() {
			return {
				loading: false,
				codeText: '发送验证码',
				code: '',
				mobile: '',
				timer: null,
				countdown: 60
			};
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_getCode() {
				if (this.countdown !== 60) return
				if (!this.mobile) {
					return uni.showToast({
						title: '请填写手机号',
						icon: 'none'
					})
				}
				if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
					return uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none'
					})
				}
				GetSMSCaptcha(this.mobile).then(({ message, data }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						clearInterval(this.timer)
						this.timer = setInterval(() => {
							this.countdown--
							if (this.countdown <= 0) {
								clearInterval(this.timer)
								this.countdown = 60
								this.codeText = '重新发送验证码'
							}
						}, 1000)
					}
				})
			},
			_login() {
				if (!this.code) {
					return uni.showToast({
						title: '请填写验证码',
						icon: 'none'
					})
				}
				this.loading = true
				Login({
					account: this.mobile,
					code: this.code
				}).then(({ message, data }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					this.loading = false
					if (message.code === '200') {
						const { token } = data
						try {
						    uni.setStorageSync('TOKEN', token)
						} catch (e) {
						    // error
						}
						this.updateUserinfo()
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex-1 {
		flex: 1;
	}
	.px-24 {
		padding: 0 24rpx;
	}
	.head {
		background-color: #08d9d6;
		height: 300rpx;
		display: flex;
		justify-content: center;
		.logo {
			width: 200rpx;
			height: 200rpx;
		}
	}
	.form {
		padding: 32rpx 64rpx;
		margin-top: -96rpx;
		.form-body {
			padding: 72rpx 32rpx;
			box-shadow: 0 0 24rpx rgba($color: #000000, $alpha: 0.2);
			border-radius: 16rpx;
			background-color: #FFFFFF;
		}
		.form-item {
			height: 80rpx;
			border-radius: 40rpx;
			box-shadow: 0 0 24rpx rgba($color: #000000, $alpha: 0.2);
			display: flex;
			align-items: center;
			padding: 0 24rpx;
			margin-bottom: 48rpx;
		}
	}
	.login-other {
		display: flex;
		justify-content: space-around;
	}
	.login-other__contaimer {
		position: absolute;
		bottom: 32rpx;
		left: 64rpx;
		right: 64rpx;
		padding: 0 64rpx;
	}
	.login-icon {
		width: 70rpx;
		height: 70rpx;
	}
	.login-other__title {
		margin-bottom: 32rpx;
		font-size: 28rpx;
		color: $uni-text-color-grey;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.login-other__line {
		height: 1rpx;
		width: 60rpx;
		background-color: #999;
	}
</style>
