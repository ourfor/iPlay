export type nil = null|undefined

export interface SiteUserModel {
  id: string|nil
  username: string|nil
  password: string|nil
  accessToken: string|nil
}

export interface SiteModel {
  id: string|nil
  type: string|nil
  server: string|nil
  user: SiteUserModel|nil
  extra: string|null|undefined
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

export interface MediaSourceModel {
  name: string|nil;
  type: string|nil;
  url: string|nil;
}

export interface PlaybackModel {
  id: string|nil;
  sources: MediaSourceModel[]|nil
}

export interface iPlayDataSourceApi {
  login(site: SiteModel): Promise<SiteModel>
  getAllAlbums(): Promise<AlbumModel[]>
  getAlbumLatestMedias(id: string): Promise<MediaModel[]>
  getPlayback(id: string): Promise<PlaybackModel>
  getResume(): Promise<MediaModel[]>
  getSeasons(id: string): Promise<MediaModel[]>
  getEpisodes(seriesId: string, seasonId: string): Promise<MediaModel[]>
  getMedias(query: {[k: string]: string}): Promise<MediaModel[]>
}