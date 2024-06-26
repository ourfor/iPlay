import {preferedSize, windowWidth} from '@helper/device';
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
} from 'react';
import { PlayerView } from './Player';
import {NativeModules, StyleSheet, findNodeHandle} from 'react-native';
import { PlaybackStateType, VideoProps } from './type';
import { useAppSelector } from '@hook/store';
import { VideoDecodeType } from '@store/configSlice';

export interface PlayerManagerType {
    resume: (reactTag: number) => void;
    pause: (reactTag: number) => void;
    stop: (reactTag: number) => void;
}

export interface PlayerRef {
    resume: (reactTag: number) => void;
    pause: (reactTag: number) => void;
    stop: (reactTag: number) => void;
}
const PlayerManager = NativeModules.PlayerView as PlayerManagerType;

const style = StyleSheet.create({
    player: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
});

export const MPVPlayer = forwardRef<PlayerRef, VideoProps>(
    (props, ref) => {
        const nativeRef = useRef(null);
        const {uri, title} = props.source as any;
        console.log(`uri: ${uri} title: ${title}`);
        const onPlayStateChange = (s: any) => {
            const state: PlaybackStateType = s.nativeEvent;
            props.onPlaybackStateChanged?.(state);
        };

        const stop = useCallback(() => {
            const id = findNodeHandle(nativeRef.current);
            console.log(`call stop: ${id} ${nativeRef}`);
            PlayerManager.stop(id!);
        }, []);

        const decode = useAppSelector(state => state.config.video.Decode)
        const option = {
            hwdec: decode === VideoDecodeType.Software ? "no" : "auto",
            "sub-font": props.subtitleFontName ?? "sans-serif",
            "sub-scale": String(props.subtitleFontScale ?? 1),
        }


        useImperativeHandle(
            ref,
            () => ({
                stop: () => null,
                resume: () => null,
                pause: () => null,
            }),
            [stop],
        );

        return (
            <PlayerView
                style={style.player as any}
                iconSize={preferedSize(25, 48, windowWidth/10)}
                ref={nativeRef}
                title={title}
                option={option}
                source={props.sources ?? []}
                subtitleFontName={props.subtitleFontName}
                onPlayStateChange={onPlayStateChange}
                url={uri}
            />
        );
    },
);