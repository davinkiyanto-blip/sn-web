'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/usePlayerStore'
import { Play, Pause, SkipForward, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const WaveSurfer = dynamic(() => import('wavesurfer.js'), { ssr: false })

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
  const waveformRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<any>(null)
  const [isSeeking, setIsSeeking] = useState(false)

  // Initialize WaveSurfer with current track
  useEffect(() => {
    if (!waveformRef.current || !currentTrack) return

    const initWaveSurfer = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default

      // Clean up previous instance
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy()
      }

      const waveSurfer = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: '#6366f1',
        progressColor: '#a855f7',
        height: 60,
        barWidth: 2,
        barRadius: 3,
        barGap: 2,
        normalize: true,
        fillParent: true,
        interact: true,
        autoplay: false,
      })

      const proxyUrl = `/api/download?url=${encodeURIComponent(currentTrack.audio_url)}&inline=true`
      waveSurfer.load(proxyUrl)

      waveSurfer.on('ready', () => {
        setDuration(waveSurfer.getDuration())
      })

      waveSurfer.on('timeupdate', (currentTime: number) => {
        if (!isSeeking) {
          setCurrentTime(currentTime)
        }
      })

      waveSurfer.on('interaction', () => {
        setIsSeeking(false)
      })

      waveSurferRef.current = waveSurfer
    }

    initWaveSurfer()

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy()
      }
    }
  }, [currentTrack, setDuration, setCurrentTime])

  // Handle play/pause
  useEffect(() => {
    if (waveSurferRef.current) {
      if (isPlaying) {
        waveSurferRef.current.play()
      } else {
        waveSurferRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle seek
  useEffect(() => {
    if (waveSurferRef.current && isSeeking && duration) {
      waveSurferRef.current.seekTo(currentTime / duration)
    }
  }, [currentTime, duration, isSeeking])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleWaveformClick = () => {
    setIsSeeking(true)
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentTrack) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 md:bottom-4 md:left-4 md:right-4 md:rounded-xl md:border md:border-white/10"
      >
        <audio ref={audioRef} crossOrigin="anonymous" />
        <div className="container mx-auto max-w-4xl px-4 py-4">
          {/* Waveform */}
          <div
            ref={waveformRef}
            className="rounded-lg overflow-hidden cursor-pointer mb-4 hover:opacity-80 transition-opacity"
            onMouseDown={handleWaveformClick}
            onMouseUp={() => setIsSeeking(false)}
            onMouseLeave={() => setIsSeeking(false)}
          />

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Cover Art & Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {currentTrack.image_url ? (
                  <img
                    src={currentTrack.image_url}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">♪</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">
                  {currentTrack.title || 'Untitled'}
                </h4>
                <p className="text-sm text-gray-400 truncate">
                  {currentTrack.style || 'Generated Music'}
                </p>
              </div>
            </div>

            {/* Play Button */}
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors flex-shrink-0"
            >
              {isPlaying ? (
                <Pause size={20} className="text-white" />
              ) : (
                <Play size={20} className="text-white fill-white" />
              )}
            </button>

            {/* Skip Button */}
            <button
              onClick={() => nextTrack()}
              className="p-3 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <SkipForward size={20} className="text-gray-300" />
            </button>

            {/* Time Display */}
            <div className="text-xs text-gray-400 flex-shrink-0 min-w-[80px] text-right">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setCurrentTrack(null)}
              className="p-3 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <X size={20} className="text-gray-300" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
