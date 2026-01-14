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
