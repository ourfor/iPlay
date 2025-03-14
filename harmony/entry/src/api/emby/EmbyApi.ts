import { HttpClient } from "../../module/HttpClient"
import { iPlayDataSourceApi, SiteModel, SiteUserModel, AlbumModel, MediaModel } from "../iPlayDataSource"
import { AlbumModel as EmbyAlbumModel, AlbumModelImageBuild, AlbumModelToModel,
  MediaModel as EmbyMediaModel,
  MediaModelImageBuild,
  MediaModelToModel,
  Response } from "./EmbyModel"

export class EmbyApi implements iPlayDataSourceApi {
  client = new HttpClient()
  site: SiteModel|undefined
  user: SiteUserModel|undefined
  commonHeaders = {
    "X-Emby-Client": "iPlay",
    "X-Emby-Device-Name": "Harmony",
    "X-Emby-Device-Id": "6666",
    "X-Emby-Client-Version": "0.0.1",
  }

  async login(site: SiteModel): Promise<object> {
    let response = await this.client.request({
      url: `${site.server}/emby/Users/authenticatebyname`,
      method: "post",
      query: {},
      body: `Username=${site.username}&Pw=${site.password}`,
      headers: {
        ...this.commonHeaders,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    site.extra = response["AccessToken"]
    this.user = {
      id: response["User"]["Id"],
      username: site.username,
      accessToken: site.extra
    }
    this.site = site
    return site
  }

  async getAllAlbums(): Promise<AlbumModel[]> {
    let url = `${this.site?.server}/emby/Users/${this.user?.id}/Views`
    let response = await this.client.request({
      url,
      method: "get",
      query: {},
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken
      },
      body: undefined
    }) as Response<EmbyAlbumModel>
		let albums = response.Items
    return albums.map(album => {
      let model = AlbumModelToModel(album)
      model.image = AlbumModelImageBuild(album, this.site?.server)
      return model
    });
	}

  async getAlbumLatestMedias(id: string): Promise<MediaModel[]> {
    let url = `${this.site?.server}/emby/Users/${this.user?.id}/Items/Latest`
    let response = await this.client.request({
      url,
      method: "get",
      query: {
        "Limit": "16",
        "ParentId": id,
        "Recursive": "true",
        "Fields": "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
      },
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken,
      },
      body: undefined
    }) as EmbyMediaModel[]
    let medias = response
    return medias.map(media => {
      let model = MediaModelToModel(media, this.site?.server)
      return model
    });
  }
}