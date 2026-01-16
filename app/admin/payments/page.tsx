'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import AdminLayout from '@/components/Layout/AdminLayout'
import { DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

interface Payment {
  id: string
  userId: string
  orderId: string
  amount: number
  packageName: string
  status: 'completed' | 'pending' | 'failed' | 'expired'
  createdAt: any
  transactionStatus?: string
}

export default function AdminPaymentsPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedPayments: 0,
    pendingPayments: 0,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsQuery = query(collection(db, 'payments'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(paymentsQuery)
        
        const paymentsData: Payment[] = []
        let totalRevenue = 0
        let completedCount = 0
        let pendingCount = 0

        snapshot.forEach((doc) => {
          const data = doc.data()
          paymentsData.push({
            id: doc.id,
            userId: data.userId,
            orderId: data.orderId,
            amount: data.amount,
            packageName: data.packageName,
            status: data.status || 'pending',
            createdAt: data.createdAt,
            transactionStatus: data.transactionStatus,
          })

          if (data.status === 'completed') {
            totalRevenue += data.amount
            completedCount++
          } else if (data.status === 'pending') {
            pendingCount++
          }
        })

        setPayments(paymentsData)
        setStats({
          totalRevenue,
          completedPayments: completedCount,
          pendingPayments: pendingCount,
        })
        setDataLoading(false)
      } catch (error) {
        console.error('Failed to fetch payments:', error)
        setDataLoading(false)
      }
    }

    if (user) {
      fetchPayments()
    }
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={20} />
      case 'pending':
        return <Clock className="text-yellow-400" size={20} />
      case 'failed':
      case 'expired':
        return <XCircle className="text-red-400" size={20} />
      default:
        return <Clock className="text-gray-400" size={20} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400/20 text-green-300'
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-300'
      case 'failed':
      case 'expired':
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
      hour: '2-digit',
      minute: '2-digit',
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
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-400 mt-2">Transaction history and revenue tracking</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-bold mt-2">{stats.completedPayments}</p>
              </div>
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingPayments}</p>
              </div>
              <Clock className="text-amber-400" size={32} />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Package</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-white/5 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-300">
                      {payment.orderId.substring(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm">{payment.packageName}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      Rp {payment.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No payments yet
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
