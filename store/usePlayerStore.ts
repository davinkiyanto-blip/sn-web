import { create } from 'zustand'
import { MusicRecord } from '@/lib/api/types'

interface PlayerState {
  currentTrack: MusicRecord | null
  isPlaying: boolean
  currentTime: number
  duration: number
  queue: MusicRecord[]
  setCurrentTrack: (track: MusicRecord | null) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  addToQueue: (track: MusicRecord) => void
  nextTrack: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  queue: [],
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),
  nextTrack: () => {
    const { queue } = get()
    if (queue.length > 0) {
      const [next, ...rest] = queue
      set({ currentTrack: next, queue: rest })
    }
  },
}))
