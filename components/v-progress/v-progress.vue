<template>
	<view class="body">
		<view class="bg">
			<view class="bar" :style="{'width': processBarWidth || 0}"></view>
			<view class="bar-round"></view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {};
		},
		props: {
			detail: {
				type: Object,
				default: null
			}
		},
		computed: {
			...mapGetters(['screenWidth']),
			processBarWidth() {
				return this.detail.currentTime / this.detail.duration * this.screenWidth
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bar {
		height: 4rpx;
		background-color: rgba(255, 255, 255, 0.4);
	}
	.bar-round {
		width: 8rpx;
		height: 8rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.6);
	}
	.bg {
		height: 4rpx;
		background-color: rgba(255, 255, 255, 0.2);
		flex-direction: row;
		align-items: center;
	}

	.body {
		// height: 20rpx;
	}
</style>
