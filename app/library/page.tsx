'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { usePlayerStore } from '@/store/usePlayerStore'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { Play, MoreVertical, Download, Share2, Edit, Music } from 'lucide-react'
import { motion } from 'framer-motion'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function LibraryPage() {
  const { user, loading } = useAuthStore()
  const { setCurrentTrack } = usePlayerStore()
  const router = useRouter()
  const [musicList, setMusicList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Load user's music from Firestore
  useEffect(() => {
    if (user) {
      loadUserMusic()
    }
  }, [user])

  const loadUserMusic = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const q = query(
        collection(db, 'music'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const music = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
      setMusicList(music)
    } catch (error) {
      console.error('Error loading music:', error)
      toast.error('Gagal memuat musik')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = (track: any) => {
    setCurrentTrack(track)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-4">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Library Saya</h1>

        {musicList.length === 0 ? (
          <div className="text-center py-20 glass rounded-2xl">
            <p className="text-gray-400 mb-6 text-lg">
              Belum ada musik di library Anda
            </p>
            <a
              href="/create"
              className="inline-block px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
            >
              Buat Musik Pertama
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicList.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative aspect-square bg-gray-800">
                  {track.image_url ? (
                    <img
                      src={track.image_url}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🎵</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handlePlay(track)}
                      className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Play size={24} className="text-white ml-1" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {track.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3 truncate">
                    {track.tags || 'No tags'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {Math.floor(track.duration || 0)}s
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlay(track)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Putar"
                      >
                        <Play size={16} className="text-gray-400" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download size={16} className="text-gray-400" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Bagikan"
                      >
                        <Share2 size={16} className="text-gray-400" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        title="Opsi lainnya"
                      >
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
