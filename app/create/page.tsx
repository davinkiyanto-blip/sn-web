'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useGenerateMusic, usePollTaskStatus, useCoverAudio } from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { Music, Disc3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const MODELS = [
  { id: 'V3.5', name: 'V3.5', description: 'Fast & Standard' },
  { id: 'V4', name: 'V4', description: 'Better Quality' },
  { id: 'V4.5', name: 'V4.5', description: 'High Quality' },
  { id: 'V4.5PLUS', name: 'V4.5 Plus', description: 'Enhanced' },
  { id: 'V5', name: 'V5', description: 'Latest' },
]

const STYLES = [
  'Pop', 'Rock', 'Jazz', 'Hip-Hop', 'EDM', 'Classical', 'R&B', 'Country',
  'Indie', 'Folk', 'Metal', 'Electronic', 'Soul', 'Reggae', 'Latin', 'Blues'
]

export default function CreatePage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { generate, loading: generatingMusic } = useGenerateMusic()
  const { poll } = usePollTaskStatus()
  const { cover: coverAudio, loading: isCoverLoading } = useCoverAudio()

  // Tab state
  const [activeTab, setActiveTab] = useState<'generate' | 'cover'>('generate')
  
  // Form data
  const [formData, setFormData] = useState({
    prompt: '',
    title: '',
    style: 'Pop',
    instrumental: false,
    model: 'V4',
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [pollingStatus, setPollingStatus] = useState<any>(null)

  // Cover form state
  const [audioId, setAudioId] = useState('')
  const [coverPrompt, setCoverPrompt] = useState('')
  const [coverResult, setCoverResult] = useState<any>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Poll task status
  useEffect(() => {
    if (!jobId) return

    const pollInterval = setInterval(async () => {
      try {
        const status = await poll(jobId)
        setPollingStatus(status)
        
        if (status.data && status.data.status === 'done') {
          toast.success('Musik berhasil dibuat!')
          
          // Save to Firestore
          await addDoc(collection(db, 'music'), {
            userId: user?.uid,
            title: formData.title || 'Untitled',
            prompt: formData.prompt,
            style: formData.style,
            image_url: status.data.image_url,
            audio_url: status.data.audio_url,
            duration: status.data.duration,
            createdAt: Timestamp.now(),
            status: 'done',
            model: formData.model,
          })
          
          setIsGenerating(false)
          setJobId(null)
          setFormData({
            prompt: '',
            title: '',
            style: 'Pop',
            instrumental: false,
            model: 'V4',
          })
          
          setTimeout(() => {
            router.push('/library')
          }, 2000)
        } else if (status.data && status.data.status === 'error') {
          toast.error('Gagal membuat musik')
          setIsGenerating(false)
          setJobId(null)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 2000)

    return () => clearInterval(pollInterval)
  }, [jobId, user, formData, poll, router])

  const handleGenerate = async () => {
    if (!formData.prompt) {
      toast.error('Silakan masukkan prompt')
      return
    }

    setIsGenerating(true)
    try {
      const payload = {
        prompt: formData.prompt,
        title: formData.title,
        style: formData.style,
        model: formData.model,
        instrumental: formData.instrumental,
      }

      const result = await generate(payload)
      setJobId(result.id)
      toast.loading('Membuat musik... (ini mungkin memakan waktu beberapa menit)')
    } catch (error) {
      console.error('Generate error:', error)
      setIsGenerating(false)
    }
  }

  const handleCover = async () => {
    if (!audioId.trim()) {
      toast.error('Silakan masukkan audio ID')
      return
    }
    if (!coverPrompt.trim()) {
      toast.error('Silakan masukkan cover prompt')
      return
    }

    try {
      const data = await coverAudio({
        audio_id: audioId,
        prompt: coverPrompt,
      })
      setCoverResult(data)
      toast.success('Cover berhasil dibuat!')
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat cover')
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
      <div className="min-h-[calc(100vh-200px)] flex flex-col">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 gap-0 mb-0">
          <button
            onClick={() => setActiveTab('generate')}
            className={`py-4 px-4 font-semibold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'generate'
                ? 'text-white border-primary bg-white/5'
                : 'text-gray-400 border-white/10 hover:bg-white/5'
            }`}
          >
            <Music size={20} />
            Generate
          </button>
          <button
            onClick={() => setActiveTab('cover')}
            className={`py-4 px-4 font-semibold transition flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'cover'
                ? 'text-white border-primary bg-white/5'
                : 'text-gray-400 border-white/10 hover:bg-white/5'
            }`}
          >
            <Disc3 size={20} />
            Cover
          </button>
        </div>

        <div className="container mx-auto px-4 py-8 flex-1">

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <>
            {/* Loading State */}
            {isGenerating && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-black border border-white/10 rounded-xl p-8 max-w-md w-full text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Membuat Musik</h2>
                  <p className="text-gray-400 mb-4">Ini mungkin memakan waktu 1-5 menit...</p>
                  {pollingStatus?.data?.status === 'processing' && (
                    <p className="text-sm text-gray-500">Status: Processing</p>
                  )}
                </div>
              </div>
            )}

            {/* Main Form */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column - Prompt */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <label className="block text-lg font-semibold mb-4">
                    Deskripsi Musik <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder="Contoh: Musik jazz yang santai dengan piano, Jazz smooth dengan instrumen biola, Pop catchy dengan beat yang energik..."
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">{formData.prompt.length}/500 karakter</p>
                </div>

                {/* Title */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                  <label className="block text-lg font-semibold mb-4">Judul (Opsional)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Berikan judul untuk musik Anda..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>

              {/* Right Column - Settings */}
              <div className="space-y-6">
                {/* Model Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <label className="block text-sm font-semibold mb-3">Model</label>
                  <div className="space-y-2">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setFormData({ ...formData, model: m.id })}
                        className={`w-full p-3 rounded-lg border transition text-left text-sm ${
                          formData.model === m.id
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-xs text-gray-400">{m.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <label className="block text-sm font-semibold mb-3">Genre/Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STYLES.map((style) => (
                      <button
                        key={style}
                        onClick={() => setFormData({ ...formData, style })}
                        className={`py-2 px-3 rounded-lg text-xs transition font-medium ${
                          formData.style === style
                            ? 'bg-primary text-white'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Instrumental Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.instrumental}
                      onChange={(e) => setFormData({ ...formData, instrumental: e.target.checked })}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="text-sm font-medium">Instrumental</span>
                  </label>
                  <p className="text-xs text-gray-400 mt-2">(Tanpa vokal)</p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={!formData.prompt || isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Music size={20} />
                  Buat Musik
                </button>
              </div>
            </div>
          </>
        )}

        {/* Cover Tab */}
        {activeTab === 'cover' && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="space-y-6">
                {/* Audio ID Input */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Audio ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={audioId}
                    onChange={(e) => setAudioId(e.target.value)}
                    placeholder="Masukkan audio ID untuk di-cover"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Dapatkan dari library musik atau generasi sebelumnya
                  </p>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-lg font-semibold mb-3">
                    Cover Prompt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={coverPrompt}
                    onChange={(e) => setCoverPrompt(e.target.value)}
                    placeholder="Jelaskan gaya baru untuk cover (contoh: 'Versi jazz dengan piano smooth', 'Heavy metal cover dengan gitar elektrik')"
                    rows={8}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {coverPrompt.length}/500 karakter
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCover}
                  disabled={isCoverLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                >
                  {isCoverLoading ? 'Membuat Cover...' : 'Buat Cover'}
                </button>
              </div>
            </div>

            {/* Result */}
            {coverResult && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                <h2 className="text-xl font-semibold mb-4">Cover Berhasil Dibuat</h2>
                <div className="space-y-4">
                  <p className="text-gray-400">
                    Job ID: <span className="text-white font-mono">{coverResult.id}</span>
                  </p>
                  {coverResult.data && (
                    <>
                      {coverResult.data.audio_url && (
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Preview</p>
                          <audio
                            controls
                            src={coverResult.data.audio_url}
                            className="w-full"
                          />
                        </div>
                      )}
                      {coverResult.data.metadata && (
                        <div className="text-sm text-gray-400">
                          <p>Model: {coverResult.data.metadata.model}</p>
                          <p>Duration: {coverResult.data.metadata.duration}s</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-8">
              <h3 className="text-lg font-semibold mb-4">Cara Kerjanya</h3>
              <ol className="space-y-3 text-gray-400">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                  <span>Masukkan audio ID yang ingin di-cover</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                  <span>Jelaskan gaya baru untuk cover</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                  <span>AI akan membuat versi baru sesuai gaya yang diminta</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                  <span>Download dan simpan cover Anda</span>
                </li>
              </ol>
            </div>
          </div>
        )}
        </div>
      </div>

      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
