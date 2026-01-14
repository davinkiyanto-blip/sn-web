# Deployment Guide

## 🚀 Persiapan Deployment

### 1. Environment Variables

Pastikan semua environment variables sudah dikonfigurasi di platform deployment:

**Vercel (Recommended)**
1. Buka project di Vercel Dashboard
2. Settings → Environment Variables
3. Tambahkan semua variabel dari `.env.example`

**Netlify**
1. Site settings → Environment variables
2. Tambahkan semua variabel

**Self-Hosted**
- Setup environment variables di server
- Gunakan `.env` file atau system environment variables

### 2. Firebase Configuration

1. **Enable Google Auth**:
   - Firebase Console → Authentication → Sign-in method
   - Enable Google provider

2. **Authorized Domains**:
   - Tambahkan domain production ke authorized domains
   - Format: `yourdomain.com`, `www.yourdomain.com`

3. **Firestore Rules** (Jika menggunakan Firestore):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /music/{musicId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Build & Deploy

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod
```

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security Checklist

Sebelum go-live:

- [ ] Semua API keys di environment variables (tidak hardcoded)
- [ ] `.env.local` tidak di-commit ke git
- [ ] HTTPS enabled
- [ ] Firebase authorized domains sudah dikonfigurasi
- [ ] CORS settings sudah benar
- [ ] Rate limiting diimplementasikan (opsional)
- [ ] Error messages tidak mengekspos informasi sensitif
- [ ] Security headers aktif

## 📊 Monitoring

Setelah deployment:

1. **Monitor API Usage**: Pantau penggunaan API untuk kontrol biaya
2. **Error Tracking**: Setup error tracking (Sentry, dll)
3. **Analytics**: Setup analytics untuk tracking user behavior
4. **Performance**: Monitor Core Web Vitals

## 🐛 Troubleshooting

### API Key tidak bekerja
- Pastikan environment variables sudah di-set di platform
- Restart deployment setelah menambah environment variables
- Check logs untuk error messages

### Firebase Auth tidak bekerja
- Pastikan domain sudah ditambahkan ke authorized domains
- Check Firebase console untuk error logs
- Pastikan API key sudah benar

### Build Error
- Check Node.js version (minimal 18)
- Pastikan semua dependencies terinstall
- Check build logs untuk detail error
