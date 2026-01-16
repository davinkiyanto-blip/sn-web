import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'
import Midtrans from 'midtrans-client'

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    // Get transaction status from Midtrans
    const status = await snap.transactionStatus(orderId)

    // Update payment status in Firestore
    const paymentsQuery = query(collection(db, 'payments'), where('orderId', '==', orderId))
    const snapshot = await getDocs(paymentsQuery)

    if (!snapshot.empty) {
      const paymentDoc = snapshot.docs[0]
      const paymentData = paymentDoc.data()
      
      let newStatus = 'pending'
      if (status.transaction_status === 'settlement' || status.transaction_status === 'capture') {
        newStatus = 'completed'
        
        // Add credits to user
        const userRef = doc(db, 'users', paymentData.userId)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          const creditsPerAmount = 100 // 100 credits per 100k IDR (adjust as needed)
          const creditsToAdd = Math.floor(paymentData.amount / 1000) * creditsPerAmount
          
          await updateDoc(userRef, {
            credits: (userSnap.data().credits || 0) + creditsToAdd,
          })
        }
      } else if (status.transaction_status === 'deny' || status.transaction_status === 'cancel') {
        newStatus = 'failed'
      } else if (status.transaction_status === 'pending') {
        newStatus = 'pending'
      } else if (status.transaction_status === 'expire') {
        newStatus = 'expired'
      } else if (status.transaction_status === 'refund') {
        newStatus = 'refunded'
      }

      await updateDoc(doc(db, 'payments', paymentDoc.id), {
        status: newStatus,
        transactionStatus: status.transaction_status,
        updatedAt: new Date(),
      })
    }

    return NextResponse.json(status)
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}
