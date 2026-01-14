# Security Documentation

## 🔐 Keamanan API Keys

### Prinsip Dasar

1. **Server-Side Only**: Semua API keys dan credentials hanya diakses di server-side
2. **Never Expose**: API keys tidak pernah dikirim ke client atau diekspos di browser
3. **Environment Variables**: Semua secrets disimpan di environment variables
4. **Encryption**: Data sensitif dapat dienkripsi menggunakan utility yang tersedia

### Implementasi

#### 1. API Routes (Server-Side)

Semua endpoint API berada di `/app/api/suno/*` yang hanya berjalan di server:

```typescript
// ✅ BENAR - Server-side only
export async function POST(request: NextRequest) {
  const apiKey = process.env.SUNO_API_KEY // ✅ Hanya diakses di server
  // ...
}
```

#### 2. Environment Variables

**Public Variables** (Aman untuk client):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- dll (semua `NEXT_PUBLIC_*`)

**Private Variables** (Hanya server-side):
- `SUNO_API_KEY` ❌ JANGAN pernah expose
- `SUNO_API_BASE_URL` ❌ JANGAN pernah expose
- `ENCRYPTION_KEY` ❌ JANGAN pernah expose

#### 3. Client-Side API Calls

Client hanya memanggil API routes internal:

```typescript
// ✅ BENAR - Client memanggil API route internal
apiClient.post('/api/suno/generate', data)

// ❌ SALAH - Jangan pernah expose API key ke client
const apiKey = 'sk-...' // ❌ JANGAN LAKUKAN INI
```

### Authentication

#### Token Verification

Setiap request ke API routes memerlukan Firebase Auth token:

```typescript
const token = await user.getIdToken()
apiClient.post('/api/suno/generate', data, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

Server memverifikasi token sebelum memproses request.

### Encryption Utility

Untuk data sensitif tambahan, gunakan encryption utility:

```typescript
import { encrypt, decrypt } from '@/lib/encryption'

const encrypted = encrypt('sensitive data')
const decrypted = decrypt(encrypted)
```

**Catatan**: Pastikan `ENCRYPTION_KEY` di environment variables adalah string 32 karakter yang kuat.

## 🛡️ Security Headers

Middleware menambahkan security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## ✅ Checklist Keamanan

Sebelum deploy ke production:

- [ ] Semua API keys di environment variables (tidak hardcoded)
- [ ] `.env.local` di `.gitignore`
- [ ] Tidak ada API keys di client-side code
- [ ] Firebase Auth sudah dikonfigurasi dengan benar
- [ ] HTTPS enabled di production
- [ ] Security headers sudah diaktifkan
- [ ] Rate limiting diimplementasikan (opsional tapi disarankan)
- [ ] Error messages tidak mengekspos informasi sensitif
- [ ] CORS dikonfigurasi dengan benar

## 🚨 Jika API Key Terbuka

Jika API key secara tidak sengaja ter-expose:

1. **Segera revoke/regenerate API key** di provider
2. **Update environment variables** dengan key baru
3. **Deploy ulang aplikasi**
4. **Monitor penggunaan** untuk aktivitas mencurigakan
5. **Review logs** untuk melihat apakah ada abuse

## 📚 Referensi

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
