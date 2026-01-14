# Developer Quick Reference

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

## 📁 File Structure Quick Reference

| File/Folder | Purpose |
|-----------|---------|
| `app/page.tsx` | Landing page |
| `app/home/` | Explore/Feed page |
| `app/create/` | Music generation page |
| `app/library/` | User's music collection |
| `app/tools/` | Utility tools |
| `app/settings/` | User settings |
| `app/api/suno/` | All API route handlers |
| `components/` | Reusable React components |
| `lib/api/` | API client and hooks |
| `store/` | Zustand state management |
| `tailwind.config.ts` | Styling configuration |

## 🎨 Common Styling Classes

```tsx
// Glass effect (frosted glass)
<div className="glass rounded-2xl p-6">

// Gradient text (Electric Indigo to Neon Purple)
<h1 className="bg-gradient-primary bg-clip-text text-transparent">

// Primary button
<button className="bg-primary hover:bg-primary-dark">

// Accent button
<button className="bg-accent hover:bg-accent-dark">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Centered container
<div className="container mx-auto px-4 max-w-4xl">
```

## 🔧 API Usage Examples

### Generate Music
```javascript
import { useGenerateMusic } from '@/lib/api/hooks'

export default function Component() {
  const { generate, loading } = useGenerateMusic()

  const handleGenerate = async () => {
    const result = await generate({
      prompt: "upbeat pop song",
      title: "My Song",
      model: "V5"
    })
    
    if (result?.ok) {
      console.log("Job ID:", result.jobId)
      // Poll for status
    }
  }

  return (
    <button onClick={handleGenerate} disabled={loading}>
      {loading ? "Generating..." : "Generate"}
    </button>
  )
}
```

### Poll Task Status
```javascript
import { usePollTaskStatus } from '@/lib/api/hooks'

const { poll } = usePollTaskStatus()

// Check status periodically
const checkStatus = async (jobId) => {
  const status = await poll(jobId)
  
  if (status.status === 'done') {
    const music = status.records[0]
    console.log("Music ready:", music.audio_url)
  } else if (status.status === 'processing') {
    // Still processing, check again in 5 seconds
    setTimeout(() => checkStatus(jobId), 5000)
  }
}
```

## 🔐 Authentication

### Check if User is Logged In
```javascript
import { useAuthStore } from '@/store/useAuthStore'

export default function Component() {
  const { user, loading } = useAuthStore()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return <div>Welcome, {user.displayName}</div>
}
```

### Protected Route
```javascript
'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export default function ProtectedPage() {
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')  // Redirect to landing page
    }
  }, [user, loading, router])

  if (!user) return null

  return <div>Protected content</div>
}
```

## 💾 Database Operations

### Save Music to Firestore
```javascript
import { db } from '@/lib/firebase/config'
import { collection, addDoc } from 'firebase/firestore'
import { useAuthStore } from '@/store/useAuthStore'

async function saveMusic(musicData) {
  const { user } = useAuthStore()
  if (!user) return

  await addDoc(collection(db, 'music'), {
    userId: user.uid,
    title: musicData.title,
    prompt: musicData.prompt,
    audio_url: musicData.audio_url,
    image_url: musicData.image_url,
    duration: musicData.duration,
    tags: musicData.tags,
    createdAt: new Date()
  })
}
```

### Load User's Music
```javascript
import { db } from '@/lib/firebase/config'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'

async function loadUserMusic(userId) {
  const q = query(
    collection(db, 'music'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
```

## 🎵 Audio Player

### Play Music
```javascript
import { usePlayerStore } from '@/store/usePlayerStore'

export default function MusicCard({ track }) {
  const { setCurrentTrack } = usePlayerStore()

  const handlePlay = () => {
    setCurrentTrack({
      id: track.id,
      audio_url: track.audio_url,
      title: track.title,
      image_url: track.image_url,
      duration: track.duration
    })
  }

  return <button onClick={handlePlay}>Play</button>
}
```

## 🎨 Forms & Validation

### Form with Validation
```javascript
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MusicForm() {
  const [prompt, setPrompt] = useState('')
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!prompt.trim()) {
      newErrors.prompt = 'Prompt is required'
    }
    
    if (prompt.length > 5000) {
      newErrors.prompt = 'Prompt too long (max 5000 chars)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors')
      return
    }

    // Submit form
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your music..."
        maxLength={5000}
      />
      {errors.prompt && <span className="text-red-500">{errors.prompt}</span>}
      <button type="submit">Generate</button>
    </form>
  )
}
```

## 🎭 Animations

### Fade In Animation
```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Staggered List
```javascript
<motion.div>
  {items.map((item, index) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

## 📱 Responsive Design Tips

```jsx
// Tailwind responsive classes
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<div className="hidden md:block">
  Only visible on tablet+
</div>

<div className="md:hidden">
  Only visible on mobile
</div>
```

## 🔔 Notifications

### Show Toast
```javascript
import toast from 'react-hot-toast'

// Success
toast.success('Music generated!')

// Error
toast.error('Failed to generate music')

// Loading
const id = toast.loading('Generating...')

// Update
toast.success('Done!', { id })
```

## 🧪 Testing & Debugging

### Check API Response
```javascript
try {
  const result = await generate(formData)
  console.log('API Response:', result)
} catch (error) {
  console.error('API Error:', error)
}
```

### Firebase Auth Debug
```javascript
import { auth } from '@/lib/firebase/config'

auth.onAuthStateChanged((user) => {
  console.log('Auth user:', user)
})
```

### Check Component Props
```javascript
function MyComponent(props) {
  console.log('Component props:', props)
  // ...
}
```

## 🚨 Error Handling Pattern

```javascript
const handleAction = async () => {
  try {
    // Validate
    if (!input) {
      toast.error('Input required')
      return
    }

    // Call API
    const result = await apiCall(input)

    // Check response
    if (!result?.ok) {
      toast.error(result?.error || 'Something went wrong')
      return
    }

    // Success
    toast.success('Action completed!')

  } catch (error) {
    console.error('Error:', error)
    toast.error('An unexpected error occurred')
  }
}
```

## 📦 Environment Variables

Key env variables needed:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

SUNO_API_KEY (server-side)
SUNO_API_BASE_URL (server-side)
```

## 🔍 Common Debugging

### Clear Browser Cache
```javascript
// In browser console
localStorage.clear()
sessionStorage.clear()
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check API calls

### Firebase Issues
1. Check Firebase Console
2. Verify API keys are correct
3. Check security rules
4. Enable required services

## 📚 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Zustand](https://github.com/pmndrs/zustand)

## 💡 Tips & Tricks

1. **Use `useCallback`** for memoized functions
2. **Use `useMemo`** for expensive computations
3. **Split components** into smaller pieces
4. **Use compound components** for complex UIs
5. **Create custom hooks** for reusable logic
6. **Use TypeScript** for type safety
7. **Write tests** for critical features
8. **Use Error Boundary** for error handling
9. **Optimize images** with Next.js Image
10. **Use lazy loading** for routes

---

For complete documentation, see:
- API_REFERENCE.md - Detailed API docs
- IMPLEMENTATION_STATUS.md - Feature checklist
- SUNO.md - Product requirements
