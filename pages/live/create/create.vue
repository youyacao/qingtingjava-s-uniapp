<template>
	<view class="body">
		<view class="input-box">
			<u-input v-model="title" :type="type" :border="border" placeholder="请输入直播间标题" />
		</view>
		<u-upload ref="uUpload" :action="action" max-count="1" upload-text="直播间封面" width="300" height="300" :auto-upload="false" @on-success="_onSuccess" @on-change="_onChange" @on-error="_onError" :header="header" @on-choose-complete="_onChangeComplete"></u-upload>
		<view class="video-type__box">
			<text class="video-type__title">画质: </text>
			<u-radio-group v-model="value" @change="radioGroupChange">
				<u-radio 
					@change="radioChange" 
					v-for="(item, index) in list" :key="index" 
					:name="item.value"
					:disabled="item.disabled"
					shape="square"
				>
					{{ item.name }}
				</u-radio>
			</u-radio-group>
		</view>
		<u-alert-tips type="primary" :description="description"></u-alert-tips>
		<view class="btn-box">
			<u-button size="default" type="success" class="btn" @click="_submit" :loading="loading">确定</u-button>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import { BASE_URL } from '@/common/config.js'
	import { StartLive } from '@/common/api.js'
	import { getToken } from '@/common/common.js'
	import { mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				action: `${BASE_URL}upload`,
				border: true,
				type: 'text',
				title: '',
				url: '',
				header: {
					authorization: getToken()
				},
				loading: false,
				list: [
					{
						name: '标准',
						value: 0,
						disabled: false
					},
					{
						name: '高清',
						value: 1,
						disabled: false
					},
					{
						name: '超清',
						value: 2,
						disabled: true
					}
				],
				value: 0,
				description: '注：高清转码和超清转码需要额外转码资源包费用，消耗更多推流流量'
			};
		},
		methods: {
			...mapMutations(['setPusherMode']),
			_submit() {
				if (!this.title) {
					return this.$refs.uToast.show({
						title: '请输入直播间标题',
						type: 'warning',
						position: 'top'
					})
				}
				if (!this.url) {
					return this.$refs.uToast.show({
						title: '请上传直播间封面',
						type: 'warning',
						position: 'top'
					})
				}
				this.loading = true
				this.$refs.uUpload.upload()
			},
			_onSuccess(res) {
				const { code, data } = res
				if (code === 200) {
					StartLive({
						title: this.title,
						thumb: data.url,
						hd: this.value
					}).then(({ code, msg, data }) => {
						this.loading = false
						if (code === 200) {
							const { rtmp_push_url } = data
							this.$refs.uToast.show({
								title: msg,
								type: 'success',
								url: `/pages/live/pusher/pusher?url=${rtmp_push_url}`
							})
						} else {
							this.$refs.uToast.show({
								title: msg,
								type: 'error'
							})
						}
					})
				}
			},
			_onChange(res) {
				console.log(res)
			},
			_onError(res) {
				console.log(res)
				this.loading = false
			},
			_onChangeComplete(lists) {
				this.url = lists[0].url
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				this.setPusherMode(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.video-type__title {
		margin-right: 24rpx;
	}
	.video-type__box {
		padding: 24rpx 10rpx;
		display: flex;
		align-items: center;
	}
	.btn-box {
		margin-top: 64rpx;
		padding: 10rpx;
	}
	.input-box {
		padding: 10rpx;
		margin-bottom: 12rpx;
	}
	.body {
		padding: 22rpx;
	}
</style>
