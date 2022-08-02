export default {
	'adventure': {
		'scan': {
			url: '/adventure/scan',
			method: 'GET',
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
	}
}