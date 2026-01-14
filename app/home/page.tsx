'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { Music, TrendingUp, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  // Mock data - replace with real data from API
  const trendingMusic = [
    {
      id: '1',
      title: 'Pop Bounce',
      tags: 'Pop, Indie',
      duration: 129,
      image_url: '/placeholder-cover.jpg',
      audio_url: '',
    },
  ]

  const recentMusic = []

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-4">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore</h1>

        {/* Trending Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={24} className="text-primary" />
            <h2 className="text-2xl font-semibold">Trending</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingMusic.map((track) => (
              <motion.div
                key={track.id}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl p-4 cursor-pointer group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-800 flex items-center justify-center">
                  <Music size={48} className="text-gray-600" />
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">{track.tags}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock size={24} className="text-primary" />
            <h2 className="text-2xl font-semibold">Terbaru</h2>
          </div>
          {recentMusic.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl">
              <Music size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Belum ada musik yang dibuat
              </p>
              <a
                href="/create"
                className="inline-block px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
              >
                Buat Musik Pertama
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentMusic.map((track) => (
                <div key={track.id} className="glass rounded-2xl p-4">
                  {/* Music card */}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
