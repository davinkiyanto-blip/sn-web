'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import AdminLayout from '@/components/Layout/AdminLayout'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Music, DollarSign, TrendingUp } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore'

export default function AdminDashboard() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMusic: 0,
    totalRevenue: 0,
    activeUsers: 0,
  })
  const [chartData, setChartData] = useState<Array<{ name: string; users: number; music: number }>>([])
  const [modelData, setModelData] = useState<Array<{ name: string; value: number; color: string }>>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const usersQuery = query(collection(db, 'users'))
        const usersSnapshot = await getDocs(usersQuery)
        const totalUsers = usersSnapshot.size

        // Get total music
        const musicQuery = query(collection(db, 'music'))
        const musicSnapshot = await getDocs(musicQuery)
        const totalMusic = musicSnapshot.size

        // Get total revenue from payments
        const paymentsQuery = query(collection(db, 'payments'), where('status', '==', 'completed'))
        const paymentsSnapshot = await getDocs(paymentsQuery)
        let totalRevenue = 0
        paymentsSnapshot.forEach((doc) => {
          totalRevenue += doc.data().amount || 0
        })

        // Get active users (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        const activeQuery = query(
          collection(db, 'music'),
          where('createdAt', '>=', sevenDaysAgo)
        )
        const activeSnapshot = await getDocs(activeQuery)
        const activeUsers = new Set(activeSnapshot.docs.map((doc) => doc.data().userId)).size

        setStats({
          totalUsers,
          totalMusic,
          totalRevenue: Math.round(totalRevenue),
          activeUsers,
        })

        // Mock chart data - replace with real data from Firestore
        setChartData([
          { name: 'Jan', users: 120, music: 240 },
          { name: 'Feb', users: 135, music: 280 },
          { name: 'Mar', users: 150, music: 320 },
          { name: 'Apr', users: 165, music: 350 },
          { name: 'May', users: 180, music: 400 },
          { name: 'Jun', users: 200, music: 450 },
        ])

        // Model usage distribution
        setModelData([
          { name: 'V3.5', value: 25, color: '#6366f1' },
          { name: 'V4', value: 35, color: '#a855f7' },
          { name: 'V4.5', value: 30, color: '#ec4899' },
          { name: 'V5', value: 10, color: '#f59e0b' },
        ])

        setDataLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setDataLoading(false)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user])

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome to Melodia Admin Panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>

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
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">Rp {stats.totalRevenue.toLocaleString('id-ID')}</p>
              </div>
              <DollarSign className="text-green-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users (7d)</p>
                <p className="text-3xl font-bold mt-2">{stats.activeUsers}</p>
              </div>
              <TrendingUp className="text-yellow-400" size={32} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User & Music Growth */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Growth Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="music" stroke="#a855f7" strokeWidth={2} name="Music Generated" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Model Distribution */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Model Usage</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }: { name?: string; value: number }) => `${name ?? ''} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {modelData.map((entry: { color: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-400">Avg Music per User</span>
              <span className="font-semibold">{stats.totalUsers > 0 ? (stats.totalMusic / stats.totalUsers).toFixed(2) : 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-400">Average Revenue per User</span>
              <span className="font-semibold">Rp {stats.totalUsers > 0 ? (stats.totalRevenue / stats.totalUsers).toLocaleString('id-ID') : 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <span className="text-gray-400">User Engagement Rate</span>
              <span className="font-semibold">{stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
