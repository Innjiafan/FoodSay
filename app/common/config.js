

module.exports = {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},

	api: {
		base1:'http://rap2api.taobao.org/app/mock/2009/GET/',
		base2:'http://rap2api.taobao.org/app/mock/2009/POST/',
		list:'api/list',
		comment:'api/comments',
		up:'api/vote',
		signup:'api/u/signup',
		verify:'api/u/verify'
	}
}
