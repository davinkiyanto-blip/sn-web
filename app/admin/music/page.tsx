'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import AdminLayout from '@/components/Layout/AdminLayout'
import { Music, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

interface MusicItem {
  id: string
  title: string
  userId: string
  style: string
  model: string
  duration: number
  status: string
  createdAt: any
}

export default function AdminMusicPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [music, setMusic] = useState<MusicItem[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState({
    totalMusic: 0,
    processingMusic: 0,
    completedMusic: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const musicQuery = query(collection(db, 'music'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(musicQuery)
        
        const musicData: MusicItem[] = []
        let total = 0
        let processing = 0
        let completed = 0

        snapshot.forEach((doc) => {
          const data = doc.data()
          musicData.push({
            id: doc.id,
            title: data.title || 'Untitled',
            userId: data.userId,
            style: data.style || 'N/A',
            model: data.model || 'N/A',
            duration: data.duration || 0,
            status: data.status || 'unknown',
            createdAt: data.createdAt,
          })

          total++
          if (data.status === 'processing') processing++
          if (data.status === 'done') completed++
        })

        setMusic(musicData)
        setStats({
          totalMusic: total,
          processingMusic: processing,
          completedMusic: completed,
        })
        setDataLoading(false)
      } catch (error) {
        console.error('Failed to fetch music:', error)
        setDataLoading(false)
      }
    }

    if (user) {
      fetchMusic()
    }
  }, [user])

  const handleDeleteMusic = async (musicId: string) => {
    if (!confirm('Are you sure you want to delete this music?')) return

    try {
      await deleteDoc(doc(db, 'music', musicId))
      setMusic(music.filter(m => m.id !== musicId))
      toast.success('Music deleted')
    } catch (error) {
      console.error('Failed to delete music:', error)
      toast.error('Failed to delete music')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-400/20 text-green-300'
      case 'processing':
        return 'bg-blue-400/20 text-blue-300'
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-300'
      case 'error':
        return 'bg-red-400/20 text-red-300'
      default:
        return 'bg-gray-400/20 text-gray-300'
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate?.() || new Date(date)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (dataLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Music Management</h1>
          <p className="text-gray-400 mt-2">All generated music tracks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Music</p>
                <p className="text-3xl font-bold mt-2">{stats.totalMusic}</p>
              </div>
              <Music className="text-purple-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold mt-2">{stats.completedMusic}</p>
              </div>
              <Music className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Processing</p>
                <p className="text-3xl font-bold mt-2">{stats.processingMusic}</p>
              </div>
              <Music className="text-blue-400" size={32} />
            </div>
          </div>
        </div>

        {/* Music Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Style</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Model</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {music.length > 0 ? (
                music.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-semibold truncate max-w-xs">{item.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{item.style}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{item.model}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteMusic(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-semibold transition flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No music tracks yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
