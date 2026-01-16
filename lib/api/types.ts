export interface GenerateMusicRequest {
  customMode: boolean
  instrumental: boolean
  prompt?: string
  model?: 'V3_5' | 'V4' | 'V4_5' | 'V4_5PLUS' | 'V5'
  negativeTags?: string
  style?: string
  title?: string
}

export interface GenerateMusicResponse {
  creator: string
  ok: boolean
  status: 'pending' | 'processing' | 'done' | 'error'
  records?: MusicRecord[]
  completedAt?: string
}

export interface ValidationError {
  error: string
  details: string[]
}

export interface TaskStatusResponse {
  ok: boolean
  status: 'pending' | 'processing' | 'done' | 'error'
  createdAt?: string
  completedAt?: string
  progress?: string
  parameters?: {
    prompt: string
    title: string
    style: string
    model: string
  }
  records?: MusicRecord[]
}

export interface MusicRecord {
  id: string
  image_url: string
  audio_url: string
  duration: number
  create_time: string
  model: string
  prompt: string
  negativeTags: string
  title: string
  tags: string
}

export interface ExtendMusicRequest {
  audio_id: string
  continue_at: number
  prompt?: string
}

export interface UploadAudioRequest {
  file: File
  prompt?: string
}

export interface CoverAudioRequest {
  audio_id: string
  prompt: string
}

export interface SeparateVocalsRequest {
  audio_id: string
}

export interface GenerateMidiRequest {
  audio_id: string
}

export interface CreateVideoRequest {
  audio_id: string
}

export interface ConvertWavRequest {
  audio_id: string
}
