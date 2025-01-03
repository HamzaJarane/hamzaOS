import React, { useEffect, useState } from 'react'
import Hat from '@/assets/hat.svg?react';
import { useGeneralStore } from '@/stores/general';
import tw from 'twin.macro';
import useThemeStore from '@/styles/useThemeStore';

type Props = { children: React.ReactNode };

function Loading({ children }: Props) {
    const { desktopStatus } = useGeneralStore();
    const [loaded, setLoaded] = useState(false);
    const { rbgAt600 } = useThemeStore();

    useEffect(() => {
        setTimeout(() => setLoaded(true), 1700);
    }, [desktopStatus]);

    return (
        <>
            <div
                css={[
                    tw`fixed z-[9999] h-screen w-screen flex justify-center items-center space-x-2 bg-black transition-all ease-in-out duration-700 overflow-hidden`,
                    loaded && tw`h-0 opacity-0`,
                ]}
            >
                <Hat
                    fill={rbgAt600}
                    css={tw`w-[40%] lg:w-[20%]`}
                />
                <div
                    css={[
                        tw`text-5xl lg:text-9xl`,
                    ]}
                    style={{ 
                        color: rbgAt600,
                    }}
                >
                    hamzaOS
                </div>
            </div>
            {loaded && children}
        </>
    )
}

export default Loading;