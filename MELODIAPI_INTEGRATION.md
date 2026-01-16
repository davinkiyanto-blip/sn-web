# 🎵 MelodiAPI Integration Guide

Complete API reference for music generation using the MelodiAPI backend.

## API Endpoint

```
POST https://melodi-api.vercel.app/api/generate
```

## Authentication

Music generation requires Firebase authentication. Include the Firebase ID token in the Authorization header when calling the internal API route:

```
POST /api/suno/generate
Authorization: Bearer <firebase-id-token>
```

## Request Parameters

### Common Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customMode` | boolean | Yes | Enable custom mode for full control |
| `instrumental` | boolean | Yes | Generate instrumental-only music |
| `model` | string | No | Model version: V3_5, V4, V4_5, V4_5PLUS, V5 (default: V5) |
| `negativeTags` | string | No | Tags to avoid in generation |

### Mode-Specific Parameters

#### Custom Mode - Vocal (`customMode: true`, `instrumental: false`)

| Parameter | Type | Required | Max Length | Description |
|-----------|------|----------|------------|-------------|
| `style` | string | **Yes** | 1000 chars | Music style/genre (e.g., "City Pop, Funk, 80s") |
| `prompt` | string | **Yes** | 5000 chars | Lyrics or description |
| `title` | string | **Yes** | 80 chars | Song title |

#### Custom Mode - Instrumental (`customMode: true`, `instrumental: true`)

| Parameter | Type | Required | Max Length | Description |
|-----------|------|----------|------------|-------------|
| `style` | string | **Yes** | 1000 chars | Music style/genre |
| `title` | string | **Yes** | 80 chars | Track title |
| `prompt` | string | No | - | **Ignored** (automatically cleared) |

#### Non-Custom Mode (`customMode: false`)

| Parameter | Type | Required | Max Length | Description |
|-----------|------|----------|------------|-------------|
| `prompt` | string | **Yes** | 400 chars | Simple description |
| `style` | string | No | - | **Must be empty** |
| `title` | string | No | 80 chars | Optional title |

## Request Examples

### Custom Mode - Vocal

```json
{
  "customMode": true,
  "instrumental": false,
  "style": "City Pop, Funk, 80s, Synthpop",
  "prompt": "A beautiful song with female vocals about summer nights in Tokyo",
  "title": "Summer Nights",
  "model": "V5",
  "negativeTags": ""
}
```

### Custom Mode - Instrumental

```json
{
  "customMode": true,
  "instrumental": true,
  "style": "Ambient Electronic, Lo-fi Hip Hop, Chillwave",
  "title": "Midnight Study Session",
  "model": "V5",
  "negativeTags": "vocals"
}
```

### Non-Custom Mode

```json
{
  "customMode": false,
  "instrumental": false,
  "prompt": "A happy upbeat pop song",
  "model": "V5",
  "negativeTags": ""
}
```

## Response Format

### Success Response (200 OK)

```json
{
  "creator": "@Dafidxcode",
  "ok": true,
  "status": "done",
  "records": [
    {
      "id": "861582501871616",
      "image_url": "https://cdn-0.paxsenix.org/file/...",
      "audio_url": "https://cdn-0.paxsenix.org/file/...",
      "duration": 38.28,
      "create_time": "1768556363",
      "model": "chirp-crow",
      "prompt": "A beautiful song...",
      "title": "Summer Nights",
      "tags": "City Pop, Funk, 80s"
    }
  ],
  "completedAt": "2026-01-16T09:40:16.230Z"
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Validation Failed",
  "details": [
    "In customMode with instrumental=false, 'style' is required",
    "'prompt' must not exceed 5000 characters"
  ]
}
```

## HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | Success | Music generated successfully |
| 400 | Bad Request | Validation error (see details array) |
| 401 | Unauthorized | Missing or invalid Firebase token |
| 405 | Method Not Allowed | Used GET instead of POST |
| 500 | Server Error | Missing environment variables |
| 502 | Bad Gateway | Generation failed at provider |
| 504 | Gateway Timeout | Generation exceeded 5 minutes |

## Validation Rules

### Custom Mode - Vocal
- ✅ `style` required (max 1000 characters)
- ✅ `prompt` required (max 5000 characters)
- ✅ `title` required (max 80 characters)

### Custom Mode - Instrumental
- ✅ `style` required (max 1000 characters)
- ✅ `title` required (max 80 characters)
- ❌ `prompt` ignored/cleared automatically

### Non-Custom Mode
- ✅ `prompt` required (max 400 characters)
- ❌ `style` must be empty
- ⚠️ `title` optional (max 80 characters if provided)

## Processing Flow

1. **Submit Request** → POST to `/api/suno/generate`
2. **Validation** → Parameters validated based on mode
3. **Forward to MelodiAPI** → Request sent to backend
4. **Polling** → MelodiAPI polls provider every 5 seconds
5. **Response** → Music records returned when complete

**Maximum Processing Time:** 5 minutes (enforced by MelodiAPI)

## Integration Example

```typescript
import { GenerateMusicRequest, GenerateMusicResponse } from '@/lib/api/types'

async function generateMusic(params: GenerateMusicRequest): Promise<GenerateMusicResponse> {
  const token = await auth.currentUser?.getIdToken()
  
  const response = await fetch('/api/suno/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(params)
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details?.join(', ') || error.error)
  }
  
  return response.json()
}
```

## Environment Configuration

Required environment variables in `.env.local`:

```env
# MelodiAPI Configuration (Server-side only)
SUNO_API_KEY=sk-paxsenix-dE4GvkEYMBQbqtB8Et9vEDfzUTjnpLN_0yvu7YjfFWDTvRWl
SUNO_API_BASE_URL=https://melodi-api.vercel.app
```

## Error Handling Best Practices

```typescript
try {
  const result = await generateMusic(params)
  
  if (result.status === 'done' && result.records) {
    // Process successful generation
    result.records.forEach(record => {
      console.log('Generated:', record.title, record.audio_url)
    })
  }
} catch (error) {
  if (error.response?.status === 400) {
    // Validation error - show details to user
    const { details } = await error.response.json()
    console.error('Validation errors:', details)
  } else if (error.response?.status === 504) {
    // Timeout - notify user
    console.error('Generation timeout - please try again')
  } else {
    // Other errors
    console.error('Generation failed:', error.message)
  }
}
```

## Notes

- All API keys are stored server-side only and never exposed to client
- The `creator` field is always set to `@Dafidxcode` by the backend
- MelodiAPI handles polling automatically - no client-side polling needed
- Maximum generation time is 5 minutes (enforced by backend timeout)
- Validation is performed both client-side and server-side for security
