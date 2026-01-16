'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import LoginModal from '@/components/Auth/LoginModal'
import { ArrowRight, Music, Sparkles, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false)
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/home')
    }
  }, [user, loading, router])

  const featuredSamples = [
    {
      title: 'Pop Bounce',
      genre: 'Pop',
      description: 'Indie pop dengan beat yang catchy',
    },
    {
      title: 'Rock Anthem',
      genre: 'Rock',
      description: 'Powerful rock dengan gitar yang kuat',
    },
    {
      title: 'Jazz Smooth',
      genre: 'Jazz',
      description: 'Jazz yang smooth dan elegan',
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <header className="relative z-10 container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Melodia
          </div>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
          >
            Masuk
          </button>
        </header>

        {/* Hero Section */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent"
          >
            Buat Musik Pro
            <br />
            dalam Hitungan Detik
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
          >
            Dengan kekuatan AI, ciptakan musik profesional hanya dengan
            mengetikkan ide Anda. Tidak perlu keahlian musik, cukup imajinasi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              Mulai Gratis
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => {
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-8 py-4 rounded-xl bg-gray-800 text-white font-semibold text-lg hover:bg-gray-700 transition-colors"
            >
              Pelajari Lebih Lanjut
            </button>
          </motion.div>

          {/* Audio Showcase */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20"
          >
            {featuredSamples.map((sample, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 mx-auto">
                  <Music size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {sample.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{sample.description}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs">
                  {sample.genre}
                </span>
              </div>
            ))}
          </motion.div>

          {/* How It Works */}
          <div id="how-it-works" className="max-w-4xl mx-auto py-20">
            <h2 className="text-4xl font-bold text-center mb-12">
              Cara Kerjanya
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: 'Ketik Ide',
                  description: 'Jelaskan musik yang ingin Anda buat dalam bahasa natural',
                },
                {
                  icon: Music,
                  title: 'Pilih Gaya',
                  description: 'Pilih genre atau biarkan AI memilihkan yang terbaik',
                },
                {
                  icon: Zap,
                  title: 'Jadi Lagu',
                  description: 'Dalam hitungan detik, musik profesional siap didengarkan',
                },
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                      <Icon size={40} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-20 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2024 Melodia. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
