import { OSType, isOS } from "@helper/device";
import { FontModule } from "@helper/font";
import { useAppDispatch, useAppSelector } from "@hook/store";
import { ColorScheme, MenuIconStyle, selectThemeBasicStyle, updateMenuBarPaddingOffset, updateShowVideoLink, updateTheme } from "@store/themeSlice";
import { SelectView } from "@view/SelectView";
import { StatusBar } from "@view/StatusBar";
import { Tag } from "@view/Tag";
import { useEffect, useState } from "react";
import { NativeEventEmitter, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

const style = StyleSheet.create({
    page: {
        flex: 1,
    },
    inline: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomColor: "lightgray",
        borderBottomWidth: 0.25,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    browser: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        fontSize: 16,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        marginLeft: 10,
        minWidth: 50,
    },
    selector: {
        flex: 2
    }
});

export function Page() {
    const dispatch = useAppDispatch();
    const menuBarPaddingOffset = useAppSelector((state) => state.theme.menuBarPaddingOffset);
    const showVideoLink = useAppSelector((state) => state.theme.showVideoLink);
    const showExternalPlayer = useAppSelector((state) => state.theme.showExternalPlayer);
    const hideMenuTitle = useAppSelector((state) => state.theme.hideMenuTitle);
    const menuInactiveOpacity = useAppSelector((state) => state.theme.menuInactiveOpacity);
    const headerTitleAlign = useAppSelector((state) => state.theme.headerTitleAlign);
    const color = useAppSelector(state => state.theme.fontColor);
    const fontName = useAppSelector(state => state.theme.fontFamily)
    const backgroundColor = useAppSelector(state => state.theme.backgroundColor);
    const theme = useAppSelector(selectThemeBasicStyle)
    const colorScheme = useAppSelector(state => state.theme.colorScheme)
    const menuIconStyle = useAppSelector(state => state.theme.menuIconStyle)
    const pagePaddingTop = useAppSelector(state => state.theme.pagePaddingTop)
    const [fontList, setFontList] = useState<{label: string, value: string}[]>([])

    useEffect(() => {
        if (isOS(OSType.Windows)) {
            return
        }
        FontModule.fontFamilyListAsync()
            .then(fontNames => {
                const items = fontNames.sort().map(f => ({label: f, value: f}))
                setFontList(items)
            })
        if (isOS(OSType.Android)) {
            return
        }
        const listener = new NativeEventEmitter(FontModule).addListener("onSelectFontChange", (fontFamily: string) => {
            dispatch(updateTheme({fontFamily}))
        })
        return () => {
            listener.remove()
        }
    }, [])

    const onBrowseFont = () => {
        FontModule.showFontPicker()
    }

    const updateTitleAlign = () => {
        dispatch(updateTheme(s => {
            s.headerTitleAlign = s.headerTitleAlign === 'center' ? 'left' : 'center';
            return s
        }));
    }

    return (
        <View style={{...style.page, backgroundColor, paddingTop: pagePaddingTop}}>
            <StatusBar />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{flex: 1}}>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>菜单栏下边距</Text>
                    <TextInput style={{...style.input, color}}
                        keyboardType="numeric"
                        value={menuBarPaddingOffset.toString()}
                        onChangeText={(text) => dispatch(updateMenuBarPaddingOffset(Number(text)))}
                        />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>隐藏菜单栏标题</Text>
                    <Switch value={hideMenuTitle}
                        onChange={() => { dispatch(updateTheme({hideMenuTitle: !hideMenuTitle})) }} />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>菜单栏非激活按钮不透明度[0-100]</Text>
                    <TextInput style={{...style.input, color}}
                        keyboardType="numeric"
                        value={((menuInactiveOpacity ?? 0) * 100).toString()}
                        onChangeText={(text) => dispatch(updateTheme({menuInactiveOpacity: Number(text)/100}))}
                        />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>菜单栏图标风格</Text>
                    <Tag color={menuIconStyle === MenuIconStyle.OUTLINE ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({menuIconStyle: MenuIconStyle.OUTLINE}))}>
                        拟物
                    </Tag>
                    <Tag color={menuIconStyle === MenuIconStyle.FLAT ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({menuIconStyle: MenuIconStyle.FLAT}))} >
                        扁平
                    </Tag>
                    <Tag color={menuIconStyle === MenuIconStyle.LINE ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({menuIconStyle: MenuIconStyle.LINE}))} >
                        线性
                    </Tag>
                    <Tag color={menuIconStyle === MenuIconStyle.EMOJI ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({menuIconStyle: MenuIconStyle.EMOJI}))} >
                        表情
                    </Tag>
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>显示视频链接</Text>
                    <Switch value={showVideoLink}
                        onChange={() => { dispatch(updateShowVideoLink(!showVideoLink)) }} />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>显示外部播放器</Text>
                    <Switch value={showExternalPlayer}
                        onChange={() => { dispatch(updateTheme({showExternalPlayer: !showExternalPlayer})) }} />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>导航栏标题居中(默认居左, 仅安卓)</Text>
                    <Switch value={headerTitleAlign === 'center'}
                        onChange={updateTitleAlign} />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>显示模式</Text>
                    <Tag color={colorScheme === ColorScheme.Auto ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({colorScheme: ColorScheme.Auto}))}>
                        跟随系统
                    </Tag>
                    <Tag color={colorScheme === ColorScheme.Dark ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({colorScheme: ColorScheme.Dark}))} >
                        深色模式
                    </Tag>
                    <Tag color={colorScheme === ColorScheme.Light ? "red" : "gold"}
                        onPress={_ => dispatch(updateTheme({colorScheme: ColorScheme.Light}))}>
                        浅色模式
                    </Tag>
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>字体配置</Text>
                    {isOS(OSType.iOS) || isOS(OSType.macOS) ?
                    <Pressable onPress={onBrowseFont}>
                    <Text style={{...style.browser, ...theme}}>
                        浏览
                    </Text>
                    </Pressable>
                    : null}
                    <SelectView
                        style={{inputAndroid: {minWidth: "50%", ...theme}, inputIOS: {...theme}}}
                        value={fontName}
                        items={fontList}
                        onValueChange={(font) => dispatch(updateTheme({fontFamily: font}))} />
                </View>
            </ScrollView>
        </View>
    )
}