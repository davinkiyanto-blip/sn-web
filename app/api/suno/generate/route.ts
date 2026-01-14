import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase/config'
import { verifyIdToken } from '@/lib/auth/middleware'

// Server-side API route - API keys are NEVER exposed to client
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate request
    if (!body.prompt && !body.customMode) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Get API key from server-side environment (NEVER exposed to client)
    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      console.error('API configuration missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Make request to Suno API (server-side only)
    const response = await fetch(`${apiBaseUrl}/ai-music/suno-music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        customMode: body.customMode || false,
        instrumental: body.instrumental || false,
        prompt: body.prompt,
        model: body.model || 'V5',
        negativeTags: body.negativeTags || '',
        style: body.style || '',
        title: body.title || '',
      }),
    })

    const data = await response.json()

    // Replace creator field
    if (data.creator) {
      data.creator = '@dafidxcode'
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Generate music error:', error)
    return NextResponse.json(
      { error: 'Failed to generate music', details: error.message },
      { status: 500 }
    )
  }
}
