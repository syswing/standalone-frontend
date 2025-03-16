import request from './index'
import apiModule from './api'

const getApiConfig = (path: string) => {
  const url = path.split('/')
  let config = {} as any
  for (let i = 0; i < url.length; i++) {
    const stage = url[i]
    if (i === 0) {
      config = apiModule
    } else {
      config = config[stage]
    }
  }
  return config
}
interface action {
  path: string
  params?: any
}
/**
 * @path 请求路径
 * @params 请求参数
 */
export default ({ path, params }: action) => {
  const apiConfig = getApiConfig(path)
  if (!apiConfig) {
    throw new Error('Invalid API 未找到api配置')
  }
  Object.assign(apiConfig.data, params)
  console.log('apiConfig => ', apiConfig)
  if (apiConfig.method === 'GET') {
    apiConfig.params = apiConfig.data
  }
  return request(apiConfig)
}
