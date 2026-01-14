# Melodia - AI Music Generator

Aplikasi web profesional untuk membuat musik menggunakan Suno AI dengan desain modern dan keamanan tingkat tinggi.

## 🚀 Fitur Utama

- **Generate Music**: Buat musik dari teks dengan AI
- **Custom Mode**: Mode sederhana atau custom dengan lirik dan style
- **Music Library**: Kelola semua musik yang telah dibuat
- **Advanced Tools**: Separate vocals, MIDI conversion, WAV conversion, Music video
- **Firebase Auth**: Autentikasi Google yang aman
- **Responsive Design**: Mobile-first dengan bottom navigation
- **Secure API**: Semua API keys tersembunyi di server-side

## 🛠️ Teknologi

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Firebase Authentication**
- **Zustand** (State Management)
- **Framer Motion** (Animations)
- **React Hot Toast** (Notifications)

## 📦 Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd "sn web"
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Environment Variables**

Buat file `.env.local` di root project (copy dari `.env.example`):

```env
# Firebase Configuration (Public - Safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration (PRIVATE - Server-side only)
SUNO_API_BASE_URL=https://api.paxsenix.org
SUNO_API_KEY=your_suno_api_key_here
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

**PENTING**: 
- Jangan pernah commit file `.env.local` ke repository
- Semua variabel `SUNO_API_*` dan `ENCRYPTION_KEY` harus tetap rahasia
- Hanya variabel `NEXT_PUBLIC_*` yang aman untuk diekspos ke client

4. **Setup Firebase**

   a. Buat project di [Firebase Console](https://console.firebase.google.com)
   
   b. Enable Authentication -> Sign-in method -> Google
   
   c. Copy konfigurasi Firebase ke `.env.local`
   
   d. Tambahkan domain aplikasi ke Authorized domains:
      - `localhost` (untuk development)
      - Domain produksi Anda (untuk production)

5. **Run Development Server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 🔒 Keamanan

### API Keys Protection

Semua API keys dan credentials disimpan di server-side hanya:

1. **API Routes**: Semua endpoint API ada di `/app/api/*` yang hanya berjalan di server
2. **Environment Variables**: Variabel sensitif tidak pernah diekspos ke client
3. **Middleware**: Security headers ditambahkan untuk mencegah serangan umum
4. **Encryption**: Utility encryption tersedia untuk data sensitif (opsional)

### Best Practices

- ✅ API keys hanya diakses di server-side routes
- ✅ Client hanya memanggil API routes internal (`/api/*`)
- ✅ Token authentication untuk setiap request
- ✅ Environment variables tidak di-commit ke git
- ✅ Security headers di semua API routes

## 📁 Struktur Project

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (server-side only)
│   │   └── suno/         # Suno API proxy routes
│   ├── home/             # Home/Explore page
│   ├── create/           # Create music page
│   ├── library/          # Music library page
│   ├── tools/            # Tools page
│   └── settings/         # Settings page
├── components/            # React components
│   ├── Auth/            # Authentication components
│   ├── Layout/           # Layout components
│   └── Player/           # Audio player
├── lib/                   # Utilities
│   ├── api/             # API client & types
│   ├── auth/            # Auth middleware
│   ├── encryption.ts    # Encryption utilities
│   └── firebase/        # Firebase config
├── store/                # Zustand stores
└── middleware.ts         # Next.js middleware
```

## 🎨 Design System

- **Colors**: Monokromatik (Hitam/Putih/Abu-abu) dengan aksen Electric Indigo (#6366f1) dan Neon Purple (#a855f7)
- **Typography**: Inter font family
- **Components**: Glassmorphism effects, rounded corners, smooth transitions
- **Mobile**: Bottom navigation bar untuk akses mudah

## 📝 API Endpoints

Semua endpoint API tersedia di `/app/api/suno/`:

- `POST /api/suno/generate` - Generate music
- `GET /api/suno/task/[jobId]` - Check task status
- `POST /api/suno/extend` - Extend music
- `POST /api/suno/cover` - Cover audio
- `POST /api/suno/separate` - Separate vocals
- `POST /api/suno/midi` - Convert to MIDI
- `POST /api/suno/video` - Create music video
- `POST /api/suno/wav` - Convert to WAV

## 🚀 Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Tambahkan environment variables di Vercel dashboard
4. Deploy

### Environment Variables untuk Production

Pastikan semua variabel di `.env.local` ditambahkan di platform deployment Anda (Vercel, Netlify, dll).

## 📄 License

Private - All rights reserved

## 👤 Author

@dafidxcode

## ⚠️ Catatan Penting

- Pastikan API keys tidak pernah diekspos ke client-side
- Gunakan HTTPS di production
- Implement rate limiting untuk mencegah abuse
- Backup data pengguna secara berkala
- Monitor penggunaan API untuk mengontrol biaya
