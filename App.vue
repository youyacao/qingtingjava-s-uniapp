<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 保持屏幕常亮
			uni.setKeepScreenOn({
				keepScreenOn: true
			})
			const systemInfo = uni.getSystemInfoSync()
			this.$store.commit('setSystemInfo', systemInfo)
		},
		onShow: function() {
			console.log('App Show')
			// this.$store.commit('setAppHide', false)
		},
		onHide: function() {
			console.log('App Hide')
			// this.$store.commit('setAppHide', true)
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
