export default {
  adventure: {
    scan: {
      url: '/adventure/scan',
      method: 'GET',
      data: {},
    },
    delete: {
      url: '/adventure/delete',
      method: 'POST',
      data: {},
    },
    read: {
      url: '/adventure/read',
      method: 'GET',
      data: {
        filePath: '',
      },
    },
    list: {
      url: '/adventure/list',
      method: 'GET',
      data: {
        page: '1',
        size: '10',
      },
    },
    adminList: {
      url: '/adventure/adminList',
      method: 'GET',
      data: {
        page: '1',
        size: '10',
      },
    },
    add: {
      url: '/adventure/add',
      method: 'POST',
      data: {},
    },
    up: {
      url: '/adventure/zan',
      method: 'POST',
      data: {},
    },
  },
  QQMusic: {
    setUserCookie: {
      url: '/QQMusic/setUserCookie',
      method: 'GET',
      data: {
        cookies: '',
      },
    },
    userDetail: {
      url: '/QQMusic/userDetail',
      method: 'GET',
      data: {
        qqNo: '1102977704',
      },
    },
    songlist: {
      url: '/QQMusic/songlist',
      method: 'GET',
      data: {
        id: '1812298100',
      },
    },
    songurl: {
      url: '/QQMusic/songurl',
      method: 'GET',
      data: {
        songmid: '1812298100',
      },
    },
  },
  tags: {
    list: {
      url: '/tags/list',
      method: 'GET',
      data: {},
    },
    add: {
      url: '/tags/add',
      method: 'POST',
      data: {},
    },
    delete: {
      url: '/tags/delete',
      method: 'POST',
      data: {},
    },
    edit: {
      url: '/tags/edit',
      method: 'POST',
      data: {},
    },
  },
  BingPic: {
    bingPic: {
      url: '/BingPic/bingPic',
      method: 'GET',
      data: {},
    },
  },
  picture: {
    upload: {
      url: '/picture/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {},
    },
    getPicPage: {
      url: '/picture/getPicPage',
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {},
    },
  },
  routes:{
    create:{
      url: '/routes/create',
      method: 'POST',
      data: {},
    },
    list:{
      url: '/routes/list',
      method: 'GET',
      data: {},
    },
    remove:{
      url: '/routes/remove',
      method: 'POST',
      data: {},
    },
    update:{
      url: '/routes/update',
      method: 'POST',
      data: {},
    }
  },
  ocr:{
    ocr:{
      url: '/ocr/ocr',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {},
    },
  },
}
