import { HttpClient } from "../../module/HttpClient"
import { iPlayDataSourceApi, SiteModel } from "../iPlayDataSource"

export class EmbyApi implements iPlayDataSourceApi {
  client = new HttpClient()

  async login(site: SiteModel): Promise<object> {
    return await this.client.request({
      url: `${site.server}/emby/Users/authenticatebyname`,
      method: "post",
      query: {},
      body: `Username=${site.username}&Pw=${site.password}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }

  getAllAlbums(): Promise<object[]> {
		return
	}
}