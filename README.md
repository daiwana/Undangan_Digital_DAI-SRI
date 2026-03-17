# Undangan Pernikahan — Sri & Daiwana

Ringkasan
-------
Ini adalah undangan pernikahan berbasis web, elegan dan responsif, dibuat dengan HTML/CSS/JS tanpa framework. Siap di-push ke GitHub Pages.

Struktur proyek
----------------
- `index.html` — halaman utama
- `style.css` — stylesheet utama
- `script.js` — interaksi (overlay, countdown, audio, map)
- `assets/` — tempat meletakkan aset: cover images, music

Menambahkan aset
----------------
1. Cover image (recommended):
   - Tempatkan gambar berukuran berbeda untuk performa dan responsive `assets/cover-large.jpg`, `assets/cover-medium.jpg`, `assets/cover-small.jpg`.
   - `index.html` menggunakan `srcset` sehingga browser memilih ukuran terbaik.

2. Background audio (opsional):
   - Letakkan file audio MP3 di `assets/music.mp3`.
   - Sebuah tombol play/pause (ikon) tersedia di halaman. Audio hanya diputar setelah pengunjung membuka undangan (user gesture) atau menekan tombol.

3. Map coordinates (opsional):
   - Untuk menampilkan pin lokasi yang tepat, edit `index.html` dan tambahkan atribut `data-lat` dan `data-lng` ke elemen `<section id="lokasi">`.
     Contoh:
     `<section id="lokasi" data-address="Kp. Panuusan..." data-lat="-6.900000" data-lng="107.600000">`

Preview Lokal
--------------
Disarankan menjalankan server lokal agar iframe peta berfungsi dengan lancar. Jika Anda memiliki Python terpasang, jalankan dari folder proyek:
```powershell
python -m http.server 8000
# lalu buka http://localhost:8000
```

Publikasi ke GitHub Pages
-------------------------
1. Inisialisasi repo Git (jika belum):
```powershell
git init
git add .
git commit -m "Initial wedding invitation site"
```
2. Buat repository di GitHub, lalu tambah remote dan push ke branch `main`:
```powershell
git remote add origin https://github.com/<username>/<repo>.git
git branch -M main
git push -u origin main
```
3. Di GitHub, buka Settings → Pages dan pilih branch `main` root sebagai sumber. Setelah beberapa menit situs akan tersedia di `https://<username>.github.io/<repo>/`.

Tips optimasi gambar (manual)
----------------------------
- Buat versi ukuran 480px, 800px, dan 1200px untuk cover. Kompres file ke kualitas yang wajar (70–85%) menggunakan tools seperti ImageMagick atau layanan online.
- Nama file: `cover-small.jpg`, `cover-medium.jpg`, `cover-large.jpg`.

Otomatisasi optimasi gambar (opsional)
-----------------------------------
Saya menambahkan skrip Python kecil `tools/optimize_images.py` yang akan membuat 3 ukuran gambar dari file sumber. Cara pakai:

1. Pastikan Anda punya Python dan Pillow terinstal:
```powershell
python -m pip install --user Pillow
```

2. Letakkan file sumber (mis. hasil download dari chat Anda) di `assets/cover-source.jpg` atau lokasi lain yang Anda pilih.

3. Jalankan skrip:
```powershell
python tools/optimize_images.py --input assets/cover-source.jpg
```

4. Skrip akan membuat:
   - `assets/cover-large.jpg`
   - `assets/cover-medium.jpg`
   - `assets/cover-small.jpg`

Jika Anda ingin, saya bisa menjalankan optimasi ini untuk Anda jika Anda upload gambar sumber langsung ke workspace (atau beri tahu jika saya boleh mengekspor attachment yang Anda kirim di chat ke `assets/cover-source.jpg`).

Keamanan & Privasi
------------------
- Embedded Google Maps memuat konten dari Google. Jika Anda ingin menghindari iframe, tautkan saja ke Google Maps via `Lihat di Google Maps`.

Lain-lain
---------
Jika Anda ingin saya menambahkan optimasi otomatis (mis. GitHub Action untuk meng-resize gambar saat push), beri tahu dan saya akan membuat workflow contoh.
