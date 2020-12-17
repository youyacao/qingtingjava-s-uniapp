import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import { Userinfo } from '@/common/api.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	getters,
	state: {
		systemInfo: null,
		appHide: false,
		userinfo: {
			avatar: '',
			username: '',
			nickname: '',
			desc: '',
			is_vip: 0,
			myFansCount: '0',
			myFollowCount: '0',
			myLikeCount: '0',
			sign: '这个人很懒，什么也没有留下'
		},
		path: '/pages/home/home',
		pusherMode: 0
	},
	mutations: {
		setSystemInfo(state, data) {
			state.systemInfo = data
		},
		setAppHide(state, data) {
			state.appHide = data
		},
		setUserinfo(state, data) {
			state.userinfo = {...state.userinfo, ...data}
			uni.setStorage({
			    key: 'userinfo',
			    data: state.userinfo,
			    success: () => {
			        console.log('用户信息保存成功', state.userinfo)
			    }
			})
		},
		setPath(state, path) {
			state.path = path
		},
		setPusherMode(state, data) {
			state.pusherMode = data
		}
	},
	actions: {
		updateUserinfo({ commit }) {
			Userinfo().then(({ message, data }) => {
				if (message.code === '200') {
					commit('setUserinfo', data)
				}
			})
		}
	}
})

export default store