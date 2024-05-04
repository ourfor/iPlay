import { Pressable, StyleSheet, View } from "react-native";
import { useAppDispatch, useAppSelector } from "@hook/store";
import { useCallback } from "react";
import { getAvatarUrl } from "@store/embySlice";
import { Image } from "@view/Image";
import { toggleSwitchSiteDialog } from "@store/menuSlice";
import FemaleIcon from "@asset/female_avatar.svg"

const hitSlop = {top: 10, bottom: 10, left: 10, right: 10}

const style = StyleSheet.create({
    root: {
        flexDirection: 'row',
        transform: [
            {translateY: 1}
        ]
    },
    avator: {
        width: 32,
        height: 32,
        borderWidth: 1,
        overflow: 'hidden',
        borderRadius: 16,
        borderColor: 'lightgray',
    }
})

export function HeaderRightAction() {
    const avatorUrl = useAppSelector(getAvatarUrl)
    const site = useAppSelector(state => state.emby?.site)
    const dispatch = useAppDispatch()
    const showSiteSelect = useCallback(() => {
        dispatch(toggleSwitchSiteDialog())
    }, [dispatch])
    if (!site) return null
    return (
        <View style={style.root}>
            <Pressable hitSlop={hitSlop} onPress={showSiteSelect}>
            <Image style={style.avator} 
                source={{uri: avatorUrl }}
                fallbackElement={
                    <FemaleIcon 
                        style={style.avator}
                        width={style.avator.width} 
                        height={style.avator.height}
                     />
                }
            />
            </Pressable>
        </View>
    );
}
