import {PropsWithNavigation} from '@global';
import { Device } from '@helper/device';
import { useAppDispatch, useAppSelector } from '@hook/store';
import { Episode } from "@model/Episode";
import { PlaybackInfo } from '@model/PlaybackInfo';
import { fetchPlaybackAsync, getSubtitleUrlAsync, getVideoUrlAsync } from '@store/embySlice';
import { updatePlayerState } from '@store/playerSlice';
import { selectThemeBasicStyle, selectThemedPageStyle } from '@store/themeSlice';
import { EpisodeCard } from '@view/EpisodeCard';
import { Image } from '@view/Image';
import { Video } from '@view/Video';
import { PlayEventType } from '@view/mpv/Player';
import { PlaybackStateType, PlayerSource, PlayerSourceType } from '@view/mpv/type';
import { ExternalPlayer } from '@view/player/ExternalPlayer';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

// Later on in your styles..
const style = StyleSheet.create({
    root: {
        flex: 1
    },
    playing: {
        borderColor: "red",
        borderWidth: 2,
        borderRadius: 5,
        marginTop: 2.5,
        marginLeft: 2.5,
        marginRight: 2.5,
    },
    inactive: {
        borderColor: "transparent",
        borderWidth: 2,
        borderRadius: 5,
        marginTop: 2.5,
        marginLeft: 2.5,
        marginRight: 2.5,
    },
    goback: {
        position: 'absolute',
        top: "5%",
        left: "5%",
        backgroundColor: "red",
        zIndex: 10,
        flexGrow: 0,
        flexShrink: 0,
    },
    playerContainer: {
        width: "100%",
    },
    padRoot: {
        flexDirection: "row"
    },
    padContainer: {
        width: "60%"
    },
    player: {
        width: "100%",
        aspectRatio: 16/9,
    },
    overview: {
        padding: 10,
    }
});

export type PlayerPageProps = PropsWithNavigation<'player'>;

export function Page({navigation, route}: PlayerPageProps) {
    const { episodes } = route.params;
    const emby = useAppSelector(state => state.emby.emby);
    const [url, setUrl] = useState<string>()
    const [subtitles, setSubtitles] = useState<PlayerSource[]>([])
    const [poster, setPoster] = useState<string>()
    const [episode, setEpisode] = useState(route.params.episode)
    const videoRef = useRef<any>(null);
    const theme = useAppSelector(selectThemeBasicStyle)
    const pageStyle = useAppSelector(selectThemedPageStyle)
    const subtitleFontName = useAppSelector(s => s.player.fontFamily)
    const showExternalPlayer = useAppSelector(s => s.theme.showExternalPlayer)
    const dispatch = useAppDispatch()
    const isTablet = Device.isTablet


    const getPlaySources = async (playback: PlaybackInfo) => {
        const urlres = await dispatch(getVideoUrlAsync(playback))
        let url = ""
        if (typeof urlres.payload === "string") {
            url = urlres.payload
        }
        const subres = await dispatch(getSubtitleUrlAsync(playback))
        let subtitles: PlayerSource[] = []
        if (typeof subres.payload !== "string") {
            subtitles = subres.payload?.map(item => ({
                type: PlayerSourceType.Subtitle,
                url: item.url,
                value: item.lang,
                name: item.name,
            } as PlayerSource)) ?? []
        }
        return {url, subtitles}
    }

    const playEpisode = async (episode: Episode) => {
        setEpisode(episode)
        setPoster(episode.image.primary)
        const response = await dispatch(fetchPlaybackAsync(episode.Id))
        const playbackInfo = typeof response.payload !== "string" ? response.payload : null
        if (!playbackInfo) {
            return
        }
        const source = await getPlaySources(playbackInfo)
        setUrl(emby?.videoUrl?.(source.url))
        setSubtitles(source.subtitles)
        navigation.setOptions({
            title: episode.Name
        })
        dispatch(updatePlayerState({
            source: "emby",
            status: "start",
            mediaId: episode.Id,
            mediaSourceId: playbackInfo.MediaSources[0]?.Id,
            sessionId: playbackInfo.PlaySessionId,
            startTime: Date.now(),
            mediaPoster: poster,
            position: 0,
        }))
    }

    const onPlaybackStateChanged = useCallback((data: PlaybackStateType) => {
        if (data.type === PlayEventType.PlayEventTypeOnProgress) {
            dispatch(updatePlayerState({
                status: "playing",
                mediaEvent: "TimeUpdate",
                position: data.position,
                duration: data.duration,
            }))
        } else if (data.type === PlayEventType.PlayEventTypeOnPause) {
            console.log("player paused")
            dispatch(updatePlayerState({
                status: "paused",
                mediaEvent: "Pause",
                isPaused: true,
            }))
        }
    }, [dispatch])

    useEffect(() => {
        playEpisode(episode)
        return () => {
            console.log("stop player")
            dispatch(updatePlayerState({
                status: "stopped",
            }))
        }
    }, [])

    const layout = useMemo(() => ({
        page: {
            ...style.root, 
            ...(isTablet ? style.padRoot : {})
        },
        player: {
            ...style.playerContainer, 
            ...(isTablet ? style.padContainer : {})
        },
        playlist: {
            backgroundColor: theme.backgroundColor, 
            marginTop: isTablet ? pageStyle.paddingTop : 0,
        },
        overview: {
            ...style.overview,
            ...theme
        }
    }), [isTablet, theme, pageStyle])


    return (
        <View style={layout.page}>
        <View style={layout.player}>
            <>
            <View style={{width: "100%", height: pageStyle.paddingTop}} />
            {url ? 
            <Video
                ref={videoRef}
                sources={[
                    {url: poster, type: PlayerSourceType.PosterImage},
                    {url: episode.image.logo, type: PlayerSourceType.LogoImage},
                    {url, name: episode?.Name ?? "", type: PlayerSourceType.Video},
                    ...subtitles
                ]}
                source={{uri: url, title: episode.Name}}
                subtitleFontName={subtitleFontName}
                onPlaybackStateChanged={onPlaybackStateChanged}
                style={style.player}
            />
            :
            <Image style={style.player} source={{uri: poster}} />
            }
            </>
            {showExternalPlayer && isTablet && url ? <ExternalPlayer src={url} title={episode.Name} /> : null}
            {isTablet ? <Text style={layout.overview}>{episode.Overview}</Text> : null}
        </View>
        <ScrollView style={layout.playlist}
            showsVerticalScrollIndicator={false}>
        {showExternalPlayer && !isTablet && url ? <ExternalPlayer src={url} title={episode.Name} /> : null}
        {episodes?.map((e, idx) => <EpisodeCard key={idx} 
            theme={theme}
            style={e === episode ? style.playing : style.inactive}
            onPress={playEpisode}
            episode={e} />)}
        </ScrollView>
        </View>
    );
}
