import React, { forwardRef } from 'react';
import {ViewProps, requireNativeComponent} from 'react-native';
import { PlaybackStateType, PlayerSource } from './type';
import { Map } from '@model/Map';
const Player = requireNativeComponent('PlayerView');

export enum PlayEventType {
    PlayEventTypeOnProgress,
    PlayEventTypeOnPause,
    PlayEventTypeOnPauseForCache,
    PlayEventTypeDuration,
    PlayEventTypeEnd,
}

export interface PlayerViewProps extends ViewProps {
    title?: string
    option?: Map<string, string>
    source: PlayerSource[]
    subtitleFontName?: string
    onPlayStateChange?: (state: PlaybackStateType) => void
    url: string
    iconSize?: number
}

export const PlayerView = forwardRef<any, PlayerViewProps>((props, ref) => {
    return <Player {...props} ref={ref} />;
})