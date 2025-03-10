import { type RefObject, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DesktopIcon from './DesktopIcon';
import { useWindowsStore, type IAvailableWindows } from '@/stores/windows';
import tw from 'twin.macro';
// import { useDesktopStore } from '@/stores/desktop';

type Props = { selectAbleContainerRef: RefObject<HTMLDivElement> };

function Desktop({ selectAbleContainerRef }: Props) {
    const { windows } = useWindowsStore();
    const [currentWindows, setCurrentWindows] = useState<IAvailableWindows[]>(windows);
    const { updateActiveWindow } = useWindowsStore();
    // const { sortMethod, sortBy } = useDesktopStore();

    // useEffect(() => {
    //     switch (sortBy) {
    //         case "name":
    //             setCurrentWindows((currentWindows) => {
    //                 return currentWindows.sort((a, b) => {
    //                     const nameA = a.window.name.toUpperCase();
    //                     const nameB = b.window.name.toUpperCase();
    //                     if (nameA < nameB) return -1;
    //                     if (nameA > nameB) return 1;
    //                     return 0;
    //                 });
    //             });
    //             break;
    //         case "category":
    //             setCurrentWindows((currentWindows) => {
    //                 return currentWindows.sort((a, b) => {
    //                     const nameA = a.window.category.toUpperCase();
    //                     const nameB = b.window.category.toUpperCase();
    //                     if (nameA < nameB) return -1;
    //                     if (nameA > nameB) return 1;
    //                     return 0;
    //                 });
    //             });
    //             break;
    //     }

    //     switch (sortMethod) {
    //         case "asc":
    //             setCurrentWindows((currentWindows) => currentWindows);
    //             break;
    //         case "desc":
    //             setCurrentWindows((currentWindows) => currentWindows.reverse());
    //             break;
    //     }
    // }, [sortBy, sortMethod]);

    return (
        <div
            onMouseDown={() => updateActiveWindow(undefined)}
            ref={selectAbleContainerRef} 
            css={tw`z-[9] fixed h-screen w-screen`}
        >
            <div css={tw`grid grid-cols-2 gap-2 h-fit w-fit`}>
                {currentWindows.filter((fWindow) => !fWindow.window.hidden.desktop).map((fWindow, index) => (
                    <DesktopIcon 
                        key={`${index}-${fWindow.window.name}`} 
                        title={fWindow.window.name} 
                        css={tw`${fWindow.desktop.className || ''}`}
                    >
                        <FontAwesomeIcon css={`${fWindow.desktop.child.css || ''}`} icon={fWindow.desktop.child.icon} />
                    </DesktopIcon>
                ))}
            </div>
        </div>
    )
}

export default Desktop;