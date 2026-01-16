'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useAdminStore } from '@/store/useAdminStore'
import Header from '@/components/Layout/Header'
import { BarChart3, Users, Music, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore()
  const { isAdmin } = useAdminStore()
  const router = useRouter()
  const [adminLoading, setAdminLoading] = useState(true)

  useEffect(() => {
    if (loading) return

    // Check if user is authenticated
    if (!user) {
      router.push('/')
      return
    }

    // Check if user is admin (check Firestore custom claims)
    const checkAdminStatus = async () => {
      try {
        const token = await user.getIdTokenResult()
        const isAdmin = token.claims.admin === true

        if (!isAdmin) {
          toast.error('Admin access only')
          router.push('/')
          return
        }

        setAdminLoading(false)
      } catch (error) {
        console.error('Admin check failed:', error)
        router.push('/')
      }
    }

    checkAdminStatus()
  }, [user, loading, router])

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) return null

  const adminNavItems = [
    { label: 'Dashboard', href: '/admin', icon: BarChart3 },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Music', href: '/admin/music', icon: Music },
    { label: 'Payments', href: '/admin/payments', icon: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white/5 border-r border-white/10 p-6">
          <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition text-gray-300 hover:text-white"
                >
                  <Icon size={20} />
                  {item.label}
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
