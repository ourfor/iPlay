import { PropsWithNavigation } from "@global";
import { Version } from "@helper/device";
import { Toast } from "@helper/toast";
import { useAppDispatch, useAppSelector } from "@hook/store";
import { clearCurrentSiteSource } from "@store/embySlice";
import { selectThemeBasicStyle } from "@store/themeSlice";
import { Image, clearImageCache } from "@view/Image";
import { StatusBar } from "@view/StatusBar";
import { Button, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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


export function Page(props: PropsWithNavigation<"default">) {
    const theme = useAppSelector(selectThemeBasicStyle)
    const pagePaddingTop = useAppSelector(state => state.theme.pagePaddingTop)
    const dispatch = useAppDispatch()
    const clearSiteCache = () => {
        Toast.show({
            text1: "清空站点缓存成功",
            type: "success"
        })
        dispatch(clearCurrentSiteSource())
    }
    const clearCache = () => {
        Toast.show({
            text1: "清空图片缓存成功",
            type: "success"
        })
        clearImageCache();
    }
    return (
        <View style={{...style.page, ...theme, paddingTop: pagePaddingTop}}>
            <StatusBar />
            <View style={style.inline}>
                <Text style={{...style.label, ...theme}}>图片缓存可以加快图片显示</Text>
                <Button title="清空图片缓存" onPress={clearCache} />
            </View>
            <View style={style.inline}>
                <Text style={{...style.label, ...theme}}>如果出现异常，可以尝试清空站点缓存</Text>
                <Button title="清空站点缓存" onPress={clearSiteCache} />
            </View>
        </View>
    )
}