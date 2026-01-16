'use client'

import { useState, useEffect } from 'react'
import { useCreatePayment, useCheckPaymentStatus } from '@/lib/api/hooks'
import { useAuthStore } from '@/store/useAuthStore'
import { CreditCard, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, callback?: any) => void
    }
  }
}

export default function TopUpModal({ isOpen, onClose, onSuccess }: TopUpModalProps) {
  const { createPayment, isLoading: paymentLoading } = useCreatePayment()
  const { checkStatus, isLoading: statusLoading } = useCheckPaymentStatus()
  const { user } = useAuthStore()
  const [selectedPackage, setSelectedPackage] = useState<string>('basic')
  const [isProcessing, setIsProcessing] = useState(false)

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const packages = [
    { id: 'basic', name: 'Basic', amount: 50000, credits: 5000, description: '5,000 credits' },
    { id: 'pro', name: 'Pro', amount: 100000, credits: 12000, description: '12,000 credits', popular: true },
    { id: 'enterprise', name: 'Enterprise', amount: 250000, credits: 35000, description: '35,000 credits' },
  ]

  const selectedPkg = packages.find(p => p.id === selectedPackage)

  const handleTopUp = async () => {
    if (!selectedPkg) return
    
    setIsProcessing(true)
    try {
      const paymentResponse = await createPayment(selectedPkg.amount, selectedPkg.name)

      if (paymentResponse.snapToken && window.snap) {
        window.snap.pay(paymentResponse.snapToken, {
          onSuccess: async (result: any) => {
            // Check payment status
            const status = await checkStatus(paymentResponse.orderId)
            if (status) {
              toast.success('Pembayaran berhasil! Credits telah ditambahkan.')
              onSuccess?.()
              onClose()
            }
          },
          onPending: () => {
            toast.loading('Menunggu pembayaran...')
          },
          onError: () => {
            toast.error('Pembayaran gagal')
          },
          onClose: () => {
            toast.error('Pembayaran dibatalkan')
          },
        })
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-white/10 rounded-xl max-w-2xl w-full">
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <CreditCard className="text-indigo-400" size={28} />
            <h2 className="text-2xl font-bold">Top Up Credits</h2>
          </div>
          <p className="text-gray-400 mt-2">Pilih paket untuk menambah credits Anda</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition ${
                  selectedPackage === pkg.id
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                      Popular
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-semibold">{pkg.name}</h3>
                <p className="text-2xl font-bold mt-2 text-indigo-400">Rp {pkg.amount.toLocaleString('id-ID')}</p>
                <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>

                {selectedPackage === pkg.id && (
                  <div className="mt-4 flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                    Selected
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          {selectedPkg && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Package</span>
                  <span>{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Amount</span>
                  <span>Rp {selectedPkg.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Credits</span>
                  <span className="font-semibold text-indigo-400">{selectedPkg.credits.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span>Total</span>
                  <span className="font-bold">Rp {selectedPkg.amount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-400">
              💡 Pembayaran diproses melalui Midtrans. Pilihan pembayaran: Transfer Bank, E-wallet, Cicilan.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleTopUp}
              disabled={isProcessing || paymentLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {isProcessing || paymentLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Top Up Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
