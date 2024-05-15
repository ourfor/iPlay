import { useAppDispatch, useAppSelector } from '@hook/store';
import { toggleSwitchSiteDialog } from '@store/menuSlice';
import { ScrollView, StyleProp, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import Dialog from 'react-native-dialog';
import { Site } from './Site';
import { removeSite, switchToSiteAsync } from '@store/embySlice';
import { selectThemeBasicStyle } from '@store/themeSlice';
import { Device, OSType, isAndroid, isOS } from '@helper/device';
import { useMemo } from 'react';

const style = StyleSheet.create({
    container: {
        maxHeight: "70%",
        maxWidth: "95%",
    },
    list: {
        width: "100%",
        flex: 1,
    },
    zero: {
        margin: 0,
        padding: 0,
    }
})

export function SwitchSiteDialog() {
    const dispatch = useAppDispatch()
    const visible = useAppSelector(state => state.menu.showSwitchSiteDialog)
    const sites = useAppSelector(state => state.emby.sites)
    const site = useAppSelector(state => state.emby.site)
    const theme = useAppSelector(selectThemeBasicStyle)
    const {width: windowWidth, height: windowHeight} = useWindowDimensions()
    const maxHeight = windowHeight * 0.55

    const layout = useMemo(() => ({
        container: {
            minWidth: isOS(OSType.Android) ? null : windowWidth * (Device.isTablet ? 0.45 : 0.75) + 60,
            padding: 0,
            alignItems: "center",
            ...theme,
        } as ViewStyle,
        siteList: {
            minWidth: isOS(OSType.Android) ? null : windowWidth * (Device.isTablet ? 0.42 : 0.65) + 60,
            ...style.list,
            ...theme,
            maxHeight,
        },
        listContainer: (isOS(OSType.Android) ? {
            alignItems: "center",
            paddingLeft: 5,
            paddingRight: 5,
            margin: 0,
        } : {}) as ViewStyle,
        site: {
            minWidth: isOS(OSType.Android) ? null : windowWidth * 0.45,
            width: "97%",
            marginLeft: 0,
            marginRight: 0,
        } as ViewStyle
    }), [theme, windowWidth, maxHeight])

    return (
        <Dialog.Container visible={visible}
            blurStyle={theme}
            headerStyle={style.zero}
            footerStyle={style.zero}
            contentStyle={layout.container}
            onBackdropPress={() => dispatch(toggleSwitchSiteDialog())}>
            <Dialog.Description>
            <ScrollView style={layout.siteList}
                contentContainerStyle={layout.listContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                {sites?.map((s, i) => (
                    <Site key={`${s.id}:${i}`} site={s}
                        style={layout.site}
                        active={s.id === site?.id}
                        onPress={() => dispatch(switchToSiteAsync(s.id))}
                        onDelete={() => dispatch(removeSite(s.id))}
                        theme={theme} />
                ))}
            </ScrollView>
            </Dialog.Description>
        </Dialog.Container>
    );
}
