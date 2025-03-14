import axios from '@ohos/axios'

export interface HttpModel {
    url: string|undefined
    method: "get"|"post"|undefined
    query: {[k: string]: string | string[] | undefined;}
    body: string|undefined
    headers: {[k: string]: string | string[] | undefined;}
}

export class HttpClient {

  get(url: string) {
    return
  }

  post(url: string) {
    return
  }

  async request(model: HttpModel) {
    let response = await axios.request({
      url: model.url,
      headers: model.headers,
      method: model.method,
      params: model.query,
      data: model.body
    })
    return response.data
  }
}