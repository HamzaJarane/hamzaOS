import { useEffect, useMemo, useRef, useState } from "react";
import type Webamp from "webamp";
import { useFoldersStore } from "@/stores/folders";
import { useWindowsStore } from "@/stores/windows";
import { loadWebAmpAssets } from "@/helpers/assetsHelper";
import useInvoke from "@/helpers/hooks/useInvoke";

declare global {
    interface Window {
        Webamp: typeof Webamp;
        WebAmpRef: Webamp;
    }
}

function WebampPlayer() {
    const divRef = useRef<HTMLDivElement | null>(null);
    const webamp = useRef<Webamp | null>(null);
    const webNodeRef = useRef<HTMLDivElement | null>(null);
    const [isRendered, setIsRendered] = useState(false);
    const { getFileOfType, selectedFiles } = useFoldersStore();
    const { windows, updateActiveWindow } = useWindowsStore();
    const file = useMemo(() => getFileOfType(['.mp3']), [selectedFiles]);
    const WebAmpWindowOrder = useMemo(() => windows[5].window.order, [windows[5].window.order]);

    const conf = {
        initialTracks: [
            {
                metaData: {
                    artist: "",
                    title: file?.name.split('.')[0]
                },
                url: file?.staticPath
            }
        ]
    };

    useEffect(() => {
        if (!webamp.current && divRef.current) {
            useInvoke(async () => {
                await loadWebAmpAssets().then(() => {
                    if(!window.Webamp.browserIsSupported()) {
                        return console.error("[INFO] webamp is not supported in this browser");
                    }

                    if (typeof window.Webamp !== 'undefined') {
                        if (divRef.current) {
                            const isExist = document.querySelectorAll('#webamp');
                            if (!isExist.length) {
                                // @ts-ignore this is valid
                                webamp.current = window.WebAmpRef = new window.Webamp(conf);
                                webamp.current.renderWhenReady(divRef.current).finally(() => setIsRendered(true));
                                webamp.current.onClose(() => updateActiveWindow(undefined));
                            }
                        }
                    } else {
                        console.log('[INFO] window.Webamp is undefined');
                    }
                })
            });
        }

        return () => {
            webamp.current?.dispose();
        };
    }, [divRef]);

    useEffect(() => {
        const updateWebAmpWindowOrder = () => updateActiveWindow('webamp');
        if (isRendered) {
            setTimeout(() => {
                webNodeRef.current = document.querySelector('#webamp');
                if (webNodeRef.current) {
                    console.log('[WEBAMP] Node was found, appending');

                    webNodeRef.current.style.zIndex = `${60 - WebAmpWindowOrder}`;
                    webNodeRef.current.style.transitionProperty = `width,height,opacity`;
                    webNodeRef.current.style.transitionTimingFunction = `cubic-bezier(0.4, 0, 0.2, 1)`;
                    webNodeRef.current.style.transitionDuration = `150ms`;

                    webNodeRef.current.addEventListener('mousedown', updateWebAmpWindowOrder);
                } else {
                    console.log('[WEBAMP] Node was not found');
                }
            }, 200);
        };

        return () => {
            webNodeRef.current?.removeEventListener('mousedown', updateWebAmpWindowOrder);
        }
    }, [webNodeRef.current, isRendered]);

    useEffect(() => {
        if (webNodeRef.current) webNodeRef.current.style.zIndex = `${60 - WebAmpWindowOrder}`;
    }, [webNodeRef.current, WebAmpWindowOrder]);

    return (
        <div
            ref={divRef}
        />
    );
}

export default WebampPlayer;