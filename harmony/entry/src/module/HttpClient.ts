// @ts-nocheck
import { rcp } from '@kit.RemoteCommunicationKit';
import { BusinessError } from '@kit.BasicServicesKit';

export interface HttpModel {
    url: string|undefined
    method: "get"|"post"|undefined
    query: {[k: string]: string | string[] | undefined;}
    body: string|undefined
    headers: {[k: string]: string | string[] | undefined;}
}

export class HttpClient {
  session = rcp.createSession();

  get(url: string) {
    return this.session.get(url)
  }

  post(url: string) {
    return this.session.post(url)
  }

  async request(model: HttpModel) {
    let request = new rcp.Request(model.url)
    request.method = model.method
    request.headers = model.headers
    let response = await this.session.fetch(request)
    let obj = response.toJSON()
    return obj
  }
}