'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useUploadAudio, useExtendMusic } from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { ArrowLeft, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ExtendToolPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { upload: uploadAudio, loading: uploadLoading } = useUploadAudio()
  const { extend: extendMusic, loading: extendLoading } = useExtendMusic()

  const [step, setStep] = useState<'upload' | 'extend'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [uploadedAudioId, setUploadedAudioId] = useState('')
  const [audioId, setAudioId] = useState('')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const data = await uploadAudio(formData)
      setUploadedAudioId(data.id)
      setStep('extend')
      toast.success('Audio uploaded successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload audio')
    }
  }

  const handleExtend = async () => {
    const id = audioId || uploadedAudioId
    if (!id.trim()) {
      toast.error('Please enter or upload an audio first')
      return
    }
    if (!prompt.trim()) {
      toast.error('Please enter extension prompt')
      return
    }

    try {
      const data = await extendMusic({
        audio_id: id,
        prompt: prompt,
      })
      setResult(data)
      toast.success('Music extended successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to extend music')
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
            <div className="p-3 bg-yellow-400/20 rounded-lg">
              <Upload className="text-yellow-400" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Upload & Extend</h1>
              <p className="text-gray-400">Upload audio and extend its duration</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setStep('upload')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                step === 'upload'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              Step 1: Upload
            </button>
            <button
              onClick={() => setStep('extend')}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                step === 'extend'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              Step 2: Extend
            </button>
          </div>

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4">
                    Upload Audio File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label
                      htmlFor="audio-upload"
                      className="cursor-pointer block"
                    >
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-gray-300">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        MP3, WAV, or other audio formats
                      </p>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || uploadLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Audio'}
                </button>
              </div>
            </div>
          )}

          {/* Extend Step */}
          {step === 'extend' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
              <div className="space-y-6">
                {/* Audio ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Audio ID {!uploadedAudioId && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={audioId || uploadedAudioId}
                    onChange={(e) => setAudioId(e.target.value)}
                    placeholder={uploadedAudioId ? `Using uploaded: ${uploadedAudioId}` : 'Enter audio ID'}
                    disabled={!!uploadedAudioId}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition disabled:opacity-50"
                  />
                </div>

                {/* Extension Prompt */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Extension Prompt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe how you want to extend the music (e.g., 'Add a trumpet solo', 'Continue with a chorus')"
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {prompt.length}/500 characters
                  </p>
                </div>

                <button
                  onClick={handleExtend}
                  disabled={extendLoading}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200"
                >
                  {extendLoading ? 'Extending...' : 'Extend Music'}
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold mb-4">Extension Complete</h2>
              <div className="space-y-4">
                <p className="text-gray-400">
                  Job ID: <span className="text-white font-mono">{result.id}</span>
                </p>
                {result.data && result.data.audio_url && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Preview</p>
                    <audio
                      controls
                      src={result.data.audio_url}
                      className="w-full"
                    />
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
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                <span>Upload your audio file</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                <span>Describe how you want to extend it</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                <span>AI creates a seamless extension</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                <span>Download your extended music</span>
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
