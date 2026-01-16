import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import Midtrans from 'midtrans-client'

// Initialize Midtrans Snap
const snap = new Midtrans.Snap()
snap.setConfig({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, packageName } = body

    if (!amount || amount < 10000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create Midtrans transaction
    const orderId = `MELODIA-${user.uid}-${Date.now()}`
    
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: 'User',
        email: 'user@melodia.app',
        phone: '08123456789',
      },
      item_details: [
        {
          id: packageName,
          price: amount,
          quantity: 1,
          name: `${packageName} Credits Package`,
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      },
    }

    // Create transaction in Firestore
    const paymentDoc = await addDoc(collection(db, 'payments'), {
      userId: user.uid,
      orderId,
      amount,
      packageName,
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    // Get Snap transaction token
    const transaction = await snap.createTransaction(parameter)
    const snapToken = transaction.token

    return NextResponse.json({
      snapToken,
      orderId,
      paymentId: paymentDoc.id,
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
