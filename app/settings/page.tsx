'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import Header from '@/components/Layout/Header'
import BottomNav from '@/components/Layout/BottomNav'
import AudioPlayer from '@/components/Player/AudioPlayer'
import TopUpModal from '@/components/Payment/TopUpModal'
import { User, CreditCard, Bell, Shield, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth, db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [credits, setCredits] = useState(0)
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Fetch credits from Firestore
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits || 0)
        }
        setDataLoading(false)
      } catch (error) {
        console.error('Failed to fetch credits:', error)
        setDataLoading(false)
      }
    }

    if (user) {
      fetchCredits()
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Berhasil keluar')
      router.push('/')
    } catch (error) {
      toast.error('Gagal keluar')
    }
  }

  if (loading || dataLoading) {
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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* Profile Section */}
        <section className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-20 h-20 rounded-full border-2 border-primary shadow-lg shadow-primary/30 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center border-2 border-primary shadow-lg shadow-primary/30">
                <User size={40} className="text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user.displayName || 'User'}
              </h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Settings Sections */}
        <div className="space-y-4">
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Kredit & Limit</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Kredit Tersedia</span>
                <span className="text-white font-semibold">{credits.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Limit Harian</span>
                <span className="text-white font-semibold">10 / 10</span>
              </div>
              <button 
                onClick={() => setShowTopUpModal(true)}
                className="w-full mt-4 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
              >
                Top Up Kredit
              </button>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Notifikasi</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-400">Notifikasi Email</span>
                <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-400">Notifikasi Push</span>
                <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
              </label>
            </div>
          </section>

          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-primary" />
              <h3 className="text-lg font-semibold">Privasi & Keamanan</h3>
            </div>
            <div className="space-y-3">
              <a
                href="/privacy"
                className="block py-2 text-gray-400 hover:text-white transition-colors"
              >
                Kebijakan Privasi
              </a>
              <a
                href="/terms"
                className="block py-2 text-gray-400 hover:text-white transition-colors"
              >
                Syarat & Ketentuan
              </a>
            </div>
          </section>

          <button
            onClick={handleSignOut}
            className="w-full glass rounded-2xl p-6 flex items-center gap-3 hover:bg-red-500/20 transition-colors group"
          >
            <LogOut size={24} className="text-red-400 group-hover:text-red-300" />
            <span className="text-red-400 group-hover:text-red-300 font-semibold">
              Keluar
            </span>
          </button>
        </div>
      </div>

      {/* TopUp Modal */}
      <TopUpModal 
        isOpen={showTopUpModal} 
        onClose={() => setShowTopUpModal(false)}
        onSuccess={() => {
          // Refresh credits
          const fetchCredits = async () => {
            if (!user) return
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid))
              if (userDoc.exists()) {
                setCredits(userDoc.data().credits || 0)
              }
            } catch (error) {
              console.error('Failed to fetch credits:', error)
            }
          }
          fetchCredits()
        }}
      />

      <BottomNav />
      <AudioPlayer />
    </div>
  )
}
