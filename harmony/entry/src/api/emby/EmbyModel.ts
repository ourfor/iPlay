import { ImageModel, AlbumModel as StdAlbumModel, MediaModel as StdMediaModel, nil } from "../iPlayDataSource";

export class Response<T> {
    TotalRecordCount: number;
    Items: T[];
}

export class AlbumModel {
    Id: string;
    Name: string;
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

export function MediaModelToModel(self: MediaModel) {
    return {
        id: self.Id,
        type: self.Type,
        title: self.Name,
        image: undefined
    } as StdMediaModel
}

export class MediaModel {
    Id: string;
    Name: string;
    Image: ImageModel|nil
    Type: string|nil
}