// Custom hooks for API calls with error handling
import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import apiClient from './client'
import toast from 'react-hot-toast'

export function useGenerateMusic() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const generate = async (data: any) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/generate', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Generate error:', error)
      const message =
        error.response?.data?.error ||
        error.message ||
        'Gagal membuat musik'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { generate, loading }
}

export function usePollTaskStatus() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const poll = async (jobId: string) => {
    if (!user) return null

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.get(`/suno/task/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Poll error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { poll, loading }
}

export function useExtendMusic() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const extend = async (audioId: string, continueAt: number, prompt?: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/extend', {
        audio_id: audioId,
        continue_at: continueAt,
        prompt: prompt || '',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Extend error:', error)
      const message = error.response?.data?.error || 'Gagal memperpanjang musik'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { extend, loading }
}

export function useUploadAudio() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const upload = async (file: File, prompt?: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const formData = new FormData()
      formData.append('file', file)
      if (prompt) {
        formData.append('prompt', prompt)
      }

      const response = await apiClient.post('/suno/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Upload error:', error)
      const message = error.response?.data?.error || 'Gagal mengunggah audio'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { upload, loading }
}

export function useCoverAudio() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const cover = async (audioId: string, prompt: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/cover', {
        audio_id: audioId,
        prompt: prompt,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Cover error:', error)
      const message = error.response?.data?.error || 'Gagal membuat cover'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { cover, loading }
}

export function useSeparateVocals() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const separate = async (audioId: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/separate', {
        audio_id: audioId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Separate error:', error)
      const message = error.response?.data?.error || 'Gagal memisahkan vokal'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { separate, loading }
}

export function useGenerateMidi() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const generateMidi = async (audioId: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/midi', {
        audio_id: audioId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('MIDI generation error:', error)
      const message = error.response?.data?.error || 'Gagal mengkonversi ke MIDI'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { generateMidi, loading }
}

export function useConvertToWav() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const convertWav = async (audioId: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/wav', {
        audio_id: audioId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('WAV conversion error:', error)
      const message = error.response?.data?.error || 'Gagal mengkonversi ke WAV'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { convertWav, loading }
}

export function useCreateMusicVideo() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const createVideo = async (audioId: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post('/suno/video', {
        audio_id: audioId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('Video creation error:', error)
      const message = error.response?.data?.error || 'Gagal membuat video'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { createVideo, loading }
}

// Payment/Topup Hook
export function useCreatePayment() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const createPayment = async (amount: number, packageName: string) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu')
      return null
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post(
        '/payment/create-transaction',
        { amount, packageName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      console.error('Payment error:', error)
      const message = error.response?.data?.error || 'Gagal membuat pembayaran'
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { createPayment, isLoading: loading }
}

export function useCheckPaymentStatus() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuthStore()

  const checkStatus = async (orderId: string) => {
    if (!user) return null

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const response = await apiClient.post(
        '/payment/check-status',
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error: any) {
      console.error('Status check error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { checkStatus, isLoading: loading }
}
