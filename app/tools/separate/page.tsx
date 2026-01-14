'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useSeparateVocals } from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { ArrowLeft, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SeparateToolPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { mutate: separateVocals, isLoading } = useSeparateVocals()

  const [audioId, setAudioId] = useState('')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSeparate = async () => {
    if (!audioId.trim()) {
      toast.error('Please enter audio ID')
      return
    }

    try {
      const data = await separateVocals({ audio_id: audioId })
      setResult(data)
      toast.success('Vocals separated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to separate vocals')
    }
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
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-400/20 rounded-lg">
              <Scissors className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Separate Vocals</h1>
              <p className="text-gray-400">Split audio into vocals and instrumental tracks</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <div className="space-y-6">
              {/* Audio ID Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Audio ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={audioId}
                  onChange={(e) => setAudioId(e.target.value)}
                  placeholder="Enter the audio ID to separate"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get this from your music library or previous generation
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSeparate}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {isLoading ? 'Separating...' : 'Separate Vocals'}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">Separation Complete</h2>
              <div className="space-y-4">
                {result.data && (
                  <>
                    {result.data.vocals_url && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Vocals Track</p>
                        <audio
                          controls
                          src={result.data.vocals_url}
                          className="w-full"
                        />
                      </div>
                    )}
                    {result.data.instrumental_url && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Instrumental Track</p>
                        <audio
                          controls
                          src={result.data.instrumental_url}
                          className="w-full"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <ol className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>Enter the audio ID you want to separate</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>AI will analyze and split the tracks</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>Get separate vocal and instrumental tracks</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <span>Download and use them independently</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
