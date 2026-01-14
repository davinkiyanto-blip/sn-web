import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const response = await fetch(`${apiBaseUrl}/ai-music/extend-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        audio_id: body.audio_id,
        continue_at: body.continue_at,
        prompt: body.prompt || '',
      }),
    })

    const data = await response.json()
    if (data.creator) {
      data.creator = '@dafidxcode'
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to extend music', details: error.message },
      { status: 500 }
    )
  }
}
