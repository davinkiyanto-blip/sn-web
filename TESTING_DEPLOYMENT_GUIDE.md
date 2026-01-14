# Melodia - Testing & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Suno API key

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Suno API (Server-side only)
SUNO_API_KEY=your_suno_api_key
SUNO_API_BASE_URL=https://api.kie.ai

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development Server

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🧪 Testing Checklist

### Authentication Flow
- [ ] Landing page loads without login
- [ ] "Mulai Gratis" button opens Google sign-in
- [ ] Login redirects to home page
- [ ] Session persists after page refresh
- [ ] Logout clears session

### Create Music Feature
- [ ] Simple mode: Just prompt works
- [ ] Custom mode: All fields work
- [ ] Model selection dropdown works
- [ ] Character counter works
- [ ] Form validation works
- [ ] Submit button disabled when no prompt
- [ ] Loading state shows during generation
- [ ] Success toast after generation
- [ ] Redirect to library after completion

### Library Feature
- [ ] Music from Firestore loads
- [ ] Cards display correctly
- [ ] Play button works
- [ ] Download button visible
- [ ] Share button visible
- [ ] More options button visible
- [ ] Empty state shows when no music

### Tools Feature
- [ ] Tool cards display correctly
- [ ] Tool descriptions visible
- [ ] Icons display correctly
- [ ] Each tool is clickable

### Settings Feature
- [ ] User profile displays correctly
- [ ] Logout button works
- [ ] Logout clears session
- [ ] Links to privacy/terms work

### Global Features
- [ ] Bottom navigation works on mobile
- [ ] Audio player appears when music plays
- [ ] Player controls work (play/pause)
- [ ] Progress bar works
- [ ] Time display works
- [ ] Toast notifications appear

### Responsive Design
- [ ] Mobile (375px) - all features work
- [ ] Tablet (768px) - layout adjusts
- [ ] Desktop (1200px+) - full layout

### API Integration
- [ ] Generate music API works
- [ ] Task polling works
- [ ] Extend music API works
- [ ] Upload audio API works
- [ ] Cover audio API works
- [ ] Separate vocals API works
- [ ] MIDI conversion API works
- [ ] WAV conversion API works
- [ ] Video creation API works

## 📝 Verification Checklist

### Code Quality
```bash
# Run linting
npm run lint

# Run tests (if configured)
npm run test

# Type checking
npx tsc --noEmit
```

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized
- [ ] Images optimized
- [ ] No console errors
- [ ] No memory leaks

### Security
- [ ] API keys in server-side only
- [ ] No secrets in client code
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Input validation on server
- [ ] Rate limiting enabled

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🚀 Deployment Steps

### 1. Prepare Firebase
```bash
# Go to Firebase Console
# 1. Create project (if not exists)
# 2. Set up Authentication > Google Sign-In
# 3. Add authorized domains
# 4. Create Firestore database
# 5. Set up storage (if needed)
```

### 2. Configure Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User music collection
    match /music/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // User profiles (optional)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
# Go to Vercel dashboard > Settings > Environment Variables
# Add all .env variables
```

### 4. Alternative: Deploy to Other Platforms

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

#### AWS Amplify
```bash
amplify init
amplify publish
```

#### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🔍 Monitoring & Logging

### Recommended Services

1. **Error Tracking**: Sentry.io
```bash
npm install @sentry/nextjs
```

2. **Analytics**: Google Analytics, Mixpanel
3. **Performance**: Datadog, New Relic
4. **Logs**: LogRocket, Loggly

### Basic Setup Example (Sentry)
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

## 📊 Database Management

### Firestore Indexes
Create these indexes for better performance:

```
Collection: music
Fields:
  - userId (Ascending)
  - createdAt (Descending)
```

### Backup Strategy
```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backup

# Import Firestore data
firebase firestore:import gs://your-bucket/backup
```

## 🔧 Troubleshooting

### Common Issues

#### "Firebase Config Missing"
- ✓ Check .env.local exists
- ✓ Verify all FIREBASE_* variables
- ✓ Restart dev server

#### "Unauthorized" on API calls
- ✓ Check Firebase Auth is working
- ✓ Verify ID token is being sent
- ✓ Check server API key is set

#### "Failed to generate music"
- ✓ Verify SUNO_API_KEY is correct
- ✓ Check Suno API is online
- ✓ Verify API_BASE_URL is correct

#### "Firestore collection not found"
- ✓ Create 'music' collection in Firestore
- ✓ Check security rules allow access
- ✓ Verify user is authenticated

#### Build fails with TypeScript errors
```bash
# Reinstall @typescript-eslint packages
npm install --save-dev @typescript-eslint/eslint-plugin@7.0.0 @typescript-eslint/parser@7.0.0

# Clear next build cache
rm -rf .next
npm run build
```

## 📱 Mobile Testing

### iOS Safari
```bash
# Use iPhone simulator
open -a Simulator

# Or use real device:
# Connect via USB
# Open Settings > Developer > Safari
# Remote Debugging
```

### Android Chrome
```bash
# Enable USB debugging on device
# Open Chrome DevTools
# chrome://inspect
```

## 🎯 Performance Optimization

### Recommended Optimizations
1. **Image Optimization**
   - Use Next.js Image component
   - Set proper dimensions
   - Use WebP format

2. **Code Splitting**
   - Dynamic imports for heavy components
   - Route-based code splitting

3. **Caching**
   - Browser caching headers
   - Service Worker for offline support

4. **Database**
   - Implement caching for user music
   - Use database indexes

5. **API**
   - Implement rate limiting
   - Add request/response caching
   - Compress responses

## 📈 Scaling Considerations

### For High Traffic
1. **Database**: Consider moving to SQL (PostgreSQL)
2. **Caching**: Implement Redis for session/data cache
3. **CDN**: Use CloudFlare or AWS CloudFront
4. **Load Balancing**: Scale horizontally with multiple instances
5. **Microservices**: Separate API and web services

## ✨ Post-Deployment

After deployment:

1. **Monitor**
   - Check error rates
   - Monitor API latency
   - Track user adoption

2. **Optimize**
   - Analyze performance metrics
   - Identify bottlenecks
   - Implement improvements

3. **Maintain**
   - Regular security updates
   - Database maintenance
   - Backup verification

4. **Iterate**
   - Gather user feedback
   - Plan new features
   - Release updates

---

For more information, see `SUNO.md` for product requirements and `IMPLEMENTATION_STATUS.md` for feature completeness.
