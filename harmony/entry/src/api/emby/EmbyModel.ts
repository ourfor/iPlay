import { ImageModel, AlbumModel as StdAlbumModel, MediaModel as StdMediaModel, nil,
    ActorModel } from "../iPlayDataSource";

export class Response<T> {
    TotalRecordCount: number;
    Items: T[];
}

export class AlbumModel {
    Id: string;
    Name: string;
}

export interface People {
    Name: string;
    Id: string;
    Role: string;
    Type: string;
}

export function AlbumModelImageBuild(self: AlbumModel, endpoint: string) {
    let image: ImageModel = {
        primary: `${endpoint}/emby/Items/${self.Id}/Images/Primary?maxHeight=120&maxWidth=120`,
        backdrop: `${endpoint}/emby/Items/${self.Id}/Images/Primary?maxHeight=120&maxWidth=120`,
        logo: `${endpoint}/emby/Items/${self.Id}/Images/Primary?maxHeight=120&maxWidth=120`,
    }
    return image
}

export function MediaModelImageBuild(self: MediaModel, endpoint: string) {
    let image: ImageModel = {
        primary: `${endpoint}/emby/Items/${self.Id}/Images/Primary`,
        backdrop: `${endpoint}/emby/Items/${self.Id}/Images/Backdrop/0`,
        logo: `${endpoint}/emby/Items/${self.Id}/Images/Logo`,
    }
    return image
}

export function AlbumModelToModel(self: AlbumModel) {
    return {
        id: self.Id,
        title: self.Name,
        image: undefined
    } as StdAlbumModel
}

export function MediaModelToModel(self: MediaModel, endpoint: string) {
    return {
        id: self.Id,
        type: self.Type,
        title: self.Name,
        tags: self.Genres ?? [],
        overview: self.Overview,
        image: MediaModelImageBuild(self, endpoint),
        actors: self.People?.map(people => PeopleModelToModel(people, endpoint)) ?? []
    } as StdMediaModel
}

export function PeopleModelToModel(self: People, endpoint: string) {
    return {
        id: self.Id,
        name: self.Name,
        avatar: `${endpoint}/emby/Items/${self.Id}/Images/Primary`,
    } as ActorModel
}

export interface EmbyMediaStream {
    DeliveryUrl: string
}

export interface EmbyMediaSource {
    Id: string;
    Container: string;
    Name: string;
    Path: string;
    DirectStreamUrl: string;
    TranscodingUrl: string;
    MediaStreams: EmbyMediaStream[]
}

export interface EmbyPlaybackModel {
    PlaySessionId: string;
    MediaSources: EmbyMediaSource[];
}

export class MediaModel {
    Id: string;
    Name: string;
    Image: ImageModel|nil
    Overview: string|nil
    Genres: string[]|nil
    Type: string|nil
    People: People[]|nil
}