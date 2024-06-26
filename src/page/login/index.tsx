import { EmbyConfig } from '@api/config';
import { Navigation } from '@global';
import { OSType, isOS } from '@helper/device';
import { EmbyServerType } from '@helper/env';
import { Toast } from '@helper/toast';
import { useAppDispatch, useAppSelector } from '@hook/store';
import { embyUrl } from '@model/EmbySite';
import { useNavigation } from '@react-navigation/native';
import { loginToSiteAsync, removeSite, switchToSiteAsync } from '@store/embySlice';
import { selectThemeBasicStyle } from '@store/themeSlice';
import { Site } from '@view/Site';
import { Tag } from '@view/Tag';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const style = StyleSheet.create({
    inputLine: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    inputLabel: {
        flexShrink: 0,
        minWidth: 50,
        fontWeight: "600",
        fontSize: 16,
    },
    input: {
        flex: 1,
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#f0f0f0",
        borderColor: "#e0e0e0",
    },
    selector: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: "#f0f0f0",
        borderColor: "#e0e0e0",
    },
    loginButton: {
        marginTop: 12,
        marginBottom: 12,
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "black",
        color: "white",
        borderRadius: 5,
        width: "75%"
    }
});

export function Page() {
    const navigation: Navigation = useNavigation()
    const insets = useSafeAreaInsets()
    const sites = useAppSelector(state => state.emby.sites)
    const site = useAppSelector(state => state.emby.site)
    const [serverRemark, onChangeServerRemark] = useState(site?.remark ?? '');
    const [server, onChangeServer] = useState(embyUrl(site) ?? '');
    const [username, onChangeUsername] = useState(site?.user.User.Name ?? '');
    const [password, onChangePassword] = useState('');
    const [siteType, onChangeSiteType] = useState(EmbyServerType.Emby)
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()
    const backgroundColor = useAppSelector(state => state.theme.backgroundColor);
    const theme = useAppSelector(selectThemeBasicStyle)
    const pagePaddingTop = useAppSelector(state => state.theme.pagePaddingTop)

    const onLoginPress = async () => {
        const regex = /(?<protocol>http|https):\/\/(?<host>[^\/\:]+):?(?<port>\d+)?(?<path>\/?.*)/
        const groups = server.match(regex)?.groups
        const protocol = groups?.protocol === "https" ? "https" : "http"
        const endpoint: EmbyConfig = {
            type: siteType,
            remark: serverRemark?.trim() ?? null,
            host: groups?.host ?? "",
            port: groups?.port ? parseInt(groups.port) : (protocol === "https" ? 443 : 80),
            protocol,
            path: groups?.path ? (groups?.path.length === 0 ? "/" : groups?.path) : "/"
        }
        const callback = {
            resolve: () => {
                setLoading(false)
                setTimeout(() => {
                    navigation.goBack()
                }, 1000)
                Toast.show({
                    type: 'success',
                    text1: '登录成功',
                    position: 'top',
                    topOffset: insets.top + 2.5, 
                });
            },
            reject: () => {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
                Toast.show({
                    type: 'error',
                    text1: '登录失败',
                    text2: '请检查服务器地址、用户名和密码',
                    position: 'top',
                    topOffset: insets.top, 
                });
            }
        }
        setLoading(true)
        dispatch(loginToSiteAsync({
            endpoint,
            username: username?.trim(), 
            password: password?.trim(), 
            callback
        }))
    }

    useEffect(() => {
        onChangeServer(embyUrl(site) ?? '')
        onChangeUsername(site?.user.User.Name ?? '')
    }, [site])

    return (
        <View style={{flex: 1, backgroundColor, paddingTop: pagePaddingTop}}>
            <View style={style.inputLine}>
                <Text style={{...style.inputLabel, ...theme}}>类　型</Text>
                <View style={{...style.selector, ...theme}}>
                {[EmbyServerType.Emby, EmbyServerType.Jellyfin].map(type => 
                    <Tag key={type}
                        color={siteType==type ? "red" : "cyan"} 
                        onPress={() => onChangeSiteType(type)}>
                        {type}
                    </Tag>
                )}
                </View>
                <Text style={{...style.inputLabel, ...theme}}>备　注</Text>
                <TextInput
                    placeholder="可选"
                    style={{...style.input, ...theme}}
                    placeholderTextColor={theme.color}
                    onChangeText={onChangeServerRemark}
                    value={serverRemark}
                />
            </View>
            <View style={style.inputLine}>
                <Text style={{...style.inputLabel, ...theme}}>服务器</Text>
                <TextInput
                    placeholder="eg: http://server.emby.media:8096/"
                    style={{...style.input, ...theme}}
                    placeholderTextColor={theme.color}
                    onChangeText={onChangeServer}
                    value={server}
                />
            </View>
            <View style={style.inputLine}>
                <Text style={{...style.inputLabel, ...theme}}>用户名</Text>
                <TextInput
                    placeholder="guest"
                    style={{...style.input, ...theme}}
                    placeholderTextColor={theme.color}
                    onChangeText={onChangeUsername}
                    value={username}
                />
            </View>
            <View style={style.inputLine}>
                <Text style={{...style.inputLabel, ...theme}}>密　码</Text>
                <TextInput
                    placeholder="password"
                    style={{...style.input, ...theme}}
                    secureTextEntry={true}
                    placeholderTextColor={"red"}
                    onChangeText={onChangePassword}
                    value={password}
                />
            </View>
            <View style={style.loginButton}>
                <Button title={loading ? "登录中..." : "登录"} 
                    color={isOS(OSType.Android) ? "black" : "white"}
                    onPress={onLoginPress} />
            </View>
            <ScrollView>
                {sites?.map((s, i) => (
                    <Site key={`${s.id}:${i}`} site={s}
                        active={s.id === site?.id}
                        onPress={() => dispatch(switchToSiteAsync(s.id))}
                        onDelete={(id) => dispatch(removeSite(id))}
                        theme={theme} />
                ))}
            </ScrollView>
        </View>
    );
}
