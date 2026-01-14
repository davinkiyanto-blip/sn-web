# Melodia API Reference

## Base URL
```
http://localhost:3000/api (development)
https://melodia.app/api (production)
```

## Authentication
All endpoints require Firebase ID token in Authorization header:
```
Authorization: Bearer {firebaseIdToken}
```

---

## 1. Generate Music

### POST /api/suno/generate

Generate new music from text prompt.

#### Request
```json
{
  "prompt": "upbeat pop song with catchy melody",
  "title": "Summer Vibes",
  "style": "Pop, Upbeat",
  "customMode": false,
  "instrumental": false,
  "model": "V5",
  "negativeTags": "heavy metal, sad"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| prompt | string | ✓ | Music description (max 5000 chars) |
| title | string | | Song title (max 80 chars) |
| style | string | | Genre/style tags (max 1000 chars) |
| customMode | boolean | | Enable custom generation |
| instrumental | boolean | | Only instrumental (no vocals) |
| model | string | | V3_5, V4, V4_5, V4_5PLUS, **V5** |
| negativeTags | string | | Tags to exclude from generation |

#### Response
```json
{
  "ok": true,
  "message": "Music generation started",
  "jobId": "abc123def456",
  "task_url": "https://api.kie.ai/task/abc123def456"
}
```

#### Status Codes
- **200**: Music generation started successfully
- **400**: Invalid prompt or parameters
- **401**: Unauthorized (missing token)
- **500**: Server error

#### Example
```javascript
// Using hook
const { generate, loading } = useGenerateMusic();

await generate({
  prompt: "acoustic guitar love song",
  title: "Love is Everything",
  model: "V5"
});
```

---

## 2. Extend Music

### POST /api/suno/extend

Extend existing music duration.

#### Request
```json
{
  "audio_id": "song123",
  "continue_at": 120,
  "prompt": "continue with a beautiful bridge"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Original audio ID |
| continue_at | number | ✓ | Timestamp in seconds to continue from |
| prompt | string | | Prompt for the extended part |

#### Response
```json
{
  "ok": true,
  "jobId": "ext123def456",
  "message": "Music extension started"
}
```

#### Example
```javascript
const { extend } = useExtendMusic();

await extend("song123", 120, "add more drums");
```

---

## 3. Upload Audio

### POST /api/suno/upload

Upload audio file for processing.

#### Request
```
Content-Type: multipart/form-data

file: <audio file>
prompt: "convert to jazz style" (optional)
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | ✓ | Audio file (MP3, WAV, etc.) |
| prompt | string | | Style/processing prompt |

#### Response
```json
{
  "ok": true,
  "audio_id": "uploaded123",
  "message": "Audio uploaded successfully",
  "url": "https://..."
}
```

#### Example
```javascript
const { upload } = useUploadAudio();

const file = document.querySelector('input[type=file]').files[0];
await upload(file, "make it dance");
```

---

## 4. Cover Audio

### POST /api/suno/cover

Create a cover/remix of existing audio.

#### Request
```json
{
  "audio_id": "song123",
  "prompt": "heavy metal version"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Original audio ID |
| prompt | string | ✓ | New style/prompt for cover |

#### Response
```json
{
  "ok": true,
  "jobId": "cover123",
  "message": "Cover generation started"
}
```

#### Example
```javascript
const { cover } = useCoverAudio();

await cover("song123", "ambient remix");
```

---

## 5. Check Task Status

### GET /api/suno/task/[jobId]

Get status of async music generation task.

#### Request
```
GET /api/suno/task/abc123def456
```

#### Response (Processing)
```json
{
  "ok": true,
  "status": "processing",
  "progress": "50%",
  "createdAt": "2024-01-14T10:00:00Z"
}
```

#### Response (Completed)
```json
{
  "ok": true,
  "status": "done",
  "completedAt": "2024-01-14T10:05:00Z",
  "records": [
    {
      "id": "music123",
      "audio_url": "https://...",
      "image_url": "https://...",
      "duration": 180,
      "title": "Summer Vibes",
      "tags": "pop, upbeat",
      "model": "V5",
      "prompt": "upbeat pop song...",
      "create_time": "2024-01-14T10:00:00Z"
    }
  ]
}
```

#### Response (Error)
```json
{
  "ok": true,
  "status": "error",
  "error": "Failed to generate music"
}
```

#### Status Values
- `pending` - Waiting to start
- `processing` - Currently generating
- `done` - Completed successfully
- `error` - Generation failed

#### Example
```javascript
const { poll } = usePollTaskStatus();

const status = await poll("abc123def456");
if (status.status === "done") {
  const music = status.records[0];
  console.log("Generated audio:", music.audio_url);
}
```

---

## 6. Separate Vocals

### POST /api/suno/separate

Separate vocals from instrumental in audio.

#### Request
```json
{
  "audio_id": "song123"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Audio ID to separate |

#### Response
```json
{
  "ok": true,
  "jobId": "sep123",
  "message": "Vocal separation started"
}
```

#### Response (Completed)
```json
{
  "ok": true,
  "status": "done",
  "vocals_url": "https://...",
  "instrumental_url": "https://...",
  "duration": 180
}
```

#### Example
```javascript
const { separate } = useSeparateVocals();

const result = await separate("song123");
console.log("Vocals:", result.vocals_url);
console.log("Instrumental:", result.instrumental_url);
```

---

## 7. Generate MIDI

### POST /api/suno/midi

Convert audio to MIDI format.

#### Request
```json
{
  "audio_id": "song123"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Audio ID to convert |

#### Response
```json
{
  "ok": true,
  "jobId": "midi123",
  "message": "MIDI conversion started"
}
```

#### Response (Completed)
```json
{
  "ok": true,
  "status": "done",
  "midi_url": "https://...",
  "file_name": "song.mid",
  "duration": 180
}
```

#### Use Case
For producers who want to edit the music in their DAW (FL Studio, Ableton, Logic Pro, etc.)

#### Example
```javascript
const { generateMidi } = useGenerateMidi();

const result = await generateMidi("song123");
// Download midi_url
```

---

## 8. Convert to WAV

### POST /api/suno/wav

Convert audio to high-quality WAV format.

#### Request
```json
{
  "audio_id": "song123"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Audio ID to convert |

#### Response
```json
{
  "ok": true,
  "jobId": "wav123",
  "message": "WAV conversion started"
}
```

#### Response (Completed)
```json
{
  "ok": true,
  "status": "done",
  "wav_url": "https://...",
  "file_name": "song.wav",
  "duration": 180,
  "bitrate": "320kbps"
}
```

#### Example
```javascript
const { convertWav } = useConvertToWav();

const result = await convertWav("song123");
// High-quality audio download ready
```

---

## 9. Create Music Video

### POST /api/suno/video

Auto-generate music video from audio.

#### Request
```json
{
  "audio_id": "song123"
}
```

#### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| audio_id | string | ✓ | Audio ID for video |

#### Response
```json
{
  "ok": true,
  "jobId": "video123",
  "message": "Video generation started"
}
```

#### Response (Completed)
```json
{
  "ok": true,
  "status": "done",
  "video_url": "https://...",
  "file_name": "song.mp4",
  "duration": 180,
  "resolution": "1080p"
}
```

#### Example
```javascript
const { createVideo } = useCreateMusicVideo();

const result = await createVideo("song123");
console.log("Video ready:", result.video_url);
```

---

## Error Handling

### Common Error Responses

#### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No valid authentication token provided"
}
```

#### 400 Bad Request
```json
{
  "error": "Invalid prompt or parameters",
  "details": "Prompt is required"
}
```

#### 500 Server Error
```json
{
  "error": "Failed to generate music",
  "details": "Internal server error details"
}
```

### Error Handling Best Practice
```javascript
try {
  const result = await generate(formData);
  if (result.ok) {
    toast.success("Generation started!");
    // Poll for status
  }
} catch (error) {
  const message = error.response?.data?.error || "An error occurred";
  toast.error(message);
}
```

---

## Rate Limiting

Recommended rate limits per user:
- **Generate**: 10 per day
- **Extend**: 20 per day
- **Cover**: 10 per day
- **Separate**: Unlimited
- **MIDI**: Unlimited
- **WAV**: Unlimited
- **Video**: 5 per day

---

## Polling Strategy

For async operations, use exponential backoff:

```javascript
async function pollWithBackoff(jobId, maxAttempts = 60) {
  let attempt = 0;
  let delay = 5000; // Start with 5 seconds

  while (attempt < maxAttempts) {
    const status = await poll(jobId);
    
    if (status.status === "done" || status.status === "error") {
      return status;
    }

    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 30000); // Cap at 30 seconds
    attempt++;
  }

  throw new Error("Polling timeout");
}
```

---

## WebSocket Alternative (Future)

For real-time updates instead of polling:

```javascript
const ws = new WebSocket('wss://melodia.app/ws/task/jobId');

ws.onmessage = (event) => {
  const status = JSON.parse(event.data);
  if (status.status === "done") {
    // Update UI
  }
};
```

---

## Best Practices

1. **Always verify authentication** before making API calls
2. **Use try-catch** for error handling
3. **Implement exponential backoff** for polling
4. **Show loading states** during async operations
5. **Display user-friendly error messages** from toast notifications
6. **Save generated music to Firestore** after completion
7. **Implement rate limiting** on frontend
8. **Cache task status** to reduce polling
9. **Use timestamps** to expire old URLs
10. **Validate input** before submission

---

## Integration Examples

### React Hook Example
```javascript
function MusicGenerator() {
  const { generate, loading } = useGenerateMusic();
  const { poll } = usePollTaskStatus();
  const [jobId, setJobId] = useState(null);

  const handleGenerate = async (prompt) => {
    const result = await generate({ prompt });
    if (result) {
      setJobId(result.jobId);
      pollStatus(result.jobId);
    }
  };

  const pollStatus = async (id) => {
    const status = await poll(id);
    if (status.status === "done") {
      // Handle completion
    } else if (status.status === "processing") {
      setTimeout(() => pollStatus(id), 5000);
    }
  };

  return (
    <div>
      <button onClick={() => handleGenerate("pop song")}>
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
```

### Direct Fetch Example
```javascript
async function generateMusic(prompt, token) {
  const response = await fetch("/api/suno/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Generation failed");
  return response.json();
}
```

---

For more information, visit the project documentation or GitHub repository.
