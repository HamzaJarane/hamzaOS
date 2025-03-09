import React, { useCallback, useEffect } from 'react'
import { useWindowsStore } from '@/stores/windows';
import { Menu, Item, Separator, Submenu, useContextMenu, RightSlot } from 'react-contexify';
import 'react-contexify/ReactContexify.css';
import { DESKTOP_CONTEXT_ID } from '@/helpers/contextHelper';
import tw from 'twin.macro';
import { useGeneralStore } from '@/stores/general';
import { availableBackgrounds } from '@/stores/general';
import useThemeStore from "@/styles/useThemeStore";
// import { sortBy, sortMethods, useDesktopStore } from '@/stores/desktop';

type Props = { children: React.ReactNode };

function ContextMenu({ children }: Props) {
    const { activeWindow, windows } = useWindowsStore();
    const { baseColor, setBaseColor } = useThemeStore();
    const { setActiveBackground, activeBackground } = useGeneralStore();
    // const { setSortBy, setSortMethod, sortMethod, sortBy } = useDesktopStore();
    const { show } = useContextMenu({ id: DESKTOP_CONTEXT_ID });

    const matchShortcutR = (e: KeyboardEvent): boolean => (e.key === 'r');

    const showContextMenu = useCallback((event: MouseEvent) => {
        if (activeWindow === undefined) {
            show({ event, props: { key: 'value' } });
        }
    }, [activeWindow]);

    // const sortDesktopIcons = useCallback((by: sortBy | null, method?: sortMethods) => {
    //     if(typeof window !== 'undefined') {
    //         windows.forEach((gWindow) => {
    //             localStorage.setItem(`${gWindow.window.name}.drag.pos.x`, `0`);
    //             localStorage.setItem(`${gWindow.window.name}.drag.pos.y`, `0`);
    //         });
    //     }

    //     if(method) setSortMethod(method);
    //     if(by) setSortBy(by);
    // }, []);

    useEffect(() => {
        document.addEventListener('contextmenu', showContextMenu);
        return () => {
            document.removeEventListener('contextmenu', showContextMenu);
        }
    }, [activeWindow]);

    return (
        <>
            <Menu
                id={DESKTOP_CONTEXT_ID}
                css={tw`z-[50]`}
            >
                {/* <Submenu label="Sort by">
                    <Item disabled={sortBy === 'name'} onClick={() => sortDesktopIcons('name')}>Name</Item>
                    <Item disabled={sortBy === 'category'} onClick={() => sortDesktopIcons('category')}>Group</Item>
                    <Separator />
                    <Item disabled={sortMethod === 'asc'} onClick={() => sortDesktopIcons(null, 'asc')}>Ascending</Item>
                    <Item disabled={sortMethod === 'desc'} onClick={() => sortDesktopIcons(null, 'desc')}>Descending</Item>
                </Submenu> */}

                <Item
                    onClick={() => window.location.reload()}
                    css={tw`text-white`}
                    keyMatcher={matchShortcutR}
                >
                    Reload <RightSlot>R</RightSlot>
                </Item>

                <Separator />

                <Submenu label="Background">
                    <Submenu label="CMatrix">
                        {availableBackgrounds.map(bg => (
                            bg.startsWith('cmatrix') &&
                            <Item
                                disabled={activeBackground === bg}
                                onClick={() => setActiveBackground(bg)}
                                key={bg}
                            >
                                <span css={'text-transform:capitalize;'}>{bg.split('.')[1]}</span>
                            </Item>
                        ))}
                    </Submenu>

                </Submenu>
                <Submenu label="Theme">
                    {["red", "yellow", "orange", "green"].map((color) => (
                        <Item
                            disabled={baseColor === color}
                            key={color}
                            onClick={() => {
                                setBaseColor(color);
                                window.location.reload();
                            }}
                        >
                            <span css={tw`capitalize`}>{color}</span>
                        </Item>
                    ))}
                </Submenu>
            </Menu>
            {children}
        </>
    )
}

export default ContextMenu;