import { TabNavigation } from '@global';
import { useAppDispatch, useAppSelector } from '@hook/store';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getActiveMenu, switchToMenu, toggleSwitchSiteDialog } from '@store/menuSlice';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { OSType, isOS } from '@helper/device';
import { useEffect, useMemo, useRef } from 'react';
import { MenuIconStyle, selectThemeBasicStyle, switchRoute, updateMenuBarHeight } from '@store/themeSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIconV1 from '@asset/menu/home.svg';
import HomeIconV2 from '@asset/menu/home_v2.svg';
import HomeIconV3 from '@asset/menu/home_v3.svg';
import HomeIconV4 from '@asset/menu/home_v4.svg';
import SearchIconV1 from '@asset/menu/search.svg';
import SearchIconV2 from '@asset/menu/search_v2.svg';
import SearchIconV3 from '@asset/menu/search_v3.svg';
import SearchIconV4 from '@asset/menu/search_v4.svg';
import StarIconV1 from '@asset/menu/star.svg';
import StarIconV2 from '@asset/menu/star_v2.svg';
import StarIconV3 from '@asset/menu/star_v3.svg';
import StarIconV4 from '@asset/menu/star_v4.svg';
import SettingsIconV1 from '@asset/menu/setting.svg';
import SettingsIconV2 from '@asset/menu/setting_v2.svg';
import SettingsIconV3 from '@asset/menu/setting_v3.svg';
import SettingsIconV4 from '@asset/menu/setting_v4.svg';
import MessageIconV1 from '@asset/menu/message.svg';
import MessageIconV2 from '@asset/menu/message_v2.svg';
import MessageIconV3 from '@asset/menu/message_v3.svg';
import MessageIconV4 from '@asset/menu/message_v4.svg';
import { SvgProps } from 'react-native-svg';
import { AppDispatch } from '@store';

export enum MenuType {
    Home = 'HomeTab',
    Search = 'SearchTab',
    Star = 'StarTab',
    Settings = 'SettingsTab',
    Message = 'MessageTab',
}

export enum MenuIcon {
    Home = 'Home',
    Search = 'Search',
    Star = 'Star',
    Settings = 'Settings',
    Message = 'Message',
}

const IconElement = {
    [MenuIcon.Home]: {
        [MenuIconStyle.OUTLINE]: HomeIconV1,
        [MenuIconStyle.FLAT]: HomeIconV2,
        [MenuIconStyle.LINE]: HomeIconV3,
        [MenuIconStyle.EMOJI]: HomeIconV4,
    },
    [MenuIcon.Search]: {
        [MenuIconStyle.OUTLINE]: SearchIconV1,
        [MenuIconStyle.FLAT]: SearchIconV2,
        [MenuIconStyle.LINE]: SearchIconV3,
        [MenuIconStyle.EMOJI]: SearchIconV4,
    },
    [MenuIcon.Star]: {
        [MenuIconStyle.OUTLINE]: StarIconV1,
        [MenuIconStyle.FLAT]: StarIconV2,
        [MenuIconStyle.LINE]: StarIconV3,
        [MenuIconStyle.EMOJI]: StarIconV4,
    },
    [MenuIcon.Settings]: {
        [MenuIconStyle.OUTLINE]: SettingsIconV1,
        [MenuIconStyle.FLAT]: SettingsIconV2,
        [MenuIconStyle.LINE]: SettingsIconV3,
        [MenuIconStyle.EMOJI]: SettingsIconV4,
    },
    [MenuIcon.Message]: {
        [MenuIconStyle.OUTLINE]: MessageIconV1,
        [MenuIconStyle.FLAT]: MessageIconV2,
        [MenuIconStyle.LINE]: MessageIconV3,
        [MenuIconStyle.EMOJI]: MessageIconV4,
    },
}

const style = StyleSheet.create({
    menuBar: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'white',
        shadowColor: 'gray',
        shadowRadius: 1.75,
        elevation: 1.5,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 0
        },
        paddingTop: 8,
        paddingBottom: 2.5,
        alignItems: 'center',
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    },
    menuItem: {
        flex: 1,
        alignItems: 'center',
        textAlign: 'center',
    },
    icon: {
        height: 25,
        aspectRatio: 1,
        opacity: 0.25,
    },
    title: {
        marginTop: 2.5,
        fontWeight: 'light',
        fontSize: 11,
    },
    activeIcon: {
        height: 25,
        aspectRatio: 1,
        tintColor: undefined,
    },
});

export interface MenuProps {
    icon: MenuIcon;
    name: string;
    title?: string;
    type: MenuType;
    onLongPress?: (dispatch: AppDispatch) => void;
}

const menu: MenuProps[] = [
    {
        icon: MenuIcon.Search,
        name: 'Search',
        title: "搜索",
        type: MenuType.Search
    },
    {
        icon: MenuIcon.Star,
        name: 'Star',
        title: "收藏",
        type: MenuType.Star
    },
    {
        icon: MenuIcon.Home,
        name: 'Home',
        title: "主页",
        type: MenuType.Home,
        onLongPress: (dispatch) => {
            dispatch(toggleSwitchSiteDialog())
            console.log('Home long press')
        }
    },
    {
        icon: MenuIcon.Message,
        name: 'Message',
        title: "消息",
        type: MenuType.Message
    },
    {
        icon: MenuIcon.Settings,
        name: 'Settings',
        title: "设置",
        type: MenuType.Settings
    },
];

export function RouteMenuBar() {
    const route = useRoute();
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(switchRoute(route.name));
    }, [route.name]);
    return null;
}

const kIconSize = {
    width: 28,
    height: 25,
}

const kInactiveOpacity = 0.25;
const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

export function MenuBar() {
    const active = useAppSelector(getActiveMenu);
    const backgroundColor = useAppSelector(state => state.theme.backgroundColor);
    const theme = useAppSelector(selectThemeBasicStyle);
    const dispatch = useAppDispatch();
    const navigation: TabNavigation = useNavigation();
    const hideMenuBar = useAppSelector(state => state.theme.hideMenuBar);
    const hideMenuTitle = useAppSelector(state => state.theme.hideMenuTitle);
    const menuIconStyle = useAppSelector(state => state.theme.menuIconStyle);
    const menuBarPaddingOffset = useAppSelector(state => state.theme.menuBarPaddingOffset);
    const insets = useSafeAreaInsets();
    const position = useRef(new Animated.Value(!hideMenuBar ? 0 : 100)).current; // Assuming the height of the component is less than 100

    useEffect(() => {
        Animated.timing(position, {
            toValue: !hideMenuBar ? 0 : 100,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [hideMenuBar]);

    const onActive = (menu: MenuType) => {
        dispatch(switchToMenu(menu));
        navigation.navigate(menu);
    };

    const menuBarStyle = useMemo(() => {
        let result = null
        if (isOS(OSType.Android)) {
            result = {
                ...style.menuBar,
                paddingBottom: menuBarPaddingOffset,
            }
        } else {
            result = {
                ...style.menuBar,
                paddingBottom: insets.bottom + menuBarPaddingOffset,
            }
        }
        return result
    }, [hideMenuBar, menuBarPaddingOffset]);

    const layout = useMemo(() => ({
        title: {
            ...style.title,
            ...theme
        }
    }), [theme]);

    useEffect(() => {
        const menuBarHeight = menuBarStyle.paddingTop + menuBarStyle.paddingBottom + style.icon.height
        dispatch(updateMenuBarHeight(menuBarHeight))
    }, [menuBarStyle])

    const menuItems = useMemo(() =>
        menu.map((item, i) => {
            const Icon = IconElement[item.icon][menuIconStyle ?? MenuIconStyle.OUTLINE] as React.FC<SvgProps>;
            const container = {
                item: {
                    alignItems: 'center',
                    opacity: active === item.type ? 1.0 : kInactiveOpacity,
                } as ViewStyle
            }
            return (
                <Pressable
                    key={i}
                    style={style.menuItem}
                    hitSlop={hitSlop}
                    onLongPress={() => item?.onLongPress?.(dispatch)}
                    onPress={() => onActive(item.type)}>
                    <View style={container.item}>
                        <Icon {...kIconSize} />
                        {hideMenuTitle ? null : <Text style={layout.title} >{item.title}</Text>}
                    </View>
                </Pressable>
            )
        })
        , [menu, active, layout, hideMenuTitle, menuIconStyle])

    return (
        <Animated.View
            style={{ ...menuBarStyle, backgroundColor, transform: [{ translateY: position }] }}>
            {menuItems}
        </Animated.View>
    );
}
