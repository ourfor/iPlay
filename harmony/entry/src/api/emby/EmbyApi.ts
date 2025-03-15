import { HttpClient } from "../../module/HttpClient"
import { iPlayDataSourceApi, SiteModel, SiteUserModel, AlbumModel, MediaModel, PlaybackModel,
  MediaSourceModel } from "../iPlayDataSource"
import { AlbumModel as EmbyAlbumModel, AlbumModelImageBuild, AlbumModelToModel,
  EmbyPlaybackModel,
  MediaModel as EmbyMediaModel,
  MediaModelToModel,
  Response } from "./EmbyModel"

const kDeviceProfile = "{\"DeviceProfile\":{\"MaxStaticBitrate\":140000000,\"MaxStreamingBitrate\":140000000,\"MusicStreamingTranscodingBitrate\":192000,\"DirectPlayProfiles\":[{\"Container\":\"mp4,m4v\",\"Type\":\"Video\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"mkv\",\"Type\":\"Video\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"flv\",\"Type\":\"Video\",\"VideoCodec\":\"h264\",\"AudioCodec\":\"aac,mp3\"},{\"Container\":\"mov\",\"Type\":\"Video\",\"VideoCodec\":\"h264\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\"},{\"Container\":\"opus\",\"Type\":\"Audio\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\"},{\"Container\":\"mp2,mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp2\"},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\"},{\"Container\":\"m4a\",\"AudioCodec\":\"aac\",\"Type\":\"Audio\"},{\"Container\":\"mp4\",\"AudioCodec\":\"aac\",\"Type\":\"Audio\"},{\"Container\":\"flac\",\"Type\":\"Audio\"},{\"Container\":\"webma,webm\",\"Type\":\"Audio\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"PCM_S16LE,PCM_S24LE\"},{\"Container\":\"ogg\",\"Type\":\"Audio\"},{\"Container\":\"webm\",\"Type\":\"Video\",\"AudioCodec\":\"vorbis,opus\",\"VideoCodec\":\"VP8,VP9\"}],\"TranscodingProfiles\":[{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Streaming\",\"Protocol\":\"hls\",\"MaxAudioChannels\":\"2\",\"MinSegments\":\"2\",\"BreakOnNonKeyFrames\":true},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"opus\",\"Type\":\"Audio\",\"AudioCodec\":\"opus\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"wav\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"opus\",\"Type\":\"Audio\",\"AudioCodec\":\"opus\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp3\",\"Type\":\"Audio\",\"AudioCodec\":\"mp3\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"aac\",\"Type\":\"Audio\",\"AudioCodec\":\"aac\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"wav\",\"Type\":\"Audio\",\"AudioCodec\":\"wav\",\"Context\":\"Static\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mkv\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\",\"VideoCodec\":\"h264,h265,hevc,vp8,vp9\",\"Context\":\"Static\",\"MaxAudioChannels\":\"2\",\"CopyTimestamps\":true},{\"Container\":\"m4s,ts\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac\",\"VideoCodec\":\"h264,h265,hevc\",\"Context\":\"Streaming\",\"Protocol\":\"hls\",\"MaxAudioChannels\":\"2\",\"MinSegments\":\"2\",\"BreakOnNonKeyFrames\":true,\"ManifestSubtitles\":\"vtt\"},{\"Container\":\"webm\",\"Type\":\"Video\",\"AudioCodec\":\"vorbis\",\"VideoCodec\":\"vpx\",\"Context\":\"Streaming\",\"Protocol\":\"http\",\"MaxAudioChannels\":\"2\"},{\"Container\":\"mp4\",\"Type\":\"Video\",\"AudioCodec\":\"mp3,aac,opus,flac,vorbis\",\"VideoCodec\":\"h264\",\"Context\":\"Static\",\"Protocol\":\"http\"}],\"ContainerProfiles\":[],\"CodecProfiles\":[{\"Type\":\"VideoAudio\",\"Codec\":\"aac\",\"Conditions\":[{\"Condition\":\"Equals\",\"Property\":\"IsSecondaryAudio\",\"Value\":\"false\",\"IsRequired\":\"false\"}]},{\"Type\":\"VideoAudio\",\"Conditions\":[{\"Condition\":\"Equals\",\"Property\":\"IsSecondaryAudio\",\"Value\":\"false\",\"IsRequired\":\"false\"}]},{\"Type\":\"Video\",\"Codec\":\"h264\",\"Conditions\":[{\"Condition\":\"EqualsAny\",\"Property\":\"VideoProfile\",\"Value\":\"high|main|baseline|constrained baseline|high 10\",\"IsRequired\":false},{\"Condition\":\"LessThanEqual\",\"Property\":\"VideoLevel\",\"Value\":\"62\",\"IsRequired\":false}]},{\"Type\":\"Video\",\"Codec\":\"hevc\",\"Conditions\":[{\"Condition\":\"EqualsAny\",\"Property\":\"VideoCodecTag\",\"Value\":\"hvc1\",\"IsRequired\":false}]}],\"SubtitleProfiles\":[{\"Format\":\"vtt\",\"Method\":\"Hls\"},{\"Format\":\"eia_608\",\"Method\":\"VideoSideData\",\"Protocol\":\"hls\"},{\"Format\":\"eia_708\",\"Method\":\"VideoSideData\",\"Protocol\":\"hls\"},{\"Format\":\"vtt\",\"Method\":\"External\"},{\"Format\":\"ass\",\"Method\":\"External\"},{\"Format\":\"ssa\",\"Method\":\"External\"}],\"ResponseProfiles\":[{\"Type\":\"Video\",\"Container\":\"m4v\",\"MimeType\":\"video/mp4\"}]}}\n";

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

  async login(site: SiteModel): Promise<SiteModel> {
    let response = await this.client.request({
      url: `${site.server}/emby/Users/authenticatebyname`,
      method: "post",
      query: {},
      body: `Username=${site.user.username}&Pw=${site.user.password}`,
      headers: {
        ...this.commonHeaders,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    site.user.accessToken = response["AccessToken"]
    site.user.id = response["User"]["Id"]
    site.id = response["ServerId"]
    this.user = site.user
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

  async getPlayback(id: string): Promise<PlaybackModel> {
    let url = `${this.site?.server}/emby/Items/${id}/PlaybackInfo`
    let response = await this.client.request({
      url,
      method: "post",
      query: {
        "StartTimeTicks": "0",
        "IsPlayback": "false",
        "AutoOpenLiveStream": "false",
        "MaxStreamingBitrate": "140000000",
        "UserId": this.site?.user?.id ?? "",
        "reqformat": "json",
      },
      headers: {
        ...this.commonHeaders,
        "Content-Type": "application/json",
        "X-Emby-Token": this.user?.accessToken,
      },
      body: kDeviceProfile
    }) as EmbyPlaybackModel
    let playback: PlaybackModel = {
      id: response.PlaySessionId,
      sources: response.MediaSources.map(source => {
        let model: MediaSourceModel = {
          name: source.Name,
          type: "video",
          url: `${this.site?.server}/${source.DirectStreamUrl}`
        }
        return model
      })
    }
    return playback
  }

  async getSeasons(id: string): Promise<MediaModel[]> {
    let url = `${this.site?.server}/emby/Shows/${id}/Seasons`
    let response = await this.client.request({
      url,
      method: "get",
      query: {
        "UserId": this.site?.user?.id ?? "",
        "Fields": "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
      },
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken,
      },
      body: undefined
    }) as Response<EmbyMediaModel>
    let medias = response.Items
    return medias.map(media => {
      let model = MediaModelToModel(media, this.site?.server)
      return model
    });
  }

  async getEpisodes(seriesId: string, seasonId: string): Promise<MediaModel[]> {
    let url = `${this.site?.server}/emby/Shows/${seriesId}/Episodes`
    let response = await this.client.request({
      url,
      method: "get",
      query: {
        "SeasonId": seasonId ?? "",
        "UserId": this.site?.user?.id ?? "",
        "Fields": "BasicSyncInfo,People,Genres,SortName,Overview,CanDelete,Container,PrimaryImageAspectRatio,Prefix,DateCreated,ProductionYear,Status,EndDate"
      },
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken,
      },
      body: undefined
    }) as Response<EmbyMediaModel>
    let medias = response.Items
    return medias.map(media => {
      let model = MediaModelToModel(media, this.site?.server)
      model.type = "episode"
      return model
    });
  }

  async getResume(): Promise<MediaModel[]> {
    let url = `${this.site?.server}/emby/Users/${this.site?.user?.id}/Items/Resume`
    let response = await this.client.request({
      url,
      method: "get",
      query: {
        "Recursive": "true",
        "Fields": "BasicSyncInfo,People,Genres,CanDelete,Container,PrimaryImageAspectRatio,ProductionYear,Status,EndDate,Overview",
        "ImageTypeLimit": "1",
        "EnableImageTypes": "Primary,Backdrop,Thumb",
        "MediaTypes": "Video",
        "Limit": "50",
      },
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken,
      },
      body: undefined
    }) as Response<EmbyMediaModel>
    let medias = response.Items
    return medias.map(media => {
      let model = MediaModelToModel(media, this.site?.server)
      return model
    });
  }

  async getMedias(query: { [k: string]: string }): Promise<MediaModel[]> {
    let url = `${this.site?.server}/emby/Users/${this.site?.user?.id}/Items`
    let response = await this.client.request({
      url,
      method: "get",
      query: {
        "Recursive": "true",
        "Fields": "BasicSyncInfo,People,Genres,CanDelete,Container,PrimaryImageAspectRatio,ProductionYear,Status,EndDate,Overview",
        "ImageTypeLimit": "1",
        "EnableImageTypes": "Primary,Backdrop,Thumb",
        "Limit": "50",
        "MediaTypes": "",
        "SortBy": "SortName",
        "SortOrder": "Ascending",
        // "IncludeItemTypes": "Movie,Series",
        "StartIndex": "0",
        ...query
      },
      headers: {
        ...this.commonHeaders,
        "X-Emby-Token": this.user?.accessToken,
      },
      body: undefined
    }) as Response<EmbyMediaModel>
    let medias = response.Items
    return medias.map(media => {
      let model = MediaModelToModel(media, this.site?.server)
      return model
    });
  }
}