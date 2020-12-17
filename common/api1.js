import { get, post } from './request'

// 推荐视频
export const VideoList = () => {
	return post('video/referList')
}

// 视频列表
export const VList = (data) => {
	return post('video/list', data)
}

// 点赞
export const Praise = (data) => {
	return post('like/on', data)
}

// 取消点赞
export const CancelPraise = (data) => {
	return post('like/off', data)
}

// 短信验证码
export const SMS = (data) => {
	return post('smsGet', data)
}

// 注册
export const Register = (data) => {
	return post('register', data)
}

// 邮箱验证码
export const EmailCaptcha = (data) => {
	return post('emailGet', data)
}

// 图形验证码
export const Captcha = () => {
	return post('captchaGet')
}

// 登录
export const Login = (data) => {
	return post('login', data)
}

// 用户信息
export const User = () => {
	return post('user')
}

// 视频播放
export const VideoPlayback = (data) => {
	return post('video/view', data)
}

// 直播列表
export const LiveList = (data) => {
	return post('live/list', data)
}

// 开始直播
export const StartLive = (data) => {
	return post('live/start', data)
}

// 停止直播
export const StopLive = () => {
	return post('live/close')
}

// 直播详情
export const LiveDetails = (data) => {
	return post('live/view', data)
}

// 直播历史
export const LiveHistory = (data) => {
	return post('live/history', data)
}

// 关注用户
export const FocusOn = (data) => {
	return post('follow/on', data)
}

// 分类
export const Categories = (data) => {
	return post('category', data)
}

// 发布视频
export const ReleaseVideo = (data) => {
	return post('video/add', data)
}

// 退出
export const Logout = () => {
	return post('logout')
}

// 图文列表
export const ArticleList = (data) => {
	return post('article/list', data)
}

// 关注用户图文列表
export const FocusArticleList = (data) => {
	return post('article/followList', data)
}

// 发布图文
export const PostArticle = (data) => {
	return post('article/add', data)
}

// 评论列表
export const CommentList = (data) => {
	return post('comment/list', data)
}

// 评论
export const Comment = (data) => {
	return post('comment/add', data)
}

// 评论点赞
export const CommentPraise = (data) => {
	return post('comment/onLike', data)
}

// 取消评论点赞
export const CancelCommentPraise = (data) => {
	return post('comment/offLike', data)
}

// 上传图片
export const UploadImage = () => {
	return post('upload')
}