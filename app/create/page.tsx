'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import {
  useGenerateMusic,
  usePollTaskStatus,
  useCoverAudio,
  useCustomGenerate,
  useGenerateLyrics,
  useUploadAndCover
} from '@/lib/api/hooks'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import { Music, Disc3, Upload, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

// Using V5 model only
// Genre/Style is now a text input field (comma-separated)

export default function CreatePage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const { generate, loading: generatingMusic } = useGenerateMusic()
  const { poll } = usePollTaskStatus()
  const { cover: coverAudio, loading: isCoverLoading } = useCoverAudio()
  const { customGenerate, loading: customGenerating } = useCustomGenerate()
  const { generateLyrics, loading: generatingLyrics } = useGenerateLyrics()
  const { uploadAndCover, loading: uploadingCover } = useUploadAndCover()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tab state
  const [activeTab, setActiveTab] = useState<'generate' | 'cover'>('generate')

  // Mode state (Simple or Custom)
  const [mode, setMode] = useState<'simple' | 'custom'>('simple')

  // Form data
  const [formData, setFormData] = useState({
    prompt: '',
    title: '',
    style: 'Pop',
    instrumental: false,
    model: 'V5', // Fixed to V5
    lyrics: '', // For custom mode
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [taskUrl, setTaskUrl] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<'pending' | 'processing' | 'done' | 'failed' | null>(null)
  const [musicData, setMusicData] = useState<any>(null)
  const [pollAttempts, setPollAttempts] = useState(0)

  // Cover form state
  const [audioId, setAudioId] = useState('')
  const [coverPrompt, setCoverPrompt] = useState('')
  const [coverResult, setCoverResult] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Poll task status using task_url
  useEffect(() => {
    if (!taskUrl) return

    const MAX_ATTEMPTS = 60 // 5 minutes (60 * 5 seconds)

    const pollOnce = async () => {
      try {
        const response = await poll(taskUrl)
        console.log('Poll response:', response)
        setTaskStatus(response.status)
        setPollAttempts(prev => prev + 1)

        if (response.status === 'done' && response.records && response.records.length > 0) {
          const music = response.records[0]
          setMusicData(music)
          toast.success('Musik berhasil dibuat!')

          // Save to Firestore
          await addDoc(collection(db, 'music'), {
            userId: user?.uid,
            musicId: music.id,
            title: music.title || formData.title || 'Untitled',
            prompt: music.prompt || formData.prompt,
            tags: music.tags || formData.style,
            image_url: music.image_url,
            audio_url: music.audio_url,
            duration: music.duration,
            model: music.model,
            createdAt: Timestamp.now(),
            status: 'done',
          })

          setIsGenerating(false)
          setTaskUrl(null)
          setTaskStatus(null)
          setPollAttempts(0)

          // Reset form
          setFormData({
            prompt: '',
            title: '',
            style: 'Pop',
            instrumental: false,
            model: 'V5',
            lyrics: '',
          })

          // Redirect to library
          setTimeout(() => {
            router.push('/library')
          }, 2000)

          clearInterval(pollInterval)
        } else if (response.status === 'failed') {
          toast.error('Gagal membuat musik')
          setIsGenerating(false)
          setTaskUrl(null)
          setTaskStatus(null)
          setPollAttempts(0)
          clearInterval(pollInterval)
        } else if (pollAttempts >= MAX_ATTEMPTS) {
          toast.error('Timeout: Pembuatan musik melebihi batas waktu')
          setIsGenerating(false)
          setTaskUrl(null)
          setTaskStatus(null)
          setPollAttempts(0)
          clearInterval(pollInterval)
        }
      } catch (error) {
        console.error('Polling error:', error)
        toast.error('Error saat polling status')
        setIsGenerating(false)
        setTaskUrl(null)
        setTaskStatus(null)
        setPollAttempts(0)
        clearInterval(pollInterval)
      }
    }

    // Poll immediately
    pollOnce()

    // Then poll every 5 seconds
    const pollInterval = setInterval(pollOnce, 5000)

    return () => clearInterval(pollInterval)
  }, [taskUrl, user, formData, poll, router])

  const handleGenerateLyrics = async () => {
    if (!formData.prompt) {
      toast.error('Silakan masukkan deskripsi untuk lirik')
      return
    }

    try {
      const result = await generateLyrics(formData.prompt)
      if (result?.lyrics) {
        setFormData({ ...formData, lyrics: result.lyrics })
        toast.success('Lirik berhasil dibuat!')
      }
    } catch (error) {
      console.error('Generate lyrics error:', error)
    }
  }

  const handleGenerate = async () => {
    // Validate character limits
    const promptLimit = mode === 'simple' ? 400 : 5000
    if (formData.prompt.length > promptLimit) {
      toast.error(`Deskripsi melebihi batas ${promptLimit} karakter`)
      return
    }

    if (formData.title.length > 80) {
      toast.error('Judul melebihi batas 80 karakter')
      return
    }

    if (mode === 'custom' && formData.style.length > 1000) {
      toast.error('Genre/Style melebihi batas 1000 karakter')
      return
    }

    if (mode === 'custom' && formData.lyrics.length > 5000) {
      toast.error('Lirik melebihi batas 5000 karakter')
      return
    }

    if (!formData.prompt) {
      toast.error('Silakan masukkan prompt')
      return
    }

    if (mode === 'custom' && !formData.instrumental && !formData.lyrics) {
      toast.error('Silakan masukkan lirik atau generate lirik terlebih dahulu')
      return
    }

    setIsGenerating(true)
    try {
      let result

      if (mode === 'custom') {
        // Custom mode - use lyrics as prompt
        const payload = {
          customMode: true,
          instrumental: formData.instrumental,
          style: formData.style,
          prompt: formData.lyrics,
          title: formData.title || 'Untitled',
          model: formData.model,
          negativeTags: '',
        }
        result = await customGenerate(payload)
      } else {
        // Non-custom mode (Simple) - no style, only prompt
        const payload = {
          customMode: false,
          instrumental: formData.instrumental,
          prompt: formData.prompt,
          model: formData.model,
          negativeTags: '',
        }
        result = await generate(payload)
      }

      setTaskUrl(result.task_url)
      setTaskStatus('pending')
      setPollAttempts(0)
      toast.loading('Membuat musik... (ini mungkin memakan waktu beberapa menit)')
    } catch (error) {
      console.error('Generate error:', error)
      setIsGenerating(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('File harus berupa audio')
        return
      }
      setUploadedFile(file)
      toast.success(`File ${file.name} siap diupload`)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast.error('File harus berupa audio')
        return
      }
      setUploadedFile(file)
      toast.success(`File ${file.name} siap diupload`)
    }
  }

  const handleCover = async () => {
    if (!coverPrompt.trim()) {
      toast.error('Silakan masukkan cover prompt')
      return
    }

    try {
      let data

      if (uploadedFile) {
        // Upload and cover
        data = await uploadAndCover(uploadedFile, coverPrompt)
      } else if (audioId.trim()) {
        // Cover existing audio
        data = await coverAudio({
          audio_id: audioId,
          prompt: coverPrompt,
        })
      } else {
        toast.error('Silakan upload file atau masukkan audio ID')
        return
      }

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
            className={`py-4 px-4 font-semibold transition flex items-center justify-center gap-2 border-b-2 ${activeTab === 'generate'
              ? 'text-white border-primary bg-white/5'
              : 'text-gray-400 border-white/10 hover:bg-white/5'
              }`}
          >
            <Music size={20} />
            Generate
          </button>
          <button
            onClick={() => setActiveTab('cover')}
            className={`py-4 px-4 font-semibold transition flex items-center justify-center gap-2 border-b-2 ${activeTab === 'cover'
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
              {/* Modern Loading State with Real-time Status */}
              {isGenerating && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-black/80 to-primary/10 border border-white/20 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
                    {/* Animated Spinner */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-spin"></div>
                      <div className="absolute inset-2 rounded-full bg-black"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Music className="w-10 h-10 text-primary animate-pulse" />
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Membuat Musik
                    </h2>

                    {/* Status Display */}
                    <div className="mb-4">
                      {taskStatus === 'pending' && (
                        <div className="flex items-center justify-center gap-2 text-yellow-400">
                          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                          <p className="text-sm font-medium">⏳ Menunggu antrian...</p>
                        </div>
                      )}
                      {taskStatus === 'processing' && (
                        <div className="flex items-center justify-center gap-2 text-blue-400">
                          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                          <p className="text-sm font-medium">🎵 Sedang membuat musik...</p>
                        </div>
                      )}
                      {!taskStatus && (
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                          <p className="text-sm font-medium">Memulai...</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-pulse rounded-full"
                        style={{
                          width: taskStatus === 'pending' ? '30%' : taskStatus === 'processing' ? '60%' : '10%',
                          transition: 'width 0.5s ease-in-out'
                        }}>
                      </div>
                    </div>

                    {/* Info Text */}
                    <p className="text-gray-400 text-sm mb-2">
                      Estimasi waktu: 1-5 menit
                    </p>
                    <p className="text-gray-500 text-xs">
                      Polling attempt: {pollAttempts}/60
                    </p>
                  </div>
                </div>
              )}

              {/* Main Form */}
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Section 1: Mode Selection */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold">Pilih Mode</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode('simple')}
                      className={`py-4 px-6 rounded-lg font-medium transition border-2 ${mode === 'simple'
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                        }`}
                    >
                      <div className="text-base font-semibold mb-1">🎵 Simple</div>
                      <div className="text-xs text-gray-400">Buat dari deskripsi</div>
                    </button>
                    <button
                      onClick={() => setMode('custom')}
                      className={`py-4 px-6 rounded-lg font-medium transition border-2 ${mode === 'custom'
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                        }`}
                    >
                      <div className="text-base font-semibold mb-1">✍️ Custom</div>
                      <div className="text-xs text-gray-400">Buat dengan lirik</div>
                    </button>
                  </div>
                </div>

                {/* Section 2: Judul & Opsi */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold">Judul & Opsi</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">Judul (Opsional)</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Berikan judul untuk musik Anda..."
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${formData.title.length > 80 ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
                          }`}
                      />
                    </div>

                    {/* Instrumental Toggle - Only in Custom Mode */}
                    {mode === 'custom' && (
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <label htmlFor="instrumental-switch" className="text-sm font-medium cursor-pointer flex-1">
                          Instrumental (Tanpa vokal)
                        </label>
                        <button
                          id="instrumental-switch"
                          onClick={() => setFormData({ ...formData, instrumental: !formData.instrumental })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black ${formData.instrumental ? 'bg-primary' : 'bg-gray-600'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.instrumental ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 3: Konsep/Deskripsi */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold">
                      {mode === 'simple' ? 'Deskripsi Musik' : 'Deskripsi untuk Lirik'}
                    </h3>
                  </div>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    placeholder={mode === 'simple'
                      ? "Contoh: Musik jazz yang santai dengan piano, Jazz smooth dengan instrumen biola, Pop catchy dengan beat yang energik..."
                      : "Contoh: Lagu tentang cinta yang hilang, tentang perjuangan hidup, dll..."
                    }
                    rows={5}
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition resize-none ${formData.prompt.length > (mode === 'simple' ? 400 : 5000) ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
                      }`}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.prompt.length}/{mode === 'simple' ? '400' : '5000'} karakter
                  </p>
                </div>

                {/* Section 4: Lirik (Custom Mode Only, Hidden when Instrumental) */}
                {mode === 'custom' && !formData.instrumental && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          4
                        </div>
                        <h3 className="text-lg font-semibold">Lirik</h3>
                      </div>
                      <button
                        onClick={handleGenerateLyrics}
                        disabled={!formData.prompt || generatingLyrics}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                      >
                        <Sparkles size={16} />
                        {generatingLyrics ? 'Membuat...' : 'Generate Lirik'}
                      </button>
                    </div>
                    <textarea
                      value={formData.lyrics}
                      onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                      placeholder="Masukkan lirik Anda atau klik 'Generate Lirik' untuk membuat otomatis..."
                      rows={10}
                      className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition resize-none font-mono text-sm ${formData.lyrics.length > 5000 ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
                        }`}
                    />
                    <p className="text-xs text-gray-500 mt-2">{formData.lyrics.length}/5000 karakter</p>
                  </div>
                )}

                {/* Section 5: Genre/Style (Custom Mode Only) */}
                {mode === 'custom' && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        5
                      </div>
                      <h3 className="text-lg font-semibold">Genre/Style</h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Masukkan genre/style (pisahkan dengan koma)
                      </label>
                      <input
                        type="text"
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        placeholder="Contoh: Pop, Rock, Jazz, Electronic"
                        className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition ${formData.style.length > 1000 ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'
                          }`}
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Tips: Pisahkan setiap genre dengan koma (,). Contoh: City Pop, Funk, 80s, Synthpop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.style.length}/1000 karakter
                      </p>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="sticky bottom-4 z-10">
                  <button
                    onClick={handleGenerate}
                    disabled={
                      !formData.prompt ||
                      isGenerating ||
                      (mode === 'custom' && !formData.instrumental && !formData.lyrics) ||
                      formData.prompt.length > (mode === 'simple' ? 400 : 5000) ||
                      formData.title.length > 80 ||
                      (mode === 'custom' && formData.style.length > 1000) ||
                      (mode === 'custom' && formData.lyrics.length > 5000)
                    }
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                  >
                    <Music size={24} />
                    <span className="text-lg">
                      {isGenerating ? 'Membuat Musik...' : 'Buat Musik Sekarang'}
                    </span>
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
                  {/* File Upload Section */}
                  <div>
                    <label className="block text-lg font-semibold mb-3">
                      Upload Audio File
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-white/20 hover:border-primary/50 hover:bg-white/5'
                        }`}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">
                        {uploadedFile ? uploadedFile.name : 'Drag & drop file audio atau klik untuk upload'}
                      </p>
                      <p className="text-sm text-gray-400">
                        {uploadedFile
                          ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
                          : 'Format: MP3, WAV, M4A, dll.'
                        }
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                    {uploadedFile && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedFile(null)
                        }}
                        className="mt-3 text-sm text-red-400 hover:text-red-300 transition"
                      >
                        Hapus file
                      </button>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-sm text-gray-500">ATAU</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* Audio ID Input */}
                  <div>
                    <label className="block text-lg font-semibold mb-3">
                      Audio ID
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
                    disabled={isCoverLoading || uploadingCover}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
                  >
                    {uploadingCover ? 'Mengupload & Membuat Cover...' : isCoverLoading ? 'Membuat Cover...' : 'Buat Cover'}
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



