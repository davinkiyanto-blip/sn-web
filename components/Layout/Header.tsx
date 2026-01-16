'use client'

import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, User } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import toast from 'react-hot-toast'

export default function Header() {
  const { user } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast.success('Berhasil keluar')
    } catch (error) {
      toast.error('Gagal keluar')
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/home" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Melodia
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-10 h-10 rounded-full border-2 border-primary shadow-lg shadow-primary/30 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-primary shadow-lg shadow-primary/30">
                <User size={20} className="text-white" />
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              title="Keluar"
            >
              <LogOut size={20} className="text-gray-400" />
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white font-semibold"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  )
}
