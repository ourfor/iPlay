import { PropsWithNavigation } from "@global";
import { useAppDispatch, useAppSelector } from "@hook/store";
import { PictureQuality, updateConfig } from "@store/configSlice";
import { selectThemeBasicStyle } from "@store/themeSlice";
import { StatusBar } from "@view/StatusBar";
import { Tag } from "@view/Tag";
import { StyleSheet, Text, View } from "react-native";

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
    const theme = useAppSelector(selectThemeBasicStyle)
    const pagePaddingTop = useAppSelector(state => state.theme.pagePaddingTop)
    const pictureQuality = useAppSelector(state => state.config.picture?.quality ?? PictureQuality.High)
    const dispatch = useAppDispatch()

    return (
        <View style={{ ...style.page, ...theme, paddingTop: pagePaddingTop }}>
            <StatusBar />
            <View style={style.inline}>
                <Text style={{ ...style.label, ...theme }}>加载图片质量</Text>
                <Tag color={pictureQuality === PictureQuality.Low ? "red" : "gold"}
                    onPress={_ => dispatch(updateConfig({ picture: { quality: PictureQuality.Low } }))}>
                    低画质
                </Tag>
                <Tag color={pictureQuality === PictureQuality.Medium ? "red" : "gold"}
                    onPress={_ => dispatch(updateConfig({ picture: { quality: PictureQuality.Medium } }))}>
                    中画质
                </Tag>
                <Tag color={pictureQuality === PictureQuality.High ? "red" : "gold"}
                    onPress={_ => dispatch(updateConfig({ picture: { quality: PictureQuality.High } }))}>
                    高画质
                </Tag>
            </View>
        </View>
    )
}