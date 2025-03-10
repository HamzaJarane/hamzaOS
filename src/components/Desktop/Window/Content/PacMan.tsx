import { useEffect, useRef } from 'react'
import tw from 'twin.macro';
import { loadPacManAssets } from '@/helpers/assetsHelper';
import useInvoke from '@/helpers/hooks/useInvoke';

declare global {
    interface Window {
        PACMAN: {
            init: (wrapper: HTMLDivElement, root: string) => void;
            destroy: () => void;
        } | undefined;
        rPACMAN: () => void;
    }
}

function Pacman() {
    const pacmanRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        useInvoke(async () => {
            await loadPacManAssets().then(() => {
                if (pacmanRef.current) {
                    try {
                        window.rPACMAN();
                    } finally {
                        window.PACMAN?.init(pacmanRef.current, "./");
                    }
                }
            });
        });

        return () => {
            window.PACMAN?.destroy();
        }
    }, [pacmanRef]);
    
    return (
        <div css={tw`bg-custom1 w-full h-full cursor-auto overflow-hidden`}>
            {/* 
                Currently there is a bug where the sounds are getting played twice when you close / open pacman window 
                Probably because the audio instances doesnt get destroyed, still working on it.
            */}
            <div ref={pacmanRef}></div>
        </div>
    )
}

export default Pacman;