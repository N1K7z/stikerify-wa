/**
 * WhatsApp Stiker Bot
 *
 * Library yang digunakan:
 * - whatsapp-web.js: Library untuk koneksi dan interaksi dengan WhatsApp Web API
 * - qrcode: Library untuk menampilkan QR code di terminal saat scan
 * - wa-sticker-formatter: Library untuk membuat stiker WhatsApp dengan metadata (pack name, author)
 *
 * Session: LocalAuth untuk menyimpan session secara lokal
 */

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const fs = require("fs");
const path = require("path");

// Pastikan folder SIMPAN-FOTO ada untuk menyimpan gambar asli user
const SIMPAN_FOTO_DIR = path.join(__dirname, "SIMPAN-FOTO");
if (!fs.existsSync(SIMPAN_FOTO_DIR)) {
  fs.mkdirSync(SIMPAN_FOTO_DIR, { recursive: true });
}

// Konfigurasi default untuk stiker
const packName = "bot dari +639095317265";
const authorName = "N1K";

// Inisialisasi client WhatsApp dengan LocalAuth untuk menyimpan session
const client = new Client({
  authStrategy: new LocalAuth({
    sessionId: "bot-session",
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
});

// Event: QR Code muncul di terminal saat pertama kali run atau session expired
client.on("qr", (qr) => {
  console.log("=== SCAN QR CODE DI BAWAH INI ===");
  QRCode.toString(qr, { small: true, width: 20 }, (err, code) => {
    if (err) return console.error(err);
    console.log(code);
  });
  console.log("Setelah discan, bot akan otomatis tersimpan session.");
});

// Event: Client siap digunakan setelah scan berhasil
client.on("ready", () => {
  console.log("✅ Tidak perlu di scan QR lagi, siap di gunakan!");
  console.log(`Pack Name: "${packName}"`);
  console.log(`Author: "${authorName}"`);
  console.log("Ketik .help di whatsapp untuk bantuan");
});

// Event: Pesan masuk dari pengguna
client.on("message", async (message) => {
  // CEGAH LOOPING - abaikan pesan dari bot sendiri
  if (message.fromMe) return;

  const text = message.body.toLowerCase();

  // Perintah bantuan
  if (text === ".help") {
    await client.sendMessage(
      message.from,
      "📋 *BANTUAN BOT STIKER*\n\n" +
        "Kirim gambar → ketik *.stiker* buat konversi\n\n" +
        "✅ Support JPG, PNG\n" +
        "🔄 Video & GIF (tahap perkembangan)\n\n" +
        "Contoh: Kirim gambar, lalu ketik .stiker",
    );
    return;
  }

  // Perintah konversi stiker
  if (text === ".stiker") {
    try {
      // Cek apakah pesan memiliki media
      if (!message.hasMedia) {
        await client.sendMessage(
          message.from,
          "❌ Tidak ada gambar/GIF. Kirim gambar dulu, lalu ketik .stiker.",
        );
        return;
      }

      // Download media
      const media = await message.downloadMedia();
      if (!media || !media.data) {
        await client.sendMessage(
          message.from,
          "Gagal bikin stiker. Kirim JPG/PNG/GIF biasa.",
        );
        return;
      }

      // Cek ukuran file (max 10MB)
      if (media.data.length > 10 * 1024 * 1024) {
        await client.sendMessage(
          message.from,
          "❌ File terlalu besar. Max 10MB.",
        );
        return;
      }

      // Konversi data ke Buffer
      const buffer = Buffer.from(media.data, "base64");

      // Simpan gambar asli ke folder SIMPAN-FOTO
      const timestamp = Date.now();
      const fromName = message.from.split("@")[0];
      const originalFilename = `${fromName}_${timestamp}.jpg`;
      const originalPath = path.join(SIMPAN_FOTO_DIR, originalFilename);
      fs.writeFileSync(originalPath, buffer);

      // Buat stiker menggunakan wa-sticker-formatter
      const sticker = new Sticker(buffer, {
        pack: packName,
        author: authorName,
        type: StickerTypes.FULL,
      });

      // Konversi ke buffer
      const stickerBuffer = await sticker.toBuffer();

      // Buat MessageMedia dari buffer untuk WhatsApp
      const messageMedia = new MessageMedia(
        "image/webp",
        stickerBuffer.toString("base64"),
        "sticker.webp",
      );

      // KIRIM STIKER - pakai client.sendMessage dengan MessageMedia
      await client.sendMessage(message.from, messageMedia, {
        sendMediaAsSticker: true,
      });
    } catch (error) {
      console.error("Error memproses stiker:", error);
      await client.sendMessage(
        message.from,
        "Gagal bikin stiker. Kirim JPG/PNG/GIF biasa.",
      );
    }
  }
});

// Event error
client.on("error", (error) => {
  console.error("Error:", error);
});

// Event auth failure
client.on("auth_failure", (msg) => {
  console.error("Auth failure:", msg);
});

// Mulai client
client.initialize();

module.exports = { client };
