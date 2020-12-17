export default {
	windowHeight: (state) => {
		return state.systemInfo.windowHeight || 0
	},
	windowWidth: (state) => {
		return state.systemInfo.windowWidth || 0
	},
	statusBarHeight: (state) => {
		return state.systemInfo.statusBarHeight || 0
	},
	platform: (state) => {
		return state.systemInfo.platform
	},
	screenWidth: (state) => {
		return state.systemInfo.screenWidth || 0
	}
}