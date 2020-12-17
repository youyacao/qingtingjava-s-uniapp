<template>
	<view class="body" :style="{'height': `${windowHeight}px`}">
		<list class="list" :pagingEnabled="true" :show-scrollbar="false" :scrollable="scrollable" :bounce="false" @scroll="onScroll">
			<cell class="cell" v-for="(item, index) in videoList" :key="`cell_${index}`" :style="{'width': `${windowWidth}px`, 'height': `${windowHeight}px`}">
				<v-video 
					v-if="index > (playIndex - 3) && (playIndex + 3) > index"
					:src="item.video_url" :video="item" :index="index" :current="playIndex" :ref="`video_${index}`"
					@play="onPlay" :style="{'height': `${windowHeight}px`, 'width': `${windowWidth}px`}"></v-video>
				<view class="bottom">
					<view class="bottom-author">
						<text class="bottom-author__text">@{{ item.users.nickname }}</text>
					</view>
					<view class="buttom-title">
						<text class="bottom-title__text">{{ item.title }}</text>
					</view>
				</view>
				<view class="right">
					<view class="avatar-box">
						<!-- 头像 -->
						<view class="avatar-container">
							<image class="avatar" :src="item.users.avatar" mode="aspectFit"></image>
						</view>
						<!-- 是否关注 -->
						<view class="add-container" v-if="item.isFocus === 'false'">
							<view class="add-box" @tap="_focusOn(item)">
								<image class="add-icon" src="/static/images/add-c.png" mode=""></image>
							</view>
						</view>
					</view>
					<!-- 点赞 -->
					<view class="mb-32 icon-box">
						<image class="like-icon" src="/static/images/like-red.png" mode="" @tap="_cancelPraise(item)" v-if="item.isLike === 'true'"></image>
						<image class="like-icon" src="/static/images/like-white.png" mode="" @tap="_praise(item)" v-else></image>
						<text class="right-text">{{ item.likeNum.length > 4 ? item.likeNumStr : item.likeNum }}</text>
					</view>
					<!-- 评论 -->
					<view class="mb-32 icon-box" @tap="_openCommentPopup(item)">
						<image class="comment-icon" src="/static/images/comment.png" mode=""></image>
						<text class="right-text">{{ item.commentNum.length > 4 ? item.commentNumStr : item.commentNum }}</text>
					</view>
					<!-- 分享 -->
					<view class="icon-box">
						<image class="share-icon" src="/static/images/share.png" mode=""></image>
						<text class="right-text">{{ item.shareNumStr }}</text>
					</view>
				</view>
			</cell>
		</list>
		<uni-popup ref="popup" type="bottom" @change="_commentPopupChange">
			<view class="comment-box" :style="{'height': `${windowHeight * 0.7}px`}">
				<view class="comment-head">
					<text class="comment-head__text">{{ video.commentNum.length > 4 ? video.commentNumStr : video.commentNum }} 条评论</text>
					<image class="comment-head__icon" src="/static/images/close.png" mode="" @tap="$refs.popup.close()"></image>
				</view>
				<view class="list-box">
					<list @loadmore="loadmore">
						<cell v-for="(item, index) in commentList" :key="`comment_${index}`">
							<view class="comment-item">
								<image class="comment-item__avatar" :src="item.users.avatar" mode="" @tap="_setComment(item)"></image>
								<view class="comment-item__right">
									<view class="comment-item__head">
										<view class="comment-item__left" @tap="_setComment(item)">
											<text class="comment-item__username">{{ item.users.username }}</text>
											<view class="comment-content">
												<text class="comment-content__text">{{ item.content }}</text>
											</view>
										</view>
										<view class="comment-like">
											<image class="comment-like__icon" src="/static/images/like-red.png" mode="" @tap="_cancelCommentPraise(item)" v-if="item.isLike === 'true'"></image>
											<image class="comment-like__icon" src="/static/images/like-grey.png" mode="" @tap="_commentPraise(item)" v-else></image>
											<text class="comment-like__text">{{ item.likeNum.length > 4 ? item.likeNumStr : item.likeNum }}</text>
										</view>
									</view>
									<view class="comment-foot">
										<text class="comment-item__time" v-if="item.time">{{ item.time }}</text>
										<text class="comment-reply__text">{{ item.commentCount }} 条回复</text>
									</view>
								</view>
							</view>
						</cell>
						<cell v-if="!loading">
							<text class="comment-tip__text">正在加载...</text>
						</cell>
						<cell v-if="noData && commentList.length === 0">
							<text class="comment-tip__text">暂无评论，来抢沙发</text>
						</cell>
						<cell v-if="commentList.length > 10 && noData">
							<text class="comment-tip__text">暂时没有更多了</text>
						</cell>
					</list>
				</view>
				<view class="comment-input__box">
					<input class="comment-input" v-model="comment" type="text" placeholder="有爱评论,说点好听的～" :adjust-position="false" @confirm="_commentSubmit" />
					<image class="comment-btn__icon" src="/static/images/send.png" mode="" @tap="_commentSubmit"></image>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import VVideo from '@/components/v-video/v-video'
	import { LatestVideos, VideoLikes, CancelVideoLikes, Follow, PostComment, CommentList, CommentLikes, CancelCommentLikes } from '@/common/api.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	
	export default {
		data() {
			return {
				scrollable: true,
				init: false,
				playIndex: 0,
				videoList: [],
				videoContext: null,
				videoRef: null,
				page: 1,
				show: false,
				video: {
					commentNum: 0
				},
				comment: '',
				commentList: [],
				loading: false,
				noData: false,
				commentPage: 1
			};
		},
		components: {
			uniPopup
		},
		computed: {
			...mapGetters(['windowHeight', 'windowWidth', 'platform']),
			bodyHeight() {
				if (this.platform === 'android') {
					return this.windowHeight - 50
				} else {
					return this.windowHeight
				}
			}
		},
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		components: { VVideo },
		methods: {
			_setComment(item) {
				uni.navigateTo({
					url: `/pages/comment/comment?item=${JSON.stringify({...item, vid: this.video.id})}`
				})
			},
			// 取消评论点赞
			_cancelCommentPraise(item) {
				CancelCommentLikes(item.id).then(({ message }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						item.isLike = 'false'
						item.likeNum--
					}
				})
			},
			// 评论点赞
			_commentPraise(item) {
				CommentLikes(item.id).then(({ message }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						item.isLike = 'true'
						item.likeNum++
					}
				})
			},
			loadmore() {
				console.log('加载更多评论')
				if (this.noData) return
				this.commentPage++
				this._getCommentList(this.video.id)
			},
			// 评论提交
			_commentSubmit() {
				PostComment({
					type: 1,
					vid: this.video.id,
					content: this.comment
				}).then(({ message }) => {
					uni.hideKeyboard()
					if (message.code === '200') {
						this.comment = ''
						this.video.commentNum++
						this.commentPage = 1
						this._getCommentList(this.video.id)
					}
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
				})
			},
			_openCommentPopup(video) {
				this.commentPage = 1
				this.commentList = []
				this.loading = false
				this.noData = false
				this._getCommentList(video.id)
				this.video = video
				this.$refs.popup.open()
			},
			// 视频评论列表
			_getCommentList(vid) {
				this.noData = false
				CommentList({
					type: 1,
					vid,
					page: this.commentPage,
					limit: 10
				}).then(({ message, data }) => {
					if (message.code === '200') {
						const { totalPage, page, list } = data
						if (page === '1') {
							this.commentList = list
						} else {
							this.commentList = this.commentList.concat(list)
						}
						if (totalPage === 0 || Number(page) >= (totalPage + 1)) {
							this.noData = true
						}
						this.loading = true
					}
				})
			},
			_commentPopupChange({ show }) {},
			// 关注
			_focusOn(item) {
				Follow(item.users.id).then(({ message }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						this.videoList.map(item => {
							if (item.users.id === item.users.id) {
								item.isFocus = 'true'
							}
						})
					}
				})
			},
			// 视频点赞
			_praise(item) {
				VideoLikes({
					vid: item.id,
					type: 1
				}).then(({ message }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						item.isLike = 'true'
						item.likeNum++
					}
				})
			},
			// 取消视频点赞
			_cancelPraise(item) {
				CancelVideoLikes({
					vid: item.id,
					type: 1
				}).then(({ message }) => {
					uni.showToast({
						title: message.msg,
						icon: 'none'
					})
					if (message.code === '200') {
						item.isLike = 'false'
						item.likeNum--
					}
				})
			},
			onScroll(event) {
				const index = parseInt(Math.abs(event.contentOffset.y / this.bodyHeight))
				const intIndex = parseInt(Math.abs(event.contentOffset.y / this.bodyHeight))
				if (index === intIndex && index !== this.playIndex) {
					this.playIndex = intIndex
					if (this.videoContext) {
						this.videoContext.stop()
					}
					if (this.videoRef) {
						this.videoRef._isPuase()
					}
					this.videoRef = this.$refs[`video_${this.playIndex}`][0]
					this.videoRef.play()
					if ((this.videoList.length - 6) === this.playIndex) {
						this.getVideoList()
					}
				}
			},
			onPlay(event) {
				this.videoRef = this.$refs[`video_${this.playIndex}`][0]
				this.videoContext = event
			},
			getVideoList() {
				this.page++
				LatestVideos({
					page: this.page,
					limit: 10
				}).then(({ message, data }) => {
					if (message.code === '200') {
						this.videoList = this.videoList.concat(data.video)
					}
				})
			}
		},
		watch: {
			list(val) {
				this.videoList = val
				this.init = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon-box {
		align-items: center;
	}
	.comment-tip__text {
		text-align: center;
		color: #808080;
		font-size: 24rpx;
		margin-bottom: 32rpx;
	}
	.comment-foot {
		flex-direction: row;
		align-items: center;
		margin-top: 12rpx;
	}
	.comment-item__time {
		font-size: 24rpx;
		color: #808080;
		margin-right: 12rpx;
	}
	.comment-reply__text {
		font-size: 24rpx;
		color: #808080;
	}
	.comment-like {
		align-items: center;
	}
	.comment-content {
		flex: 1;
		overflow: hidden;
	}
	.comment-item__left {
		flex: 1;
		margin-right: 32rpx;
	}
	.comment-content__text {
		font-size: 32rpx;
		line-height: 48rpx;
		color: #FFFFFF;
		margin-top: 12rpx;
		width: 486rpx;
	}
	.comment-item__head {
		flex-direction: row;
		justify-content: space-between;
	}
	.comment-like__text {
		font-size: 24rpx;
		color: #808080;
		margin-top: 6rpx;
		text-align: center;
	}
	.comment-like__icon {
		width: 35rpx;
		height: 35rpx;
	}
	.comment-item__username {
		font-size: 28rpx;
		color: #808080;
	}
	.comment-item__right {
		flex: 1;
	}
	.comment-item {
		margin: 0 24rpx 32rpx;
		flex-direction: row;
	}
	.comment-item__avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50rpx;
		margin-right: 24rpx;
	}
	.comment-btn__icon {
		width: 40rpx;
		height: 40rpx;
		margin-left: 24rpx;
	}
	.comment-input {
		color: #FFFFFF;
		font-size: 28rpx;
		flex: 1;
	}
	.comment-input__box {
		height: 80rpx;
		background-color: #383A3F;
		align-items: center;
		padding: 0 32rpx;
		flex-direction: row;
	}
	.list-box {
		flex: 1;
	}
	.comment-head__icon {
		position: absolute;
		right: 24rpx;
		width: 30rpx;
		height: 30rpx;
	}
	.comment-head__text {
		text-align: center;
		color: #FFFFFF;
		font-size: 28rpx;
	}
	.comment-head {
		height: 80rpx;
		justify-content: center;
	}
	.comment-box {
		background-color: #1F2124;
	}
	.avatar-container {
		border-width: 1rpx;
		border-color: #FFFFFF;
		width: 86rpx;
		height: 86rpx;
		border-radius: 50%;
	}
	.add-container {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		align-items: center;
	}
	.add-icon {
		width: 35rpx;
		height: 35rpx;
	}
	.add-box {
		background-color: #FFFFFF;
		border-radius: 50%;
	}
	.right-text {
		color: #FFFFFF;
		font-size: 28rpx;
		text-align: center;
	}
	.avatar-box {
		width: 86rpx;
		height: 103.5rpx;
		margin-bottom: 42rpx;
		position: relative;
	}
	.mb-32 {
		margin-bottom: 32rpx;
	}
	.share-icon {
		width: 55rpx;
		height: 55rpx;
		opacity: 0.9;
		margin-bottom: 12rpx;
	}
	.comment-icon {
		width: 55rpx;
		height: 55rpx;
		opacity: 0.9;
		margin-bottom: 12rpx;
	}
	.like-icon {
		width: 55rpx;
		height: 55rpx;
		opacity: 0.9;
		margin-bottom: 12rpx;
	}
	.right {
		position: absolute;
		right: 0;
		bottom: 0;
		flex-direction: column;
		align-items: center;
		padding: 32rpx 32rpx 300rpx;
	}
	.avatar {
		width: 85rpx;
		height: 85rpx;
		border-radius: 50%;
	}
	.bottom-author {
		margin-bottom: 12rpx;
	}
	.bottom-title__text {
		font-size: 28rpx;
		line-height: 22px;
		color: #FFFFFF;
		lines: 2;
		text-overflow: ellipsis;
	}
	.bottom-author__text {
		color: #FFFFFF;
		font-size: 32rpx;
	}
	.bottom {
		position: absolute;
		right: 150rpx;
		bottom: 60px;
		left: 0;
		padding: 12rpx 24rpx;
	}
	.cell {
		position: relative;
	}
	.list {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	.body {
		background-color: #000000;
	}
</style>
