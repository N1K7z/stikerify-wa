# WhatsApp Stiker Bot

Bot WhatsApp untuk mengkonversi gambar/GIF menjadi stiker WebP 512x512 menggunakan library 

## 🚀 TUTORIAL PENGGUNAAN (untuk pemula)

### Langkah 1: Instal Node.js
Pastikan komputer sudah terinstal **Node.js** (versi 16 atau lebih baru).
- Download di: https://nodejs.org
- Pilih versi **LTS** (Long Term Support)
- Install dengan cara biasa (klik next-next)

### Langkah 2: Instal Dependensi Bot
Buka **Command Prompt** atau **Terminal**, lalu ketik:
```bash
cd "path/ke/folder/bot-wa"
npm install
```

**Penjelasan:**
- `npm install` akan mengunduh semua library yang dibutuhkan
- Proses ini butuh waktu 1-5 menit tergantung koneksi internet
- Tunggu sampai prosesnya selesai (tidak ada pesan error)

### Langkah 3: Jalankan Bot
Setelah instalasi selesai, ketik:
```bash
npm start
```

### Langkah 4: Scan QR Code
- Buka WhatsApp di ponsel Anda
- Pilih **Menu (titik tiga) → Perangkat Terhubung**
- Pilih **Sambungkan perangkat**
- Arahkan kamera ke QR code yang muncul di terminal

### Langkah 5: Mulai Gunakan
Setelah terhubung, ketik di chat bot:
- `!help` - Bantuan
- Kirim gambar → ketik `!stiker` - Konversi ke stiker

## ⚠️ TROUBLESHOOTING (Masalah Umum)

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `Cannot find module 'qrcode'` | Dependensi belum terinstal | Jalankan `npm install` dulu |
| `npm install` gagal | Koneksi internet lambat/permission | Coba `sudo npm install` (Linux/Mac) atau run as admin (Windows) |
| QR code tidak muncul | Package belum terinstal | Pastikan semua step di atas sudah benar |
| Stiker tidak terkirim | Format gambar tidak didukung | Kirim JPG, PNG, atau GIF |
| File terlalu besar | Lewati batas 10MB | Kurangi ukuran gambar |

## Fitur

- ✅ Konversi gambar/GIF ke stiker WebP 512x512
- ✅ Penambahan metadata pack name dan author
- ✅ Perintah `!stiker` untuk memproses gambar
- ✅ Perintah `!help` untuk bantuan
- ✅ Perintah `!setpack nama|author` untuk mengubah metadata stiker
- ✅ Error handling (bukan gambar, terlalu besar, format tidak didukung)
- ✅ Optimasi bandwidth lokal (proses di server, kompresi optimal)
- ✅ Penyimpanan gambar asli user di folder `SIMPAN-FOTO`

## Library yang Digunakan

| Library | Fungsi |
|---------|--------|
| `whatsapp-web.js` | Koneksi dan interaksi dengan WhatsApp Web API |
| `sharp` | Resize gambar ke 512x512 dan konversi ke format WebP |
| `wa-sticker-formatter` | Membuat stiker WhatsApp dengan metadata (pack name, author) |
| `qrcode` | Menampilkan QR code di terminal saat scan |

## Batasan

- Maksimal 10MB per file
- Format yang didukung: JPG, PNG, WebP, MP4 (GIF)
- Ukuran stiker: 512x512 pixel

## Struktur File

```
bot-wa/
├── bot.js          # Logika utama bot (konversi, handling pesan)
├── index.js        # Entry point
├── package.json    # Dependencies
├── README.md       # Dokumentasi
├── .gitignore      # Ignore session & node_modules
├── SIMPAN-FOTO/    # Folder penyimpanan gambar asli user
└── session/        # Folder session (otomatis dibuat)
```

## Optimasi Bandwidth

- Semua proses dilakukan secara lokal di server bot
- Sharp menggunakan kompresi WebP yang optimal
- Session tersimpan lokal agar tidak perlu scan berulang
- Tidak ada unggahan ke server eksternal
- Gambar asli disimpan di `SIMPAN-FOTO` untuk referensi lokal
