import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

export async function POST(request: NextRequest) {
    try {
        const user = await verifyIdToken(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Process FormData
        const formData = await request.formData()
        const file = formData.get('file') as File
        const prompt = formData.get('prompt') as string

        if (!file || !prompt) {
            return NextResponse.json({ error: 'File and prompt are required' }, { status: 400 })
        }

        const apiKey = process.env.SUNO_API_KEY
        const apiBaseUrl = process.env.SUNO_API_BASE_URL

        if (!apiKey || !apiBaseUrl) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            )
        }

        // 2. Upload Audio
        const sunoUploadFormData = new FormData()
        sunoUploadFormData.append('file', file)

        const uploadResponse = await fetch(`${apiBaseUrl}/ai-music/upload-audio`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            body: sunoUploadFormData,
        })

        if (!uploadResponse.ok) {
            const err = await uploadResponse.json().catch(() => ({}))
            throw new Error(err.error || 'Failed to upload audio to server')
        }

        const uploadData = await uploadResponse.json()
        const audioId = uploadData.id || uploadData.audio_id

        if (!audioId) {
            throw new Error('No audio ID returned from upload')
        }

        // 3. Generate Cover
        const coverResponse = await fetch(`${apiBaseUrl}/ai-music/cover-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                audio_id: audioId,
                prompt: prompt,
            }),
        })

        const coverData = await coverResponse.json()
        if (!coverResponse.ok) {
            throw new Error(coverData.error || 'Failed to generate cover')
        }

        if (coverData.creator) {
            coverData.creator = '@dafidxcode'
        }

        return NextResponse.json(coverData)

    } catch (error: any) {
        console.error('Upload and cover error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to process upload and cover' },
            { status: 500 }
        )
    }
}
