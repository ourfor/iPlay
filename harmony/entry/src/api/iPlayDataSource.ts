
export interface SiteModel {
  id: string|null|undefined
  server: string|null|undefined
  username: string|null|undefined
  password: string|null|undefined
}

export interface iPlayDataSourceApi {
  login(site: SiteModel): Promise<object>
  getAllAlbums(): Promise<object[]>
}