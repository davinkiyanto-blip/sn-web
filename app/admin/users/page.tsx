'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import AdminLayout from '@/components/Layout/AdminLayout'
import { Trash2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, deleteDoc, doc, updateDoc, where } from 'firebase/firestore'

interface User {
  id: string
  displayName: string
  email: string
  credits: number
  createdAt: any
  totalMusic: number
  status: 'active' | 'suspended'
}

export default function AdminUsersPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [creditsToAdd, setCreditsToAdd] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'))
        const snapshot = await getDocs(usersQuery)
        
        const usersData: User[] = []
        for (const userDoc of snapshot.docs) {
          const musicQuery = query(collection(db, 'music'), where('userId', '==', userDoc.id))
          const musicSnapshot = await getDocs(musicQuery)
          
          usersData.push({
            id: userDoc.id,
            displayName: userDoc.data().displayName || 'Unknown',
            email: userDoc.data().email || 'N/A',
            credits: userDoc.data().credits || 0,
            createdAt: userDoc.data().createdAt,
            totalMusic: musicSnapshot.size,
            status: userDoc.data().status || 'active',
          })
        }
        
        setUsers(usersData)
        setDataLoading(false)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('Failed to load users')
        setDataLoading(false)
      }
    }

    if (user) {
      fetchUsers()
    }
  }, [user])

  const handleAddCredits = async () => {
    if (!selectedUser) return
    
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        credits: selectedUser.credits + creditsToAdd,
      })
      
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, credits: u.credits + creditsToAdd }
          : u
      ))
      
      toast.success(`Added ${creditsToAdd} credits to ${selectedUser.displayName}`)
      setShowModal(false)
      setCreditsToAdd(0)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to update credits:', error)
      toast.error('Failed to add credits')
    }
  }

  const handleSuspendUser = async (userId: string) => {
    if (!confirm('Are you sure you want to suspend this user?')) return
    
    try {
      const user = users.find(u => u.id === userId)
      const newStatus = user?.status === 'suspended' ? 'active' : 'suspended'
      
      await updateDoc(doc(db, 'users', userId), {
        status: newStatus,
      })
      
      setUsers(users.map(u => 
        u.id === userId 
          ? { ...u, status: newStatus }
          : u
      ))
      
      toast.success(`User ${newStatus}`)
    } catch (error) {
      console.error('Failed to update user status:', error)
      toast.error('Failed to update user')
    }
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users Management</h1>
          <span className="text-gray-400">Total: {users.length} users</span>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Credits</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Music</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4 text-sm">{user.displayName}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{user.credits}</td>
                  <td className="px-6 py-4 text-sm">{user.totalMusic}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active' 
                        ? 'bg-green-400/20 text-green-300'
                        : 'bg-red-400/20 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowModal(true)
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-semibold transition"
                      >
                        Add Credits
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className={`px-3 py-1 rounded text-xs font-semibold transition ${
                          user.status === 'active'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Restore'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Credits Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-white/10 rounded-xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add Credits</h2>
              <p className="text-gray-400 mb-6">User: {selectedUser.displayName}</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Credits Amount</label>
                <input
                  type="number"
                  value={creditsToAdd}
                  onChange={(e) => setCreditsToAdd(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
                <p className="text-xs text-gray-500 mt-2">Current: {selectedUser.credits}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedUser(null)
                    setCreditsToAdd(0)
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCredits}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Add Credits
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
