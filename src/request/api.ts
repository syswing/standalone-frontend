export default {
	'adventure': {
		'scan': {
			url: '/adventure/scan',
			method: 'GET',
			data:{}
		},
		'read':{
			url: '/adventure/read',
			method: 'GET',
			data:{
				filePath:''
			}
		},
		'list':{
			url: '/adventure/list',
			method: 'GET',
			data:{
				page:'1',
				size:'10'
			}
		},
		'up':{
			url:'/adventure/zan',
			method: 'POST',
			data:{}
		}
	},
	'QQMusic': {
		'setUserCookie': {
			url: "/QQMusic/setUserCookie",
			method: 'GET',
			data: {
				cookies: ''
			}
		},
		'userDetail': {
			url: "/QQMusic/userDetail",
			method: 'GET',
			data: {
				qqNo: "1102977704"
			}
		},
		'songlist': {
			url: '/QQMusic/songlist',
			method: 'GET',
			data: {
				id: "1812298100"
			}
		},
		'songurl': {
			url: '/QQMusic/songurl',
			method: 'GET',
			data: {
				songmid: "1812298100"
			}
		}
	},
	'tags':{
		'list':{
			url: '/tags/list',
			method: 'GET',
			data:{}
		}
	},
	'BingPic':{
		'bingPic':{
			url: '/BingPic/bingPic',
			method: 'GET',
			data:{}
		}
	}
}