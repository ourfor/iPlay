import { ViewProps } from "react-native";
import { PlayEventType } from "./Player";

export type PlaybackStateType = {
    isPlaying: boolean,
    type: PlayEventType,
    position?: number,
    duration?: number,
}
export enum PlayerSourceType {
    None,
    Video,
    Audio,
    Playlist,
    Title,
    Subtitle,
    PosterImage,
    LogoImage,
    InfoText,
}

export type PlayerSource = {
    type: PlayerSourceType,
    name?: string,
    url?: string,

    // InfoText/Title
    value?: string,

    playlist?: PlayerSource[],
}

export type VideoProps = {
    subtitleFontName?: string
    subtitleFontScale?: number
    sources?: PlayerSource[];
    source: {
        uri: string;
        title: string;
    };
    onPlaybackStateChanged?: (state: PlaybackStateType) => void;
} & ViewProps