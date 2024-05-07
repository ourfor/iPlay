export interface MediaStream {
    Codec: string;
    Language: string;
    DisplayTitle: string;
    DisplayLanguage: string;
    IsInterlaced: boolean;
    IsDefault: boolean;
    IsForced: boolean;
    IsHearingImpaired: boolean;
    Type: "Subtitle"|"Video"|"Audio"|"Unknown"|string;
    Index: number;
    IsExternal: boolean;
    DeliveryMethod: "External"|"Hls"|string;
    DeliveryUrl: string;
    IsExternalUrl: boolean;
    IsTextSubtitleStream: boolean;
    SupportsExternalStream: boolean;
    Path: string;
    Protocol: "File"|string;
    ExtendedVideoType: "None"|string;
    ExtendedVideoSubType: "None"|string;
    ExtendedVideoSubTypeDescription: "None"|string;
    AttachmentSize: 0
}

export interface MediaSource {
    Id: string
    Container: string
    DirectStreamUrl: string
    Path: string
    TranscodingUrl: string
    Name: string
    MediaStreams: MediaStream[]
}

export interface PlaybackInfo {
    MediaSources: MediaSource[]
    PlaySessionId: string
}