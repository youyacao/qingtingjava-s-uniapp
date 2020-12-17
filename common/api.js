import { get, post } from './request'

// 最新视频
export const LatestVideos = (data) => {
	return post('newestVideo', data)
}

// 随机视频
export const RandomVideos = (data) => {
	return post('videoInfoRandom', data)
}

// 视频点赞
export const VideoLikes = (data) => {
	return post('onLike', data)
}

// 取消视频点赞
export const CancelVideoLikes = (data) => {
	return post('offLike', data)
}

// 视频评论列表
export const CommentList = (data) => {
	return post('commentList', data)
}

// 视频评论点赞
export const CommentLikes = (id) => {
	return post('likeComment', { id })
}

// 取消视频评论点赞
export const CancelCommentLikes = (id) => {
	return post('likeOffComment', { id })
}

// 添加视频评论
export const PostComment = (data) => {
	return post('addComment', data)
}

// 用户信息
export const Userinfo = () => {
	return post('userInfo')
}

// 分类
export const Categories = () => {
	return post('category')
}

// 获取短信验证码
export const GetSMSCaptcha = (phone) => {
	return post('getCode', { phone })
}

// 登录注册
export const Login = (data) => {
	return post('LRUsers', data)
}

// 更新用户信息
export const UpdateUserinfo = (data) => {
	return post('updateInfo', data)
}

// 获取评论的评论
export const ReplyList = (data) => {
	return post('childComment', data)
}

// 关注
export const Follow = (userId) => {
	return post('addFollow', { userId })
}