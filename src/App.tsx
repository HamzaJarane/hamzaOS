import Desktop from "@/components/Desktop/Desktop";
import DesktopHandler from "@/components/Desktop/DesktopHandler";
import '@/App.css';
import { useRef, useEffect } from "react";
import { Helmet as Meta } from "react-helmet";
import TaskBar from "@/components/Desktop/TaskBar/TaskBar";
import { useWindowsStore } from "./stores/windows";
import Background from "@/components/Desktop/Backgrounds";
import useThemeStore from "@/styles/useThemeStore";
import tw, { styled } from 'twin.macro';
import { loadBrowserDetectorAssets } from "./helpers/assetsHelper";
import useAsynced from "./helpers/hooks/useAsynced";

declare global {
  interface Window {
      getBrowsers: {
          isOpera: boolean;
          isFirefox: boolean;
          isSafari: boolean;
          isIE: boolean;
          isEdge: boolean;
          isChrome: boolean;
          isEdgeChromium: boolean;
          isBlink: boolean;
      }
  }
}

const Container = tw.div`w-screen h-screen flex justify-center items-center`;

export default function App() {
  const selectAbleContainerRef = useRef<HTMLDivElement>(null);
  const { activeWindow } = useWindowsStore();
  const { baseColor } = useThemeStore();

  useEffect(() => {
    console.log("[INFO] Importing browser detector assets")
    useAsynced(async () => await loadBrowserDetectorAssets());
  }, []);

  return (
    <div data-theme={baseColor}>
      <DesktopHandler {...{ selectAbleContainerRef }}>
        <Desktop {...{ selectAbleContainerRef }} />
        <Meta>
          <title>hamzaOS{(activeWindow && activeWindow !== 'startmenu' && activeWindow !== 'icons') ? ` - ${activeWindow.charAt(0).toUpperCase() + activeWindow.slice(1)}` : ''}</title>
        </Meta>
        <Container>
          <Background />
        </Container>
        <TaskBar />
      </DesktopHandler>
    </div>
  );
}
