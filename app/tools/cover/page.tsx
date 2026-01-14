'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useCoverAudio } from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { ArrowLeft, Music } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CoverToolPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { mutate: coverAudio, isLoading } = useCoverAudio()

  const [audioId, setAudioId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleCover = async () => {
    if (!audioId.trim()) {
      toast.error('Please enter audio ID')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter cover prompt')
      return
    }

    try {
      const data = await coverAudio({
        audio_id: audioId,
        prompt: prompt,
      })
      setResult(data)
      toast.success('Cover created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create cover')
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
            <div className="p-3 bg-pink-400/20 rounded-lg">
              <Music className="text-pink-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Upload & Cover</h1>
              <p className="text-gray-400">Create a cover with a different style</p>
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
                  placeholder="Enter the audio ID to cover"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get this from your music library or previous generation
                </p>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the new style for the cover (e.g., 'Jazz version with smooth piano', 'Heavy metal cover with electric guitar')"
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {prompt.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleCover}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {isLoading ? 'Creating Cover...' : 'Create Cover'}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">Cover Created</h2>
              <div className="space-y-4">
                <p className="text-gray-400">
                  Job ID: <span className="text-white font-mono">{result.id}</span>
                </p>
                {result.data && (
                  <>
                    {result.data.audio_url && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Preview</p>
                        <audio
                          controls
                          src={result.data.audio_url}
                          className="w-full"
                        />
                      </div>
                    )}
                    {result.data.metadata && (
                      <div className="text-sm text-gray-400">
                        <p>Model: {result.data.metadata.model}</p>
                        <p>Duration: {result.data.metadata.duration}s</p>
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
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>Enter the audio ID you want to cover</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>Describe the new style for the cover</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>AI will create a new version in the specified style</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <span>Download and save your cover</span>
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
