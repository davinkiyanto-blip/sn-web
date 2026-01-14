import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    // Verify authentication
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = params
    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Poll task status
    const response = await fetch(`${apiBaseUrl}/task/${jobId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const data = await response.json()

    // Replace creator field
    if (data.creator) {
      data.creator = '@dafidxcode'
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Task status error:', error)
    return NextResponse.json(
      { error: 'Failed to get task status', details: error.message },
      { status: 500 }
    )
  }
}
