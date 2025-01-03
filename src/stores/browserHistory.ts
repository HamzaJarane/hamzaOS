import { create } from 'zustand'
import { DEFAULT_HISTORY_URL } from '@/helpers/historyHelper';

export const bookMarks = [
    DEFAULT_HISTORY_URL,
    'https://hamza.im',
    'https://www.wikipedia.org/',
] as const;

export type BookMarks = (typeof bookMarks)[number];

export interface IBrowserHistoryStore {
    currentLink: string;
    searchLinksHistory: string[];

    setCurrentLink: (currentLink: string) => void;
    setLinksHistory: (searchLinksHistory: string[]) => void;
    addLinkHistory: (searchLinkHistory: string) => void;
}

export const useBrowserHistoryStore = create<IBrowserHistoryStore>((set) => ({
    currentLink: DEFAULT_HISTORY_URL,
    searchLinksHistory: [DEFAULT_HISTORY_URL],

    setCurrentLink: (currentLink) => set(() => ({ currentLink })),
    setLinksHistory: (searchLinksHistory) => set(() => ({ searchLinksHistory })),
    addLinkHistory: (searchLinkHistory) => set(({ searchLinksHistory }) => ({ searchLinksHistory: [...searchLinksHistory || [], searchLinkHistory] })),
}));