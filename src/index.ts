import axios, { AxiosPromise, AxiosRequestConfig, Method, ResponseType } from 'axios'

interface PathParams {
  [key: string]: string | number
}

interface RequestConfig extends AxiosRequestConfig {
  pathParams?: PathParams
}

interface AxiosConfigChain<T> {
  url: (url: string) => AxiosConfigChain<T>
  baseURL: (baseURL: string) => AxiosConfigChain<T>
  pathParams: (pathParams: PathParams) => AxiosConfigChain<T>
  queryParams: (queryParams: any) => AxiosConfigChain<T>
  method: (method: Method) => AxiosConfigChain<T>
  headers: (headers: any) => AxiosConfigChain<T>
  timeout: (timeout: number) => AxiosConfigChain<T>
  expect: (responseType: ResponseType) => AxiosConfigChain<T>
  config: (axiosConfig: AxiosRequestConfig) => AxiosConfigChain<T>
  send: (data?: any) => AxiosPromise<T>
}

interface AxiosChain {
  request: <T = any>() => AxiosConfigChain<T>
  get: <T = any>(url: string) => AxiosConfigChain<T>
  post: <T = any>(url: string) => AxiosConfigChain<T>
  put: <T = any>(url: string) => AxiosConfigChain<T>
  patch: <T = any>(url: string) => AxiosConfigChain<T>
  delete: <T = any>(url: string) => AxiosConfigChain<T>
  head: <T = any>(url: string) => AxiosConfigChain<T>
  options: <T = any>(url: string) => AxiosConfigChain<T>
}

const wrapper = <T>(config: RequestConfig): AxiosConfigChain<T> => ({
  url: url => wrapper({ ...config, url }),
  baseURL: baseURL => wrapper({ ...config, baseURL }),
  pathParams: pathParams => wrapper({ ...config, pathParams }),
  queryParams: queryParams => wrapper({ ...config, params: queryParams }),
  method: method => wrapper({ ...config, method }),
  headers: headers => wrapper({ ...config, headers }),
  timeout: timeout => wrapper({ ...config, timeout }),
  expect: responseType => wrapper({ ...config, responseType }),
  config: axiosConfig => wrapper({ ...config, ...axiosConfig }),
  send: data => axios({
    ...config,
    ...replacePathParams(config),
    data: data || config.data,
  }),
})

const replacePathParams = (config: RequestConfig) => {
  let baseURL = config.baseURL?.slice()
  let url = config.url?.slice()

  for (const key of Object.keys(config.pathParams || {})) {
    const paramToReplace = `:${key}`
    const valueToReplace = config.pathParams[key].toString()

    baseURL = baseURL?.replace(paramToReplace, valueToReplace)
    url = url?.replace(paramToReplace, valueToReplace)
  }

  return { baseURL, url }
}

const axiosChain: AxiosChain = {
  request: () => wrapper({}),
  get: (url) => wrapper({ url, method: 'GET' }),
  post: (url) => wrapper({ url, method: 'POST' }),
  put: (url) => wrapper({ url, method: 'PUT' }),
  patch: (url) => wrapper({ url, method: 'PATCH' }),
  delete: (url) => wrapper({ url, method: 'DELETE' }),
  head: (url) => wrapper({ url, method: 'HEAD' }),
  options: (url) => wrapper({ url, method: 'OPTIONS' }),
}

export default axiosChain
