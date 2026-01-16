import { NextRequest, NextResponse } from 'next/server'
import { verifyIdToken } from '@/lib/auth/middleware'

// Validation interface
interface ValidationError {
  error: string
  details: string[]
}

// Server-side API route - API keys are NEVER exposed to client
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyIdToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate request based on mode
    const validationErrors: string[] = []
    const { customMode, instrumental, style, prompt, title, model, negativeTags } = body

    // Custom Mode Validation
    if (customMode) {
      if (instrumental) {
        // Custom Mode - Instrumental
        if (!style || style.trim() === '') {
          validationErrors.push("In customMode with instrumental=true, 'style' is required")
        } else if (style.length > 1000) {
          validationErrors.push("'style' must not exceed 1000 characters")
        }

        if (!title || title.trim() === '') {
          validationErrors.push("In customMode with instrumental=true, 'title' is required")
        } else if (title.length > 80) {
          validationErrors.push("'title' must not exceed 80 characters")
        }

        // Prompt is ignored in instrumental mode
      } else {
        // Custom Mode - Vocal
        if (!style || style.trim() === '') {
          validationErrors.push("In customMode with instrumental=false, 'style' is required")
        } else if (style.length > 1000) {
          validationErrors.push("'style' must not exceed 1000 characters")
        }

        if (!prompt || prompt.trim() === '') {
          validationErrors.push("In customMode with instrumental=false, 'prompt' is required")
        } else if (prompt.length > 5000) {
          validationErrors.push("'prompt' must not exceed 5000 characters")
        }

        if (!title || title.trim() === '') {
          validationErrors.push("In customMode with instrumental=false, 'title' is required")
        } else if (title.length > 80) {
          validationErrors.push("'title' must not exceed 80 characters")
        }
      }
    } else {
      // Non-Custom Mode
      if (!prompt || prompt.trim() === '') {
        validationErrors.push("In non-customMode, 'prompt' is required")
      } else if (prompt.length > 400) {
        validationErrors.push("In non-customMode, 'prompt' must not exceed 400 characters")
      }

      if (style && style.trim() !== '') {
        validationErrors.push("In non-customMode, 'style' must be empty")
      }

      if (title && title.length > 80) {
        validationErrors.push("'title' must not exceed 80 characters")
      }
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation Failed',
          details: validationErrors,
        } as ValidationError,
        { status: 400 }
      )
    }

    // Get API configuration from server-side environment (NEVER exposed to client)
    const apiKey = process.env.SUNO_API_KEY
    const apiBaseUrl = process.env.SUNO_API_BASE_URL

    if (!apiKey || !apiBaseUrl) {
      console.error('API configuration missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Prepare request body for melodiapi
    const requestBody: any = {
      customMode: customMode || false,
      instrumental: instrumental || false,
      model: model || 'V5',
      negativeTags: negativeTags || '',
    }

    // Add fields based on mode
    if (customMode) {
      requestBody.style = style || ''
      requestBody.title = title || ''

      if (instrumental) {
        // Instrumental mode - clear prompt
        requestBody.prompt = ''
      } else {
        // Vocal mode - include prompt
        requestBody.prompt = prompt || ''
      }
    } else {
      // Non-custom mode
      requestBody.prompt = prompt || ''
      requestBody.style = ''
      requestBody.title = title || ''
    }

    // Make request to MelodiAPI (server-side only)
    const response = await fetch(`${apiBaseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    // Handle different HTTP status codes
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))

      if (response.status === 400) {
        return NextResponse.json(
          {
            error: errorData.error || 'Bad Request',
            details: errorData.details || ['Invalid request parameters'],
          },
          { status: 400 }
        )
      } else if (response.status === 502) {
        return NextResponse.json(
          { error: 'Music generation failed at provider', details: errorData },
          { status: 502 }
        )
      } else if (response.status === 504) {
        return NextResponse.json(
          { error: 'Music generation timeout (exceeded 5 minutes)', details: errorData },
          { status: 504 }
        )
      } else {
        return NextResponse.json(
          { error: 'Failed to generate music', details: errorData },
          { status: response.status }
        )
      }
    }

    const data = await response.json()

    // MelodiAPI handles polling server-side and returns final response
    // Format: { creator, ok, status: 'done', records: [...], completedAt }
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Generate music error:', error)
    return NextResponse.json(
      { error: 'Failed to generate music', details: error.message },
      { status: 500 }
    )
  }
}
