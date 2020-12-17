<template>
	<view class="body">
		<u-cell-group>
			<!-- <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item> -->
			<u-cell-item icon="level" title="当前版本" :value="`v ${version}`"></u-cell-item>
			<u-cell-item title="退出" @click="_logout"></u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	
	export default {
		data() {
			return {
				version: '1.0.0'
			};
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
				this.version = wgtinfo.version
			})
		},
		methods: {
			...mapMutations(['setPath']),
			_logout() {
				try {
				    uni.setStorageSync('TOKEN', null)
				} catch (e) {
				    // error
				}
				this.setPath('/pages/home/home')
				uni.reLaunch({
					url: '/pages/home/home'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
