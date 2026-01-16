
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const fileUrl = searchParams.get('url')
    const filename = searchParams.get('filename') || 'music.mp3'
    const isInline = searchParams.get('inline') === 'true'
    const disposition = isInline ? 'inline' : `attachment; filename="${filename}.mp3"`

    if (!fileUrl) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    try {
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'arraybuffer',
        })

        const headers = new Headers()
        headers.set('Content-Disposition', disposition)
        headers.set('Content-Type', 'audio/mpeg')
        headers.set('Content-Length', response.data.length)

        return new NextResponse(response.data, {
            status: 200,
            headers,
        })
    } catch (error: any) {
        console.error('Download proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to download file' },
            { status: 500 }
        )
    }
}
