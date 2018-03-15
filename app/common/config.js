

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
		base3:'http://10.43.169.82:1234/',
		list:'api/creations/list',
		comment1:'api/detail/comments',
		comment:'api/detail/comments',
		up:'api/creations/vote',
		signup:'api/u/signup',
		verify:'api/u/verify',
		signature:'api/signature',
		update:'api/u/update',
		login:'api/u/login',
		regist:'api/u/regist',
		video:'api/creations/video',
		userDetail:'api/creations/userDetail'
	}
}
