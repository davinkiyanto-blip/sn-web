import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
  try {
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const prompt = formData.get('prompt') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Create FormData for Suno API
    const sunoFormData = new FormData()
    sunoFormData.append('file', file)
    if (prompt) {
      sunoFormData.append('prompt', prompt)
    }

    const response = await fetch(`${apiBaseUrl}/ai-music/upload-audio`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: sunoFormData,
    })

    const data = await response.json()
    if (data.creator) {
      data.creator = '@dafidxcode'
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload audio', details: error.message },
      { status: 500 }
    )
  }
}
