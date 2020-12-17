<template>
	<view class="box" @touchmove="touchM" @touchstart="bgtouchS" @touchend="touchE">
		<view style="height: 20rpx;flex: 1;">
			<view class="slider-bg" :class="{'press-slider':start}" id="barBox" ref="barBg" :style="{backgroundColor:backgroundColor}">
				<view class="active-bg" :class="{'press-slider':start}" :style="{backgroundColor:activeColor,width:width+'px'}"></view>
			</view>
		</view>
		<view v-if="posVal>0" class="block-box" :class="{'press-block':start}" :style="{backgroundColor:blockColor,left:width+'px'}"
		 @touchstart.stop="touchS" @touchend="touchE" @tap="handleTapWeex"></view>
	</view>
</template>

<script>
	export default {
		props: {
			min: {
				type: Number,
				default: 0
			},
			max: {
				type: Number,
				default: 100
			},
			step: {
				type: Number,
				default: 1
			},
			value: {
				type: Number,
				default: 0
			},
			activeColor: {
				type: String,
				default: 'rgba(255,255,255,0.5)'
			},
			backgroundColor: {
				type: String,
				default: 'rgba(255,255,255,0.2)'
			},
			blockColor: {
				type: String,
				default: 'rgba(255,255,255,0.7)'
			},
			'is-start': {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				barWidth: 0,
				startTouch: null,
				startWidth: 0,
				posVal: 0, //进度条值
				start: false
			};
		},
		mounted() {
			this.posVal = this.value;
			this.start = this.isStart;
			//#ifndef APP-PLUS-NVUE
			var query = uni.createSelectorQuery().in(this);
			query.select("#barBox").boundingClientRect(data => {
				this.barWidth = data.width;
			}).exec();
			//#endif
			//#ifdef APP-PLUS-NVUE
			this.$nextTick(() => {
				const dom = weex.requireModule('dom');
				dom.getComponentRect(this.$refs.barBg, option => {
					this.barWidth = option.size.width;
				});
			})
			//#endif
		},
		computed: {
			width() {
				if (this.barWidth == 0 || this.max <= 0) return 0;
				return this.barWidth * this.posVal / this.max;
			}
		},
		watch: {
			value(val) {
				if (val < this.min) val = this.min;
				if (val > this.max) val = this.max;
				this.posVal = val;
			},
			posVal(val) {
				this.$emit('input', val);
			},
			isStart(val) {
				this.start = val
			}
		},
		methods: {
			bgtouchS(e) {
				console.log('========', e)
				this.touchS(e);
			},
			touchS(e) {
				this.startTouch = e.changedTouches[0];
				this.startWidth = this.width;
				this.start = true;
				this.$emit('changing', {
					value: this.posVal
				});

			},
			touchM(e) {
				console.log('>>>>>', e)
				var touch = e.changedTouches[0];
				if (this.startTouch && this.start) {

					var moveWidth = touch.pageX - this.startTouch.pageX;
					//console.log(touch.pageX+','+moveWidth);
					if (this.barWidth && this.max > 0) {
						var width = this.startWidth;
						width += moveWidth;
						if (width > this.barWidth) width = this.barWidth;
						if (width < 0) width = 0;
						///console.log(width);
						this.posVal = width * this.max / this.barWidth;
						if (this.posVal > this.max) {
							this.posVal = this.max;
						}
						this.$emit('changing', {
							value: this.posVal
						});
					}
				}
			},
			touchE(e) {
				this.start = false;
				this.$emit('change', {
					value: this.posVal
				});
			},
			handleTapWeex(e) {

			}
		}
	}
</script>

<style scoped>
	.box {
		height: 10px;
		align-items: center;
		flex-direction: row;
	}

	.slider-bg {
		position: absolute;
		left: 0px;
		right: 0px;
		bottom: 2rpx;
		height: 4rpx;
	}

	.active-bg {
		height: 4rpx;
		position: relative;
	}

	.block-box {
		width: 8rpx;
		height: 8rpx;
		border-radius: 8rpx;
		position: absolute;
		margin-left: 0rpx;
		bottom: 0px;
	}

	.press-slider {
		height: 8rpx;
	}

	.press-block {
		width: 12rpx;
		height: 12rpx;
		border-radius: 10rpx;
	}
</style>
