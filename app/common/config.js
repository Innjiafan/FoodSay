

module.exports = {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	qiniu:{
		upload:'http://upload.qiniup.com/'
	},
	api: {
		base1:'http://rap2api.taobao.org/app/mock/2009/GET/',
		base2:'http://rap2api.taobao.org/app/mock/2009/POST/',
		//base1:'http://localhost:1234/',
		base3:'http://10.43.168.39:1234/',
		//评论
		commentlist:'api/detail/commentslist',
		comment:'api/detail/comments',

		signup:'api/u/signup',
		verify:'api/u/verify',
		signature:'api/signature',
		update:'api/u/update',
		login:'api/u/login',
		regist:'api/u/regist',
		//视频
		up:'api/creations/vote',
		list:'api/creations/list',
		video:'api/creations/video',
		searchVideo:'api/creations/searchVideo',
		//文章
		articlelist:'api/article/list',
		addArticle:'api/article/addArticle'
	}
}
