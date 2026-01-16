'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGenerateMidi } from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { ArrowLeft, Music } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MidiToolPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { generateMidi, loading: isLoading } = useGenerateMidi()

  const [audioId, setAudioId] = useState('')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleConvert = async () => {
    if (!audioId.trim()) {
      toast.error('Please enter audio ID')
      return
    }

    try {
      const data = await generateMidi({ audio_id: audioId })
      setResult(data)
      toast.success('MIDI file generated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate MIDI')
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
            <div className="p-3 bg-purple-400/20 rounded-lg">
              <Music className="text-purple-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Convert to MIDI</h1>
              <p className="text-gray-400">Convert audio to MIDI format for DAW editing</p>
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
                  placeholder="Enter the audio ID to convert"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get this from your music library or previous generation
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleConvert}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                {isLoading ? 'Converting...' : 'Convert to MIDI'}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">MIDI File Ready</h2>
              <div className="space-y-4">
                {result.data && result.data.midi_url && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Download MIDI</p>
                    <a
                      href={result.data.midi_url}
                      download
                      className="inline-block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
                    >
                      Download MIDI File
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-12 bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-4">How it works</h3>
            <ol className="space-y-3 text-gray-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>Enter the audio ID you want to convert</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>AI analyzes the melody and harmony</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>Generate MIDI notes and sequences</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <span>Use in your DAW for further editing</span>
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
