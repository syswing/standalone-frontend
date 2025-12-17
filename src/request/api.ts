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
    update: {
      url: '/adventure/update',
      method: 'POST',
      data: {},
    },
    publish: {
      url: '/adventure/publish',
      method: 'GET',
      data: {},
    },
    unpublish: {
      url: '/adventure/unpublish',
      method: 'GET',
      data: {},
    },
    visitMd: {
      url: '/adventure/visitMd',
      method: 'GET',
      data: {}
    }
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
    update:{
      url: '/picture/update',
      method: 'POST',
      data: {},
    },
    deletePic:{
      url: '/picture/deletePic',
      method: 'GET',
      data: {},
    }
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
    },
    delete:{
      url: '/routes/delete',
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
  comment:{
    list:{
      url: '/comment/list',
      method: 'GET',
      data: {
        page: '1',
        size: '100',
      },
    },
    save:{
      url: '/comment/save',
      method: 'POST',
      data: {},
    },
    delete:{
      url: '/comment/delete',
      method: 'POST',
      data: {},
    }
  },
  user:{
    login:{
      url: '/user/admin_login',
      method: 'POST',
      data: {},
    },
  },
  dst:{
    getAllCacheRegionLobbies:{
      url: '/dst/getAllCacheRegionLobbies',
      method: 'GET',
      data: {},
    },
  }
}
