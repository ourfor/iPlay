import { FontModule } from "@helper/font";
import { useAppDispatch, useAppSelector } from "@hook/store";
import { VideoDecodeType, updateConfig } from "@store/configSlice";
import { updatePlayerState } from "@store/playerSlice";
import { selectThemeBasicStyle } from "@store/themeSlice";
import { SelectView } from "@view/SelectView";
import { StatusBar } from "@view/StatusBar";
import { Tag } from "@view/Tag";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

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
    input: {
        fontSize: 16,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 5,
        marginLeft: 10,
        minWidth: 150,
    }
});

export function Page() {
    const color = useAppSelector(state => state.theme.fontColor);
    const backgroundColor = useAppSelector(state => state.theme.backgroundColor);
    const theme = useAppSelector(selectThemeBasicStyle)
    const fontName = useAppSelector(state => state.player.fontFamily)
    const dispatch = useAppDispatch();
    const maxStreamingBitrate = useAppSelector((state) => state.config.video.MaxStreamingBitrate);
    const decodeType = useAppSelector((state) => state.config.video.Decode);
    const pagePaddingTop = useAppSelector(state => state.theme.pagePaddingTop)
    const [fontList, setFontList] = useState<{label: string, value: string}[]>([])
    
    const updateMaxStreamingBitrate = (text: string) => {
        dispatch(updateConfig(s => {
            s.video.MaxStreamingBitrate = Number(text);
            return s
        }))
    }

    const updateDecodeType = (type: VideoDecodeType) => {
        dispatch(updateConfig(s => {
            s.video.Decode = type;
            return s
        }))
    }

    useEffect(() => {
        FontModule.fontFamilyListAsync()
            .then(fontNames => {
                const items = fontNames.sort().map(f => ({label: f, value: f}))
                setFontList(items)
            })
    }, [])

    return (
        <View style={{...style.page, backgroundColor, paddingTop: pagePaddingTop}}>
            <StatusBar />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{flex: 1, backgroundColor}}>
                <View style={style.inline}>
                    <Text style={{...style.label, color}}>视频流比特率</Text>
                    <TextInput style={{...style.input, ...theme}}
                        keyboardType="numeric"
                        placeholderTextColor={color}
                        placeholder={maxStreamingBitrate?.toString()}
                        value={maxStreamingBitrate?.toString()}
                        onChangeText={updateMaxStreamingBitrate}
                        />
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>视频默认解码模式(播放死机调整)</Text>
                    <Tag color={decodeType === VideoDecodeType.Auto ? "red" : "gold"}
                        onPress={_ => updateDecodeType(VideoDecodeType.Auto)}>
                        自动
                    </Tag>
                    <Tag color={decodeType === VideoDecodeType.Hardware ? "red" : "gold"}
                        onPress={_ => updateDecodeType(VideoDecodeType.Hardware)} >
                        硬解
                    </Tag>
                    <Tag color={decodeType === VideoDecodeType.Software ? "red" : "gold"}
                        onPress={_ => updateDecodeType(VideoDecodeType.Software)}>
                        软解
                    </Tag>
                </View>
                <View style={style.inline}>
                    <Text style={{...style.label, ...theme}}>字幕字体</Text>
                    <SelectView
                        style={{inputAndroid: {minWidth: "50%", ...theme}, inputIOS: {...theme}}}
                        value={fontName}
                        items={fontList}
                        onValueChange={(font) => dispatch(updatePlayerState({fontFamily: font}))} />
                </View>
            </ScrollView>
        </View>
    )
}