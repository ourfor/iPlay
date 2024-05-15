import { StyleSheet, Text, View } from 'react-native';
import { Media } from '@model/Media';
import { ThemeBasicStyle } from '@global';
import { MediaCard } from './MediaCard';
import { ListView } from './ListView';
import { useMemo } from 'react';

const style = StyleSheet.create({
    root: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    title: {
        width: '100%',
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export function AlbumCard({ media, title, theme }: { media?: Media[]; title: string; theme?: ThemeBasicStyle; }) {
    if (!media || !media.length) return null;

    const layout = useMemo(() => ({
        title: {
            ...style.title,
            ...theme
        }
    }), [theme])

    return (
        <View style={style.root}>
            <Text style={layout.title}>{title}</Text>
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
