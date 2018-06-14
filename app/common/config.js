

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
		//base3:'	http://rap2api.taobao.org/app/mock/2009/',
		//base2:'http://rap2api.taobao.org/app/mock/2009/POST/',
		//base3:'http://localhost:1234/',
		base3:'http://192.168.43.61:1234/',
		//评论
		commentlist:'api/detail/commentslist',
		comment:'api/detail/comments',

		signup:'api/u/signup',
		verify:'api/u/verify',
		signature:'api/signature',
		update:'api/u/update',
		login:'api/u/login',
		regist:'api/u/regist',
		info:'api/u/info',
		//视频
		up:'api/creations/vote',
		list:'api/creations/list',
		video:'api/creations/video',
		searchVideo:'api/creations/searchVideo',
		//文章
		articlelist:'api/article/list',
		addArticle:'api/article/addArticle',
		searchArticle:'api/article/searchArticle'
	}
}
