import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Media } from '@model/Media';
import { Navigation, ThemeBasicStyle } from '@global';
import { MediaCard } from './MediaCard';
import { ListView } from './ListView';
import { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ViewDetail } from '@model/View';

const style = StyleSheet.create({
    root: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
    },
    more: {
        fontWeight: "light",
    }
});

export interface AlbumCardProps {
    album?: ViewDetail,
    media?: Media[];
    title: string;
    theme?: ThemeBasicStyle;
}

export function AlbumCard({album, media, title, theme }: AlbumCardProps) {
    if (!media || !media.length) return null;

    const navigation: Navigation = useNavigation();
    const toAlbum = () => {
        if (!album) return;
        navigation.navigate('album', {
            title: album?.Name,
            albumId: album?.Id,
            albumName: album?.Name,
        });
    }

    const layout = useMemo(() => ({
        title: {
            ...style.title,
            ...theme
        },
        more: {
            ...style.more,
            ...theme,
        }
    }), [theme])

    return (
        <View style={style.root}>
            <View style={style.header}>
                <Text style={layout.title}>{title}</Text>
                <Pressable onPress={toAlbum}>
                <Text style={layout.more}>查看更多</Text>
                </Pressable>
            </View>
            <ListView items={media}
                isHorizontal={true}
                style={{ width: "100%", height: 200 }}
                layoutForType={(i, dim) => {
                    dim.width = 110;
                    dim.height = 200;
                }}
                render={m => <MediaCard key={m.Id}
                    media={m}
                    theme={theme} />} />
        </View>
    );
}
