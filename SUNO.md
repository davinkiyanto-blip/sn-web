Product Requirements Document (PRD)
Nama Proyek: Suno AI Generator (Nama Kode: Melodia)
Versi: 1.0
Platform: Mobile friendly Web Responsive
Bahasa: Indonesia

1. Ringkasan Eksekutif
Aplikasi ini adalah wrapper klien yang canggih untuk layanan Suno AI, memungkinkan pengguna membuat, mengedit, dan memanipulasi musik menggunakan AI. Fokus utama adalah memberikan pengalaman pengguna (UX) yang jauh lebih baik daripada antarmuka standar, dengan desain yang clean, elegan, dan mobile-first.
2. Prinsip Desain (UI/UX)
 * Gaya Visual: Minimalist Modern. Menggunakan banyak white space (atau dark space untuk mode gelap), tipografi sans-serif yang bersih (seperti Inter atau SF Pro), dan sudut membulat (rounded corners).
 * Warna: Palet warna monokromatik (Hitam/Putih/Abu-abu) dengan satu warna aksen elegan (misalnya: Electric Indigo atau Neon Purple) untuk tombol aksi utama. Efek Glassmorphism halus pada navigasi dan player.
 * Navigasi: Bottom Navigation Bar untuk akses mudah di perangkat seluler.
 * Interaksi: Transisi halus, haptic feedback saat menekan tombol, dan loading skeleton yang elegan.
3. Struktur Aplikasi (Sitemap)
 * Landing Page (Public): Halaman muka untuk pengunjung yang belum login.
 * Auth (Login/Register): Modal atau halaman khusus autentikasi.
 * Home (Explore): Feed musik trending, riwayat pembuatan terakhir.
 * Create (Studio): Pusat pembuatan musik (Form Input).
 * Library (My Music): Daftar lagu yang dibuat pengguna.
 * Tools (Lab): Fitur lanjutan (Split, MIDI, Convert, Video).
 * Settings: Profil, manajemen kredit/limit.
4. Persyaratan Fungsional & Integrasi API
Berikut adalah detail fitur berdasarkan dokumentasi API yang disediakan, dipetakan ke dalam alur pengguna.
A. Fitur Utama: Pembuatan Musik (Create Tab)
1. Generate Music (Text-to-Audio)
 * UI:
   * Input Prompt: Text area besar minimalis ("Jelaskan lagu yang ingin Anda buat...").
   * Switch Mode: Toggle antara "Simple" (Hanya deskripsi) dan "Custom" (Lirik + Style).
   * Input Lirik (Custom): Text area untuk lirik buatan sendiri atau tombol "Generate Lyrics".
   * Input Style: Chips/Tags untuk genre (Pop, Jazz, Metal) atau text input manual.
   * Input Judul: Field opsional.
   * Tombol: "Create" (Besar, Floating Action Button atau lebar penuh di bawah).
 * API Endpoint: Generate music
   * Payload: prompt, tags, title, mv (model version).
2. Upload & Cover (Audio-to-Audio / Remix)
 * UI:
   * Area drag-and-drop atau tombol upload file audio.
   * Tombol rekam suara langsung (opsional).
   * Input Prompt untuk gaya baru (misal: "Ubah menjadi versi Jazz").
 * API Endpoint: Upload and cover
   * Fungsi: Mengunggah audio pengguna dan mengubah gayanya berdasarkan prompt.
B. Fitur Pengeditan (Studio/Edit Mode)
Diakses melalui menu "titik tiga" (...) pada kartu lagu di Library atau Player.
3. Extend Music (Lanjutkan Lagu)
 * UI:
   * Visualisasi gelombang audio (waveform).
   * Slider untuk memilih timestamp (titik mulai perpanjangan).
   * Input Prompt Baru (untuk bagian lanjutan).
 * API Endpoint: Extend music
   * Logic: Mengirim ID lagu yang ada + timestamp.
 * API Endpoint Alternatif: Upload and extend
   * Logic: Jika pengguna ingin memperpanjang file audio yang diunggah dari luar.
4. Add Vocals & Add Instrumental
 * UI:
   * Pilihan: "Isi vokal pada beat ini" atau "Buat musik untuk vokal ini".
 * API Endpoint:
   * Add vocals: Menambahkan suara pada track instrumental.
   * Add instrumental: Menambahkan musik latar pada rekaman vokal (acapella).
C. Fitur Utilitas (Tools Tab)
5. Separate Vocals (Stem Splitter)
 * UI:
   * Pilih lagu dari Library atau Upload.
   * Tombol "Split".
   * Hasil: Menampilkan dua track terpisah (Vokal & Instrumen) yang bisa diunduh.
 * API Endpoint: Separate vocals
6. Convert to MIDI
 * UI:
   * Pilih lagu -> Tombol "Get MIDI".
   * Output: Link download file .mid.
 * API Endpoint: Generate MIDI from audio
   * Catatan UX: Berikan notifikasi bahwa fitur ini sangat berguna untuk produser musik yang ingin mengedit notasi di DAW.
7. Convert to WAV (High Quality)
 * UI:
   * Tombol "Upgrade Quality" atau "Download WAV" pada player.
 * API Endpoint: Convert to WAV format
8. Create Music Video
 * UI:
   * Tombol ikon kamera/video pada detail lagu.
   * Preview video singkat.
 * API Endpoint: Create music video
D. Fitur Autentikasi & Landing Page
​9. Landing Page (Halaman Penjualan/Konversi)
​Tujuan: Mengonversi pengunjung menjadi pengguna terdaftar dengan menampilkan kemampuan aplikasi.
​Komponen UI:
​Hero Section: Headline besar ("Buat Musik Pro dalam Hitungan Detik"), Sub-headline, dan Tombol CTA Utama ("Mulai Gratis").
​Audio Showcase: Sesi featured yang berisi 3-5 sampel audio terbaik hasil generasi Suno (Pop, Rock, Jazz) yang bisa diputar langsung tanpa login.
​How it Works: 3 langkah visual ikonik (Ketik Ide -> Pilih Gaya -> Jadi Lagu).
​Footer: Tautan Kebijakan Privasi & Syarat Ketentuan (Penting untuk persetujuan Google Auth).
​10. Login & Registrasi (Firebase Auth)
​Metode: Single Sign-On (SSO) menggunakan Akun Google.
​Alur Pengguna:
​Pengguna mengklik "Masuk" atau "Mulai Gratis".
​Muncul Pop-up/Redirect ke Google Sign-In.
​Setelah sukses, sistem mengecek apakah ini pengguna baru atau lama.
​Pengguna Baru: Buat data user di database (Firestore/Database SQL) -> Arahkan ke Onboarding/Home.
​Pengguna Lama: Ambil data profil & library -> Arahkan ke Home.
​Data yang Disimpan: uid (Firebase UID), email, displayName, photoURL, createdAt.
5. Detail Antarmuka Pengguna (UI Breakdown)
5.1. Komponen Global
 * Player Bar (Sticky): Muncul di bagian bawah saat audio diputar. Berisi judul, tombol Play/Pause, tombol Next, dan progress bar tipis.
 * Loader: Animasi gelombang suara minimalis saat API sedang memproses (Processing).
5.2. Halaman Create (Formulir)
 * Gunakan pendekatan wizard atau accordion agar tidak membingungkan pengguna.
 * Section 1: Konsep. (Input Prompt).
 * Section 2: Detail. (Switch Instrumental/Vokal, Lirik).
 * Section 3: Model. (Pilih versi v3/v3.5/v4 jika API mendukung).
5.3. Halaman Library (Card Design)
 * Setiap lagu ditampilkan dalam kartu (Card).
 * Isi Kartu:
   * Cover Art (Dihasilkan AI).
   * Judul & Durasi.
   * Tags (Genre).
   * Tombol Aksi Cepat: Play, Extend, Download, Share.
 * Status Indikator: Pending, Streaming, Completed, Error.
5.4. Halaman Landing Page
Visual: Latar belakang gelap dengan animasi abstrak (gelombang partikel bergerak pelan) yang mencerminkan nuansa "AI" dan "Musik".
Tipografi: Judul Hero menggunakan font ukuran sangat besar (misal: 48px - 64px) dengan gradient text (warna Electric Indigo ke Neon Purple).
Sticky CTA: Pada tampilan mobile, tombol "Mulai Sekarang" tetap melayang di bawah layar saat pengguna menggulir ke bawah (Sticky Bottom).
5.5. Komponen Login
Desain: Modal minimalis di tengah layar (Web) atau Bottom Sheet (Mobile).
Tombol: Tombol standar "Continue with Google" dengan logo Google berwarna, latar belakang putih/terang (kontras dengan tema gelap aplikasi), dan teks hitam sesuai Brand Guidelines Google Identity.
6. Alur Teknis & Penanganan Error
 * Request Handling:
   * Saat pengguna menekan "Create", aplikasi mengirim request ke API.
   * API Suno biasanya bersifat asynchronous. Aplikasi harus melakukan polling (memeriksa status secara berkala) atau menggunakan webhook (jika tersedia) untuk memperbarui UI dari "Generating..." menjadi "Ready".
 * Error Handling:
   * Jika prompt melanggar kebijakan (NSFW/Copyright), tampilkan pesan toast yang sopan: "Maaf, prompt tidak dapat diproses. Coba deskripsi lain."
   * Jika kredit habis atau limit tercapai, arahkan ke modal "Top Up" atau info limit.
 * Manajemen Sesi (Session Handling):
   * Gunakan onAuthStateChanged dari Firebase SDK untuk memantau status login secara real-time.
   * Persistensi: Login harus tetap aktif (Persist) meskipun browser ditutup, sampai pengguna melakukan Logout.
   * Proteksi Rute: Jika pengguna yang belum login mencoba mengakses halaman /create atau /library, sistem harus otomatis mengarahkan (redirect) kembali ke Landing Page atau memunculkan Modal Login.
7. Skema Payload API (Referensi Developer)
Berikut adalah rangkuman endpoint utama untuk implementasi backend/frontend service:
| Fitur | Method | Endpoint Path (Relative) | Parameter Kunci |
|---|---|---|---|
| Generate | POST | /generate | prompt, mv, title, tags |
| Custom Gen | POST | /custom_generate | prompt (lyrics), tags, title |
| Extend | POST | /extend_audio | audio_id, continue_at |
| Upload | POST | /upload_audio | file |
| Cover | POST | /cover_audio | audio_id, prompt |
| Split | POST | /separate | audio_id |
| MIDI | POST | /to_midi | audio_id |
| Video | POST | /video | audio_id |
| WAV | POST | /concat (atau spesifik wav) | audio_id |
8. Catatan Pengembangan (Next Steps)
 * Validasi Token: Pastikan sistem autentikasi aman untuk menyimpan API Key pengguna atau server.
 * Audio Player: Gunakan library audio player yang mendukung streaming (karena URL audio mungkin bersifat sementara atau streaming chunks).
 * Storage: Pertimbangkan apakah hasil lagu akan disimpan lokal di perangkat pengguna atau hanya mengandalkan link dari API (Link API biasanya memiliki masa kadaluarsa, disarankan aplikasi menyimpan URL tersebut atau mengunduh asetnya).
 * Implementasi Firebase:
   - Setup: Buat proyek di Firebase Console -> Authentication -> Sign-in method -> Enable Google.
   - Whitelist Domain: Pastikan domain aplikasi (localhost untuk dev dan domain produksi untuk live) dimasukkan ke dalam Authorized Domains di pengaturan Firebase Auth.
   - Security Rules (Jika pakai Firestore):
     // Contoh aturan dasar: User hanya bisa baca/tulis datanya sendiri
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

 
Beberapa dokumentasi referensi:

Generate music
https://docs.kie.ai/suno-api/generate-music
Add vocals
https://docs.kie.ai/suno-api/add-vocals
Extend
https://docs.kie.ai/suno-api/extend-music
Separate vocals
https://docs.kie.ai/suno-api/separate-vocals
Generate MIDI from audio
https://docs.kie.ai/suno-api/generate-midi
Add instrumental 
https://docs.kie.ai/suno-api/add-instrumental
Create music video
https://docs.kie.ai/suno-api/create-music-video
Upload and extend
https://docs.kie.ai/suno-api/upload-and-extend-audio
Upload and cover
https://docs.kie.ai/suno-api/upload-and-cover-audio
Conver to WAV format
https://docs.kie.ai/suno-api/convert-to-wav