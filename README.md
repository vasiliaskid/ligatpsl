# Website Liga Pemkab

Website klasemen liga Pemkab yang menampilkan informasi lengkap tentang 10 tim peserta, klasemen, jadwal pertandingan, hasil terbaru, dan statistik pemain.

## 🚀 Fitur Utama

- **Halaman Beranda**: Klasemen lengkap, pertandingan mendatang, dan statistik pemain
- **Halaman Peraturan**: Peraturan lengkap liga sepak bola
- **Halaman Pengurus Liga**: Informasi lengkap pengurus dan koordinator liga
- **Halaman Hasil**: Hasil pertandingan terbaru
- **Profil Tim**: 10 halaman profil tim dengan informasi detail
- **Bagan Playoff**: Visualisasi playoff juara untuk tim peringkat 1-4
- **Responsif**: Mendukung desktop, tablet, dan mobile
- **Tab Interaktif**: Top skor, kartu merah, dan kartu kuning

## 📁 Struktur Proyek

```
├── index.html                    # Halaman utama
├── regulations.html              # Halaman peraturan liga
├── officials.html                # Halaman pengurus liga
├── recent-results.html           # Halaman hasil
├── css/
│   └── styles.css               # File CSS utama
├── js/
│   ├── main.js                  # JavaScript untuk halaman utama
│   ├── results.js               # JavaScript untuk halaman hasil
│   └── team-profile.js          # JavaScript untuk profil tim
├── data/
│   └── data.js                  # Data liga (klasemen, jadwal, dll)
├── images/
│   ├── persija-logo.png         # Logo tim (placeholder)
│   ├── persib-logo.png
│   └── ...                      # Logo tim lainnya
├── team-profiles/
│   ├── team-profile-persija-jakarta.html
│   ├── team-profile-persib-bandung.html
│   └── ...                      # Profil tim lainnya
└── README.md                     # File ini
```

## 🛠️ Teknologi

- **HTML5**: Struktur website
- **CSS3**: Styling dan responsif design
- **JavaScript**: Interaktivitas dan render data
- **Google Fonts**: Font Roboto
- **Vanilla JS**: Tanpa framework untuk performa optimal

## 📊 Data Management

Semua data disimpan dalam file `data/data.js` dalam format JavaScript object dengan struktur:

- `standings`: Data klasemen tim
- `nextMatch`: Pertandingan mendatang
- `fixtures`: Jadwal lengkap
- `recentResults`: Hasil terbaru
- `topScorers`: Top skor
- `redCards`: Data kartu merah
- `yellowCards`: Data kartu kuning
- `teams`: Profil lengkap 10 tim
- `bracket`: Data playoff juara (top 4)

## 🚀 Deploy ke Netlify

### Langkah 1: Persiapan Repository GitHub

1. Buat repository baru di GitHub
2. Upload semua file project ke repository
3. Pastikan structure folder sudah benar

### Langkah 2: Connect ke Netlify

1. Login ke [Netlify](https://netlify.com)
2. Klik "New site from Git"
3. Pilih GitHub sebagai provider
4. Pilih repository yang telah dibuat
5. Set konfigurasi:
   - **Build command**: `(kosongkan atau isi dengan "none")`
   - **Publish directory**: `(kosongkan atau isi dengan ".")`
6. Klik "Deploy site"

### Langkah 3: Custom Domain (Opsional)

1. Di dashboard Netlify, pilih site yang sudah di-deploy
2. Go to "Site settings" → "Domain management"
3. Add custom domain jika diperlukan

## 🔄 Update Data

### Cara Update Data Melalui GitHub:

1. Buka file `data/data.js` di repository GitHub
2. Klik tombol "Edit" (ikon pensil)
3. Edit data sesuai kebutuhan:
   - Update skor pertandingan
   - Update klasemen
   - Tambah pertandingan baru
4. Scroll ke bawah, isi commit message
5. Klik "Commit changes"
6. Netlify akan otomatis redeploy website (biasanya 1-3 menit)

### Contoh Update Klasemen:

```javascript
// Update poin tim setelah pertandingan
{ team: "Persija Jakarta", played: 19, won: 15, drawn: 3, lost: 1, gf: 45, ga: 15, points: 48 }
```

### Contoh Tambah Pertandingan:

```javascript
// Tambah ke recentResults setelah pertandingan selesai
{ date: "2025-01-27", teams: "Persija Jakarta vs Bali United", score: "2-1", venue: "Stadion Utama GBK" }
```

## 🎨 Customization

### Mengganti Warna Tema:

Edit file `css/styles.css`, cari variabel warna utama:
- Primary: `#0B525B` (Deep Teal)
- Secondary: `#C0C0C0` (Silver)
- Neutral: `#FDF4E3` (Cream)
- Accent: `#0A4A52` (Dark Teal)
- Gold: `#FFD700` (untuk juara)

### Mengganti Logo Tim:

1. Upload logo baru ke folder `images/`
2. Update path di `data/data.js`:
```javascript
teams: [
    {
        name: "Persija Jakarta",
        profile: {
            logo: "images/persija-logo-baru.png", // Update path logo
            // ... data lainnya
        }
    }
]
```

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🐛 Troubleshooting

### Data Tidak Muncul:
1. Cek console browser (F12)
2. Pastikan file `data/data.js` tidak ada syntax error
3. Refresh halaman atau clear cache

### Gambar Tidak Muncul:
1. Pastikan path gambar benar di `data.js`
2. Cek apakah file gambar ada di folder `images/`
3. Gunakan format PNG atau JPG yang didukung

### Website Tidak Update:
1. Tunggu 2-3 menit setelah commit ke GitHub
2. Hard refresh browser (Ctrl+F5)
3. Cek Netlify deploy log jika masih bermasalah

## 📞 Support

Jika mengalami masalah, periksa:
1. Console browser untuk error JavaScript
2. Netlify deploy log untuk error deployment
3. Pastikan semua file path benar dan case-sensitive

## 📄 License

Website ini dibuat untuk keperluan liga Pemkab. Bebas dimodifikasi sesuai kebutuhan.

---

**Selamat menggunakan! ⚽**#
