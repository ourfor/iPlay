export type nil = null|undefined

export interface SiteModel {
  id: string|null|undefined
  server: string|null|undefined
  username: string|null|undefined
  password: string|null|undefined
  extra: string|null|undefined
}

export interface SiteUserModel {
  id: string|null|undefined
  username: string|null|undefined
  accessToken: string|null|undefined
}

export interface ImageModel {
  primary: string|nil
  backdrop: string|nil
  logo: string|nil
}

export interface AlbumModel {
  id: string|nil;
  title: string|nil;
  image: ImageModel|nil;
}

export interface MediaModel {
  id: string|nil;
  title: string|nil;
  image: ImageModel|nil;
  type: string|nil;
  overview: string|nil;
  tags: string[]|nil;
  actors: ActorModel[]|nil
}

export interface ActorModel {
  id: string|null;
  name: string|null;
  avatar: string|null;
}

export interface iPlayDataSourceApi {
  login(site: SiteModel): Promise<object>
  getAllAlbums(): Promise<AlbumModel[]>
  getAlbumLatestMedias(id: string): Promise<MediaModel[]>
}