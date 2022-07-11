import Axios from 'axios'

interface AxiosConfig {
  timeout: number
  headers: {
    'Content-Type': string;
    'X-Requested-With':string;
  }
  baseURL: string;
  withCredentials:boolean;
  // validateStatus:any;
}
console.log('当前env',process.env.REACT_APP_URL_ENV)
const config: AxiosConfig = {
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With':'XMLHttpRequest',
    
  },
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : process.env.REACT_APP_URL_ENV as string,
  withCredentials:true
  // validateStatus:(status) => {

  //   return status <= 302
  // }
};

const client = Axios.create(config)

// token失效，清除用户信息并返回登录界面
// const clearAll = () => {
// window.localStorage.clear()
// history.push('/login')
// }

// 请求前拦截
client.interceptors.request.use(
  (req) => {
    const filterReq = {} as any;
    req?.data && Object.keys(req.data).map(key => {
      if( key &&  req.data[key] !== undefined && req.data[key] !== null){
        filterReq[key] = req.data[key]
      }
    });
    req.data = filterReq;
    console.log(req)
    console.log('上送参数->',req.data);
    // req.headers._portal_token = window.localStorage.getItem('token') || ''
    return req
  },
  (err) => {
    return Promise.reject(err)
  }
)

// 返回后拦截

client.interceptors.response.use(
  (response): Promise<any> => {
    const { data } = response
    if (data.result === 0 || data.result === 200 || data.result === 405 || data.result === 100) {
      return Promise.resolve(data)
    } else {
      console.log('result异常->',data)
      if(data.result === 301 && data.errMsg === "未登陆"){
        window.location.href = "/qqmusic"
      }
      return Promise.reject(data)
    }
  },
  (err) => {
    console.log('接口出错->', err.message)
    if (err.message.indexOf('Network Error') > -1) {
     console.log('Network Error')
    } else {
      console.log('Error')
    }
    return Promise.reject(err)
  }
)

export default client
