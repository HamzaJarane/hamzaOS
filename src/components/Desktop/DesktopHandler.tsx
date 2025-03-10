import React, { useEffect, type RefObject } from 'react'
import { useGeneralStore } from '@/stores/general'
import StartButtons from '@/components/Global/StartButtons';
import BootUp from '@/components/BootUp';
import Loading from '@/components/Loading';
import ShutDown from '@/components/ShutDown';
import WindowContainer from '@/components/Desktop/Window/Window';
import { useWindowsStore } from '@/stores/windows';
import UserSelectionHandler from '@/components/Desktop/UserSelectionHandler';
import ContextMenu from '@/components/Desktop/ContextMenu';
import useThemeStore from "@/styles/useThemeStore";
import tw from 'twin.macro';

type Props = { children: React.ReactNode, selectAbleContainerRef: RefObject<HTMLDivElement> };

function DesktopHandler({ children, selectAbleContainerRef }: Props) {
    const { desktopStatus } = useGeneralStore();
    const { windows, updateWindowPos, updateWindowSize } = useWindowsStore();
    const { baseColor } = useThemeStore();

    useEffect(() => {
        console.log("[INFO] Setting up the initial size and pos for all windows");
        windows.forEach((gWindow) => {
            const sizeWidth = Number(localStorage.getItem(`${gWindow.window.name}.size.width`));
            const sizeHeight = Number(localStorage.getItem(`${gWindow.window.name}.size.height`));
            const posX = Number(localStorage.getItem(`${gWindow.window.name}.pos.x`));
            const posY = Number(localStorage.getItem(`${gWindow.window.name}.pos.y`));

            if (sizeHeight && sizeWidth) {
                updateWindowSize(gWindow.window.name, { width: sizeWidth, height: sizeHeight });
            };

            if (posX && posY) {
                updateWindowPos(gWindow.window.name, { x: posX, y: posY });
            };
        });
    }, []);

    switch (desktopStatus) {
        case 'started':
            return (
                <Loading>
                    <UserSelectionHandler {...{ selectAbleContainerRef }}>
                        <ContextMenu>
                            <div css={tw`z-[99]`}>
                                {windows?.map((fWindow, i) =>
                                    (fWindow.window.open) && (
                                        <React.Fragment key={`${i}-${fWindow.window.name}`}>
                                            <WindowContainer window={fWindow}>
                                                <fWindow.windowChildren />
                                            </WindowContainer>
                                        </React.Fragment>
                                    )
                                )}
                            </div>
                            {children}
                        </ContextMenu>
                    </UserSelectionHandler>
                </Loading>
            )

        case 'starting':
            return (
                <div css={tw`p-3`}>
                    <BootUp />
                </div>
            );

        case 'stopping':
            return (
                <div css={tw`p-3`}>
                    <ShutDown />
                </div>
            );

        case 'stopped':
            return (
                <div css={tw`w-screen h-screen flex justify-center items-center`}>
                    <div>
                        <div css={tw`sm:hidden text-center text-white px-2 mb-4`}>This website works better on desktop, click the {baseColor === 'green' ? 'red' : baseColor} button to get to the mobile portfolio.</div>
                        <StartButtons />
                    </div>
                </div>
            );
    }
}

export default DesktopHandler