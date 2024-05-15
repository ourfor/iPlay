import {
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from '@view/Image';
import {Media} from '@model/Media';
import {useNavigation} from '@react-navigation/native';
import {Navigation, ThemeBasicStyle} from '@global';
import { Device } from '@helper/device';
import { useMemo } from 'react';

export const style = StyleSheet.create({
    mediaCard: {
        margin: 10,
        overflow: 'hidden',
        alignItems: 'center',
    },
    mediaCardLine: {
        margin: 10,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
    },
    mediaCardText: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
        alignItems: 'flex-start',
        justifyContent: "flex-start"
    },
    overview: {

    },
    inlineTitle: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 16,
        width: "100%",
        overflow: 'hidden',
        fontWeight: 'bold',
    },
    title: {
        maxWidth: 90, 
        overflow: 'hidden',
        marginTop: 5,
        fontSize: 13,
        fontWeight: 'bold',
    },
    shadow: {
        shadowColor: 'gray',
        shadowRadius: 1.75,
        elevation:1.5,
        shadowOpacity: 0.5,
        shadowOffset:{
            width:0,
            height:0
        },
    }
});

export function MediaCard({media, theme}: {media: Media, theme?: ThemeBasicStyle}) {
    const navigation: Navigation = useNavigation();
    const onPress = (media: Media) => {
        navigation.navigate('movie', {
            title: Device.isDesktop ? null : media.Name,
            type: media.Type,
            movie: media,
        } as any);
    };
    
    const layout = useMemo(() => ({
        poster: {
            width: media?.Type === "Episode" ? 160 : 90, 
            aspectRatio: media?.Type !== "Episode" ? 0.666 : 16/9, 
            borderRadius: media?.Type==="Episode" ? 7 : 5,
        },
        text: {
            ...style.title, 
            ...theme,
            maxWidth: media?.Type === "Episode" ? 160 : 90,
            fontWeight: media?.Type === "Episode" ? "normal" : "bold"
        } as TextStyle
    }), [theme, media])

    return (
        <View style={style.mediaCard} key={media.Id}>
            <TouchableOpacity activeOpacity={1.0}
                onPress={() => onPress(media)}>
                <Image
                    style={layout.poster}
                    source={{uri: media.image?.primary}}
                />
            </TouchableOpacity>
            <Text style={layout.text}
                numberOfLines={1} 
                ellipsizeMode="tail">
                {media.Name}
            </Text>
            <Text style={theme}>{media.ProductionYear}</Text>
        </View>
    );
}


export function MediaCardInLine({media, theme}: {media: Media, theme?: ThemeBasicStyle}) {
    const navigation: Navigation = useNavigation();
    const onPress = (media: Media) => {
        navigation.navigate('movie', {
            title: media.Name,
            type: media.Type,
            movie: media,
        });
    };
    
    const postStyle = {
        width: media?.Type === "Episode" ? 160 : 90, 
        aspectRatio: media?.Type !== "Episode" ? 0.666 : 16/9, 
        borderRadius: media?.Type==="Episode" ? 7 : 5,
    }

    return (
        <View style={style.mediaCardLine} key={media.Id}>
            <TouchableOpacity activeOpacity={1.0} onPress={() => onPress(media)}>
                <Image
                    style={postStyle}
                    source={{uri: media.image.primary}}
                />
            </TouchableOpacity>
            <View style={style.mediaCardText}>
                <Pressable onPress={() => onPress(media)}>
                <Text style={{...style.inlineTitle, ...theme}}
                    numberOfLines={1} 
                    ellipsizeMode="tail">
                    {media.Name}
                </Text>
                <Text style={{...style.overview, ...theme}}
                    numberOfLines={6} 
                    ellipsizeMode="tail">
                    {media.Overview}
                </Text>
                </Pressable>
                <Text style={theme}>{media.ProductionYear}</Text>
            </View>
        </View>
    );
}