import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify Midtrans signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || ''
    const orderId = body.order_id
    const statusCode = body.status_code
    const grossAmount = body.gross_amount
    const transactionStatus = body.transaction_status

    const signatureKey = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex')

    if (signatureKey !== body.signature_key) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Update payment status in Firestore
    const paymentsQuery = query(collection(db, 'payments'), where('orderId', '==', orderId))
    const snapshot = await getDocs(paymentsQuery)

    if (snapshot.empty) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const paymentDoc = snapshot.docs[0]
    const paymentData = paymentDoc.data()

    let newStatus = 'pending'
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      newStatus = 'completed'

      // Add credits to user
      const userRef = doc(db, 'users', paymentData.userId)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const creditsPerAmount = 100
        const creditsToAdd = Math.floor(paymentData.amount / 1000) * creditsPerAmount

        await updateDoc(userRef, {
          credits: (userSnap.data().credits || 0) + creditsToAdd,
        })
      }
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel') {
      newStatus = 'failed'
    } else if (transactionStatus === 'expire') {
      newStatus = 'expired'
    } else if (transactionStatus === 'refund') {
      newStatus = 'refunded'
    }

    await updateDoc(doc(db, 'payments', paymentDoc.id), {
      status: newStatus,
      transactionStatus,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
