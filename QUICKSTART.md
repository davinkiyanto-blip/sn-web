# Quick Start Guide

## ⚡ Setup Cepat (5 Menit)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local`:
```env
# Firebase (Dapatkan dari Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Suno API (PRIVATE - Jangan expose!)
SUNO_API_BASE_URL=https://api.paxsenix.org
SUNO_API_KEY=your_suno_api_key
ENCRYPTION_KEY=your_32_char_encryption_key
```

### 3. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Buat project baru
3. Enable Authentication → Google Sign-in
4. Copy config ke `.env.local`
5. Tambahkan `localhost` ke Authorized Domains

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## ✅ Checklist

- [ ] Dependencies terinstall
- [ ] `.env.local` sudah dibuat dengan semua variabel
- [ ] Firebase project sudah dibuat
- [ ] Google Auth sudah di-enable
- [ ] `localhost` sudah ditambahkan ke authorized domains
- [ ] Server berjalan tanpa error

## 🎯 Next Steps

1. Test login dengan Google
2. Coba buat musik pertama
3. Explore fitur lainnya
4. Deploy ke production (lihat DEPLOYMENT.md)

## 🆘 Troubleshooting

**Error: Firebase not initialized**
- Pastikan semua `NEXT_PUBLIC_FIREBASE_*` variabel sudah di-set

**Error: API key missing**
- Pastikan `SUNO_API_KEY` sudah di-set di `.env.local`

**Login tidak bekerja**
- Pastikan domain sudah ditambahkan ke Firebase Authorized Domains
- Check browser console untuk error details

## 📚 Dokumentasi Lengkap

- [README.md](./README.md) - Dokumentasi lengkap
- [SECURITY.md](./SECURITY.md) - Panduan keamanan
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Panduan deployment
