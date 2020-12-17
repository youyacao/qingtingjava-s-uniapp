<template>
	<view class="body">
		<view class="head">
			<image class="logo" src="/static/logo.png" mode=""></image>
		</view>
		<view class="form">
			<view class="form-body">
				<view class="form-item">
					<image class="form-item__icon" src="/static/images/account.png" mode=""></image>
					<input class="form-item__input" type="text" placeholder="手机号/邮箱" v-model="username" />
				</view>
				<view class="form-item">
					<image class="form-item__icon" src="/static/images/password.png" mode=""></image>
					<input class="form-item__input" type="password" placeholder="密码" v-model="password" />
				</view>
				<u-button shape="circle" type="success" @tap="_login" :loading="loading">登 录</u-button>
				<view class="form-item__other">
					<navigator url="" hover-class="none">忘记密码？</navigator>
					<navigator url="/pages/register/register" hover-class="none">立即注册</navigator>
				</view>
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
	import { Login } from '@/common/api.js'
	import { mapActions } from 'vuex'
	
	export default {
		data() {
			return {
				username: '',
				password: '',
				loading: false
			};
		},
		methods: {
			...mapActions(['updateUserinfo']),
			_login() {
				if (!this.username) {
					return uni.showToast({
						title: '请输入手机号或邮箱',
						icon: 'none'
					})
				}
				if (!this.password) {
					return uni.showToast({
						title: '请输入密码',
						icon: 'none'
					})
				}
				this.loading = true
				Login({
					username: this.username,
					password: this.password
				}).then(({ code, msg, data }) => {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
					this.loading = false
					if (code === 200) {
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
	.form-item__icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 12rpx;
	}
	.form-item__other {
		margin-top: 24rpx;
		font-size: 24rpx;
		color: $uni-text-color-grey;
		display: flex;
		justify-content: space-between;
		padding: 0 20rpx;
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
		.form-item__input {
			flex: 1;
			font-size: 28rpx;
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
