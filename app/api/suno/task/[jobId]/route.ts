import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Verify authentication
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { jobId } = await params
    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    console.log(`Polling task status for jobId: ${jobId}`)

    // Poll task status from PaxSenix API
    const response = await fetch(`${apiBaseUrl}/task/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`PaxSenix API error for ${jobId}:`, response.status, errorData)
      return NextResponse.json(
        { error: 'Failed to get task status', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Transform response: Replace "creator":"@PaxSenix" with "Author":"@dafidxcode"
    if (data.creator) {
      delete data.creator
      data.Author = '@dafidxcode'
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
