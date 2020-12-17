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
					<view class="form-item__left">
						<image class="form-item__icon" src="/static/images/captch.png" mode=""></image>
						<input class="form-item__input" type="number" placeholder="验证码" v-model="captcha" />
					</view>
					<view class="captch-btn" @tap="_sendCaptcha">{{ countdown === 60 ? '发送验证码' : `${countdown}s`}}</view>
				</view>
				<view class="form-item">
					<image class="form-item__icon" src="/static/images/password.png" mode=""></image>
					<input class="form-item__input" type="password" placeholder="密码" v-model="password" />
				</view>
				<view class="form-item">
					<image class="form-item__icon" src="/static/images/invete.png" mode=""></image>
					<input class="form-item__input" type="text" placeholder="邀请码" v-model="invitationCode" />
				</view>
				<view class="form-item__btn" @tap="_submit">注册</view>
				<view class="form-item__other">
					<navigator url="" hover-class="none" open-type="navigateBack">已有账号？立即登录</navigator>
				</view>
			</view>
		</view>
		<view class="protocols">
			<checkbox value="accept" checked="true" style="transform:scale(0.7);" />
			<view class="protocols-text">已阅读并同意<navigator class="protocols-text__navigator" url="/pages/register/agreement/agreement" hover-class="none">《用户协议》</navigator></view>
		</view>
		<u-popup v-model="show" mode="center">
			<view class="popup">
				<image class="popup-img" :src="captchaData.img" mode="aspectFill" @tap="_getCaptcha"></image>
				<input class="popup-input" type="text" placeholder="请输入图形验证码" v-model="graphicCaptcha" />
				<view class="change-one" @tap="_getCaptcha">换一张？</view>
				<view class="popup-foot">
					<view class="popup-btn popup-cancel__btn" @tap="_popupCancel">
						<text>取 消</text>
					</view>
					<view class="popup-btn popup-confirm__btn" @tap="_confirmSend">
						<text>确 定</text>
					</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { SMS, EmailCaptcha, Register, Captcha } from '@/common/api.js'
	
	export default {
		data() {
			return {
				username: '',
				timer: null,
				countdown: 60,
				captchaData: {
					img: ''
				},
				graphicCaptcha: '',
				emailReg: /^([a-z0-9]+[_|\_|\.]?)*[a-z0-9]+@([a-z0-9]+[_|\_|\.]?)*[a-z0-9]+\.[a-z]{2,3}$/,
				phoneReg: /^1[3456789]\d{9}$/,
				show: false,
				captcha: '',
				password: '',
				invitationCode: '',
				type: 1
			};
		},
		methods: {
			_submit() {
				if (!this.captcha) {
					return this.$refs.uToast.show({
						title: '请输入验证码',
						type: 'warning'
					})
				}
				if (!this.password) {
					return this.$refs.uToast.show({
						title: '请输入密码',
						type: 'warning'
					})
				}
				Register({
					username: this.username,
					phone: this.type === 1 ? this.username : '',
					email: this.type === 0 ? this.username : '',
					code: this.captcha,
					password: this.password,
					refcode: this.invitationCode
				}).then(({ code, msg }) => {
					if (code === 200) {
						this.$refs.uToast.show({
							title: msg,
							type: 'success'
						})
						uni.navigateBack()
					} else {
						this.$refs.uToast.show({
							title: msg,
							type: 'error'
						})
					}
				})
			},
			_sendCaptcha() {
				if (this.countdown !== 60) return
				const username = this.username.replace(/\s*/g, '')
				if (username.length === 0) {
					return uni.showToast({
						title: '请输入手机号或邮箱',
						icon: 'none'
					})
				}
				if (!(this.phoneReg.test(username)) && !(this.emailReg.test(username))) {
					return uni.showToast({
						title: '请输入正确的手机号或邮箱',
						icon: 'none'
					})
				}
				Captcha().then(({ code, data }) => {
					if (code === 200) {
						this.captchaData = data
						this.show = true
					}
				})
			},
			_getCaptcha() {
				Captcha().then(({ code, data }) => {
					if (code === 200) {
						this.captchaData = data
					}
				})
			},
			_confirmSend() {
				const username = this.username
				if (this.graphicCaptcha) {
					if (this.phoneReg.test(username)) {
						this.type = 1
						uni.showLoading({
						    title: '发送中...'
						})
						SMS({
							phone: username,
							no_captcha: 1,
							captcha: this.graphicCaptcha,
							ckey: this.captchaData.key
						}).then(({ code, msg }) => {
							uni.hideLoading()
							uni.showToast({
								title: msg,
								icon: 'none'
							})
							if (code === 200) {
								this.show = false
								this.graphicCaptcha = ''
								this._countdown()
							}
						})
					}
					if (this.emailReg.test(username)) {
						this.type = 0
						uni.showLoading({
						    title: '发送中...'
						})
						EmailCaptcha({
							email: username,
							no_captcha: 1,
							captcha: this.graphicCaptcha,
							ckey: this.captchaData.key
						}).then(({ code, msg }) => {
							uni.hideLoading()
							uni.showToast({
								title: msg,
								icon: 'none'
							})
							if (code === 200) {
								this.show = false
								this.graphicCaptcha = ''
								this._countdown()
							}
						})
					}
				} else {
					uni.showToast({
						title: '请输入图形验证码',
						icon: 'none'
					})
				}
			},
			_countdown() {
				clearInterval(this.timer)
				this.timer = setInterval(() => {
					this.countdown--
					if (this.countdown <= 0) {
						clearInterval(this.timer)
						this.countdown = 60
					}
				}, 1000)
			},
			_popupCancel() {
				this.show = false
				this.graphicCaptcha = ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.change-one {
		padding: 24rpx;
		font-size: 28rpx;
		color: #808080;
	}
	.popup-cancel__btn {
		background-color: $uni-bg-color-grey;
		color: $uni-text-color;
	}
	.popup-confirm__btn {
		background-color: #08d9d6;
		color: #FFFFFF;
		margin-left: 24rpx;
	}
	.popup-btn {
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		padding: 0 32rpx;
		font-size: 28rpx;
		border-radius: 6rpx;
	}
	.popup-foot {
		padding: 24rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-end;
	}
	.popup-input {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 24rpx;
		border-bottom: 1px solid #f8f8f8;
	}
	.popup {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		overflow: hidden;
	}
	.popup-img {
		width: 480rpx;
		height: 144rpx;
	}
	.captch-btn {
		font-size: 24rpx;
		background-color: #08d9d6;
		height: 50rpx;
		border-radius: 25rpx;
		width: 170rpx;
		color: #FFFFFF;
		line-height: 50rpx;
		text-align: center;
	}
	.form-item__left {
		display: flex;
		align-items: center;
		flex: 1;
	}
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
		justify-content: flex-end;
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
		.form-item__btn {
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
			text-align: center;
			background-color: #08d9d6;
			box-shadow: 6rpx 6rpx 12rpx rgba($color: #08d9d6, $alpha: 0.4);
			color: #FFFFFF;
			font-size: 32rpx;
		}
	}
	.protocols {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
	}
	.protocols-text {
		display: flex;
		align-items: center;
	}
	.protocols-text__navigator {
		color: #08d9d6;
	}
</style>
