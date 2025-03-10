import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AvailableWindows } from '@/stores/windows';
import { useWindowsStore } from '@/stores/windows';
import { useCommandsStore } from '@/stores/commands';
import tw, { styled } from 'twin.macro';
import { CSSProp } from 'styled-components';
import { useGeneralStore } from '@/stores/general';
import { usePersistedLocatedState } from '@/helpers/hooks/usePersistedLocatedState';
import Draggable from 'react-draggable';

const Button = styled.button`
    ${tw`w-[60px] h-[60px] rounded-lg bg-gradient-to-t from-base-600 via-base-800 to-base-900`} 
  
    &:active:hover {
        ${tw`bg-gradient-to-t from-base-700 via-base-900 to-base-900/90`} 
    }
`;

const IconContainer = styled.div`
    ${tw`w-[80px] border border-transparent`}

    &:not(.selected):hover {
        border-radius: 5px;
        border-width: 1px;
        ${tw`border-base-600 bg-base-600/10`}
    }
`;

type Props = { 
    children: React.ReactNode, 
    title: AvailableWindows, 
    css?: CSSProp | undefined, 
    className?: string,
};

function DesktopIcon({ children, css, title, className }: Props) {
    const iconContainerRef = useRef<HTMLDivElement>(null);
    const { toggleWindow, updateActiveWindow } = useWindowsStore();
    const { setCommands } = useCommandsStore();
    const { isUserSelectionActive } = useGeneralStore();

    const [initialXDragPosition, setInitialXDragPosition] = usePersistedLocatedState(`${title}.drag.pos.x`, 0);
    const [initialYDragPosition, setInitialYDragPosition] = usePersistedLocatedState(`${title}.drag.pos.y`, 0);

    const [isCurrentlyDragging, setIsCurrentlyDragging] = useState(false);

    const removeSelected = useCallback(() => {
        if (iconContainerRef.current && iconContainerRef.current.classList.contains('selected')) {
            iconContainerRef.current.classList.remove('selected');
            setIsCurrentlyDragging(false);
        }
    }, [iconContainerRef.current]);

    useEffect(() => {
        document.addEventListener('mousedown', removeSelected);
        return () => {
            document.removeEventListener('mousedown', removeSelected);
        }
    }, []);

    return (
        <Draggable
            // grid={[50, 50]}
            position={{
                x: Number(initialXDragPosition), 
                y: Number(initialYDragPosition),
            }}
            scale={1}
            bounds={'body'}
            onStart={() => setIsCurrentlyDragging(false)}
            onDrag={() => setIsCurrentlyDragging(true)}
            onStop={(_, data) => {
                setInitialXDragPosition(data.lastX);
                setInitialYDragPosition(data.lastY);
            }}
        >
            <IconContainer
                className={`${className ?? ''} UserSelectionItem`}
                onMouseDown={() => updateActiveWindow(title)}
                onMouseEnter={() => {
                    if (!isUserSelectionActive) updateActiveWindow('icons');
                }}
                ref={iconContainerRef}
            >
                <div css={tw`p-2`}>
                    <Button
                        {...{
                            onClick: () => {
                                if (!isCurrentlyDragging) {
                                    toggleWindow(title, true);
                                    updateActiveWindow(title);
                                    if (title === 'konsole') {
                                        setCommands(['cat', 'help']);
                                    }
                                }
                            },
                            css
                        }}
                    >
                        {children}
                    </Button>
                    <div css={tw`text-center capitalize text-white text-xs mt-3`}>{title}</div>
                </div>
            </IconContainer>
        </Draggable>
    )
}

export default DesktopIcon;