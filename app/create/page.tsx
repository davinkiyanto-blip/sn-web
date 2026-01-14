'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { useGenerateMusic, usePollTaskStatus } from '@/lib/api/hooks'
import { GenerateMusicRequest } from '@/lib/api/types'
import toast from 'react-hot-toast'
import { Loader2, Wand2 } from 'lucide-react'

export default function CreatePage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { generate, loading: isGenerating } = useGenerateMusic()
  const { poll } = usePollTaskStatus()
  const [mode, setMode] = useState<'simple' | 'custom'>('simple')
  const [formData, setFormData] = useState<GenerateMusicRequest>({
    customMode: false,
    instrumental: false,
    prompt: '',
    model: 'V5',
    style: '',
    title: '',
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.prompt.trim()) {
      toast.error('Silakan masukkan prompt')
      return
    }

    try {
      const response = await generate(formData)
      if (response?.ok) {
        toast.success('Musik sedang dibuat!')
        // Start polling for status
        pollTaskStatus(response.jobId)
      }
    } catch (error) {
      // Error already handled in hook
    }
  }

  const pollTaskStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const data = await poll(jobId)
        if (!data) return

        if (data.status === 'done' && data.records) {
          clearInterval(interval)
          toast.success('Musik selesai dibuat!')
          router.push('/library')
        } else if (data.status === 'error') {
          clearInterval(interval)
          toast.error('Gagal membuat musik')
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 5000) // Poll every 5 seconds

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000)
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Buat Musik Baru</h1>

        {/* Mode Toggle */}
        <div className="glass rounded-2xl p-1 mb-6 flex gap-2">
          <button
            onClick={() => {
              setMode('simple')
              setFormData({ ...formData, customMode: false })
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
              mode === 'simple'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Simple
          </button>
          <button
            onClick={() => {
              setMode('custom')
              setFormData({ ...formData, customMode: true })
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
              mode === 'custom'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Custom
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Deskripsi Musik
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) =>
                setFormData({ ...formData, prompt: e.target.value })
              }
              placeholder="Jelaskan lagu yang ingin Anda buat..."
              className="w-full h-32 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none"
              maxLength={mode === 'simple' ? 400 : 5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.prompt.length} / {mode === 'simple' ? 400 : 5000}
            </p>
          </div>

          {mode === 'custom' && (
            <>
              {/* Title Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Judul (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Judul lagu"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  maxLength={80}
                />
              </div>

              {/* Style Input */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                  Gaya/Genre
                </label>
                <input
                  type="text"
                  value={formData.style}
                  onChange={(e) =>
                    setFormData({ ...formData, style: e.target.value })
                  }
                  placeholder="Pop, Rock, Jazz, dll"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                  maxLength={mode === 'custom' ? 1000 : 200}
                />
              </div>

              {/* Instrumental Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="instrumental"
                  checked={formData.instrumental}
                  onChange={(e) =>
                    setFormData({ ...formData, instrumental: e.target.checked })
                  }
                  className="w-5 h-5 rounded accent-primary"
                />
                <label htmlFor="instrumental" className="text-gray-300">
                  Hanya Instrumental (tanpa vokal)
                </label>
              </div>
            </>
          )}

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Model
            </label>
            <select
              value={formData.model}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  model: e.target.value as any,
                })
              }
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-primary"
            >
              <option value="V3_5">V3.5</option>
              <option value="V4">V4</option>
              <option value="V4_5">V4.5</option>
              <option value="V4_5PLUS">V4.5 Plus</option>
              <option value="V5">V5 (Recommended)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating || !formData.prompt.trim()}
            className="w-full py-4 rounded-xl bg-gradient-primary text-white font-semibold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Membuat Musik...
              </>
            ) : (
              <>
                <Wand2 size={20} />
                Buat Musik
              </>
            )}
          </button>
        </form>
      </div>
      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
