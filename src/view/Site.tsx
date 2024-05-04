import { ThemeBasicStyle } from "@global";
import { EmbySite } from "@model/EmbySite";
import { Button, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { Image } from "./Image";
import { Tag } from "./Tag";
import FemaleIcon from "@asset/female_avatar.svg"

export function avatorUrl(site: EmbySite, type: "Primary" = "Primary") {
    const { server: endpoint, user} = site
    const id = user?.User?.Id ?? ""
    return `${endpoint.protocol}://${endpoint.host}:${endpoint.port}${endpoint.path}emby/Users/${id}/Images/${type}?height=152&quality=90`
}

const style = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: 'lightgray',
        borderWidth: 2,
        padding: 10,
        margin: 10,
    },
    server: {
        flexDirection: 'column',
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
    },
    user: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
    }, 
    name: {
        width: 50,
        textAlign: 'center',
        overflow: 'hidden',
        fontWeight: 'bold',
    },
    avator: {
        width: 48,
        height: 48,
        marginBottom: 4,
        borderWidth: 1.5,
        borderRadius: 24,
        overflow: 'hidden',
        borderColor: 'lightgray',
    },
    serverName: {
        maxWidth: "50%"
    }
})

export interface SiteProps {
    site: EmbySite;
    active?: boolean;
    theme?: ThemeBasicStyle;
    style?: Partial<ViewStyle>;
    onPress?: () => void;
    onDelete?: (id: string) => void;
}

export function Site({style: extraStyle, site, theme, onPress, onDelete, active = false}: SiteProps) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1.0}>
        <View style={{...style.card, ...theme, ...extraStyle, borderColor: active ? '#389e0d' : 'lightgray'}}>
            <View style={style.user}>
                <Image style={style.avator} 
                    source={{uri: avatorUrl(site)}}
                    fallbackElement={
                    <FemaleIcon style={style.avator} 
                        width={style.avator.width} 
                        height={style.avator.height} />
                    } 
                />
                <Text style={{...style.name, ...theme}}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {site.user?.User?.Name}
                </Text>
            </View>
            <View style={style.server}>
                <Text style={{...style.serverName,...theme}}
                    ellipsizeMode="tail"
                    numberOfLines={1}>
                    {site?.remark ?? site.name}
                </Text>
                <Tag color="green">{site.version}</Tag>
                <Tag color="magenta">{site.server.host}</Tag>
            </View>
            <Button title="删除"
                disabled={active}
                onPress={() => onDelete?.(site.id)} />
        </View>
        </TouchableOpacity>
    )
}