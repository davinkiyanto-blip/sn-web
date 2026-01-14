'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import {
  Scissors,
  Music,
  Video,
  FileAudio,
  Upload,
  ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ToolsPage() {
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

  const tools = [
    {
      icon: Scissors,
      title: 'Separate Vocals',
      description: 'Pisahkan vokal dan instrumental dari lagu',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
      href: '/tools/separate',
    },
    {
      icon: Music,
      title: 'Convert to MIDI',
      description: 'Konversi audio menjadi file MIDI untuk editing',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20',
      href: '/tools/midi',
    },
    {
      icon: FileAudio,
      title: 'Convert to WAV',
      description: 'Upgrade kualitas audio ke format WAV',
      color: 'text-green-400',
      bgColor: 'bg-green-400/20',
      href: '/tools/wav',
    },
    {
      icon: Video,
      title: 'Create Music Video',
      description: 'Buat video musik otomatis dari audio',
      color: 'text-red-400',
      bgColor: 'bg-red-400/20',
      href: '/tools/video',
    },
    {
      icon: Upload,
      title: 'Upload & Extend',
      description: 'Unggah audio dan perpanjang durasinya',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      href: '/tools/extend',
    },
    {
      icon: Music,
      title: 'Upload & Cover',
      description: 'Unggah audio dan ubah gayanya',
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/20',
      href: '/tools/cover',
    },
  ]

  return (
    <div className="min-h-screen bg-black pb-20 md:pb-4">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Tools</h1>
        <p className="text-gray-400 mb-8">
          Fitur lanjutan untuk mengedit dan memanipulasi musik
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon
            return (
              <a
                key={index}
                href={tool.href}
                className="glass rounded-2xl p-6 hover:scale-105 transition-transform group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-xl ${tool.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon size={28} className={tool.color} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {tool.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{tool.description}</p>
                    <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all">
                      <span className="font-semibold">Coba Sekarang</span>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
