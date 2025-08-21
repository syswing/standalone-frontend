import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface AxiosConfig {
  timeout: number
  headers: {
    'Content-Type': string;
    'X-Requested-With': string;
    'Authorization'?: string;
  }
  baseURL: string;
  withCredentials: boolean;
  // validateStatus:any;
}

console.log(process.env)

const config: AxiosConfig = {
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'X-Requested-With': 'XMLHttpRequest',
  },
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : process.env.REACT_APP_URL_ENV as string,
  withCredentials: true
  // validateStatus:(status) => {

  //   return status <= 302
  // }
};

const client = Axios.create(config)

// 清除用户信息并返回登录界面
const clearAuthAndRedirect = () => {
  localStorage.removeItem('standalone-token')
  localStorage.removeItem('userInfo')
}

// 请求前拦截
client.interceptors.request.use(
  (req: any) => {
    // 获取存储的token
    const token = localStorage.getItem('standalone-token')
    
    // 如果有token，添加到请求头
    if (token) {
      req.headers.Authorization = `Bearer ${token}`
    }
    
    // 过滤掉undefined和null的参数
    const filterReq = {} as any;
    req?.data && Object.keys(req.data).map(key => {
      if (key && req.data[key] !== undefined && req.data[key] !== null) {
        filterReq[key] = req.data[key]
      }
    });
    req.data = filterReq;
    
    console.log('请求配置 ->', req)
    console.log('上送参数 ->', req.data);
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
    
    // 成功的状态码处理
    if (data.result === 0 || data.result === 200 || data.result === 405 || data.result === 100) {
      console.log('返回数据 ->', data)
      return Promise.resolve(data)
    } else {
      console.log('result异常 ->', data)
      
      // 处理未登录或token失效的情况
      if (data.result === 301 || data.result === 401 || 
          (data.errMsg && (data.errMsg.includes('未登陆') || data.errMsg.includes('token') || data.errMsg.includes('认证失败')))) {
        // 显示提示信息
        console.log('认证失败，请重新登录')
        
        // 清除认证信息并重定向到登录页
        clearAuthAndRedirect()
      }
      
      return Promise.reject(data)
    }
  },
  (err) => {
    console.log('接口出错 ->', err)
    
    // 处理HTTP错误状态码
    if (err.response) {
      const { status } = err.response
      
      // 处理401 Unauthorized和403 Forbidden
      if (status === 401 || status === 403) {
        console.log('认证失败或权限不足，请重新登录')
        clearAuthAndRedirect()
      }
      
      // 处理其他HTTP错误
      console.log(`HTTP错误: ${status}`)
    } else if (err.message.indexOf('Network Error') > -1) {
      console.log('网络错误，请检查您的网络连接')
    } else if (err.message.indexOf('timeout') > -1) {
      console.log('请求超时，请稍后重试')
    } else {
      console.log('请求错误:', err.message)
    }
    
    return Promise.reject(err)
  }
)

// 添加一个辅助函数来设置token
export const setAuthToken = (token: string) => {
  localStorage.setItem('standalone-token', token)
}

// 添加一个辅助函数来获取token
export const getAuthToken = () => {
  return localStorage.getItem('standalone-token')
}

// 添加一个辅助函数来检查是否已认证
export const isAuthenticated = () => {
  return !!localStorage.getItem('standalone-token')
}

// 添加一个辅助函数来清除认证
export const clearAuth = () => {
  localStorage.removeItem('standalone-token')
  localStorage.removeItem('userInfo')
}

export default client