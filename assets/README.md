# Assets folder

Gunakan folder ini untuk menaruh semua aset statis situs undangan:

- `images/` atau `assets/images/` — letakkan semua gambar (cover, foto keluarga, ornamen). Rekomendasi nama file untuk cover:
  - `cover-small.jpg` (480px wide)
  - `cover-medium.jpg` (800px wide)
  - `cover-large.jpg` (1200px wide)

- `music/` atau `assets/music/` — letakkan file audio (mis. `music.mp3`). Pastikan ukuran tidak terlalu besar.

Tips:
- Kompres gambar sebelum diupload (kualitas 70-85%).
- Gunakan nama file tanpa spasi, pakai tanda `-` atau `_` jika perlu.
- Jika ingin pin pada peta, buka `index.html` dan tambahkan atribut `data-lat` dan `data-lng` ke elemen `#lokasi`.

Contoh struktur:
```
assets/
  README.md
  images/
    cover-small.jpg
    cover-medium.jpg
    cover-large.jpg
  music/
    music.mp3
```
