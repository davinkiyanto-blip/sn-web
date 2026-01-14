'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { Play, Pause, SkipForward, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setCurrentTrack,
    nextTrack,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      nextTrack()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [setCurrentTime, setDuration, setIsPlaying, nextTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.audio_url
    audio.load()
    setIsPlaying(true)
  }, [currentTrack, setIsPlaying])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800"
      >
        <audio ref={audioRef} />
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Cover Art */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={currentTrack.image_url}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold truncate">
                {currentTrack.title || 'Untitled'}
              </h4>
              <p className="text-gray-400 text-sm truncate">
                {currentTrack.tags?.split(',')[0] || 'Music'}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-full bg-primary hover:bg-primary-dark transition-colors"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <SkipForward size={20} className="text-gray-400" />
              </button>

              <button
                onClick={() => setCurrentTrack(null)}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
