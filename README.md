# Dinesan Andyking — Kalender Dinas & Foto IMO

Website mandiri menggunakan HTML, CSS, dan JavaScript. Tidak membutuhkan akun, database server, API key, atau instalasi paket JavaScript.


## Logo KAI di tab dan Layar Utama

Ikon tab browser, ikon PWA, ikon notifikasi, dan ikon Layar Utama Safari memakai logo KAI dari aset proyek. Nama aplikasi tetap **Dinesan Andyking**. Ikon berlatarkan putih, dengan logo di tengah. Tersedia favicon ICO/SVG/PNG, ikon Safari 180 × 180, dan ikon PWA 192 × 192 serta 512 × 512.

Unggah seluruh isi folder ini, termasuk folder **icons**, `favicon.ico`, `apple-touch-icon.png`, `manifest.webmanifest`, dan `sw.js`. Versi cache telah diperbarui agar aset baru dapat dimuat.

Untuk iPhone: buka website di Safari, lalu pilih **Bagikan → Tambahkan ke Layar Utama → Tambah**. Jika pintasan lama masih menunjukkan ikon sebelumnya, hapus pintasan tersebut dari Layar Utama, buka alamat web lagi di Safari, dan tambahkan kembali. Jangan hapus data situs karena jadwal tambahan tersimpan di perangkat.

Referensi: [Ikon Web Clip Safari](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html).

## Kalender dinas otomatis

Pilih **Grup dinas kamu** di atas kalender. Pilihan ini berlaku untuk kalender, pencarian tanggal, hari ini/besok, foto timestamp, rekap, dan pengingat. Pilihan grup tersimpan di perangkat; perangkat temanmu dapat memilih grup masing-masing.

Patokan **2 dan 3 Oktober 2026** mengikuti gambar dan keterangan pengguna:

| Grup | 2 Oktober 2026 | 3 Oktober 2026 | Awal MALAM 1 terdekat |
| --- | --- | --- | --- |
| A | PAGI 1 | PAGI 2 | 6 Oktober 2026 |
| B | SIANG 1 | SIANG 2 | 8 Oktober 2026 |
| C | MALAM 1 | MALAM 2 | 2 Oktober 2026 |
| D | LIBUR 1 | LIBUR 2 | 4 Oktober 2026 |

Setiap grup mengikuti siklus yang sama setiap 8 hari:

**MALAM 1 → MALAM 2 → SIANG 1 → SIANG 2 → PAGI 1 → PAGI 2 → LIBUR 1 → LIBUR 2**.

Perhitungan berlaku ke depan dan ke belakang, termasuk pergantian bulan, tahun, dan tahun kabisat. Contoh untuk Grup A: 4 Oktober 2026 Libur 1; 5 Oktober Libur 2; 6 Oktober Malam 1; 7 Oktober Malam 2; 14 Oktober Malam 1 lagi. Tanggal dinas malam adalah tanggal mulai dinas.

Kalender mempunyai 7 kolom hari seperti kalender HP, pilihan bulan/tahun, tombol bulan sebelumnya/berikutnya, tombol Hari ini, pengingat hari ini/besok, dan pencarian tanggal. Kalender dapat mencari tanggal dari tahun 1900 sampai 9999 tanpa perlu mengisi jadwal setiap tanggal.

Ketuk tanggal untuk membuka editor. **Dinas utama** dapat diubah pada tanggal itu saja. Pilih **Sesuai pola otomatis** untuk kembali mengikuti siklus. **Dinas tambahan / menutupi rekan** dapat ditambahkan lebih dari satu, disertai IJK khusus dan catatan/nama rekan. Dinas tambahan tampil bersama jadwal utama, termasuk pada hari LIBUR. Menambah dinas atau mengubah satu tanggal tidak menggeser pola pada tanggal lain. Tekan **Simpan dinas** untuk menyimpan.

Tanda **+** menunjukkan dinas tambahan; **\*** menunjukkan dinas utama diubah manual. Pencarian tanggal, kalender, pengingat hari ini/besok, dan pengingat notifikasi semuanya membaca perubahan tersebut. Pengaturan jadwal disimpan otomatis setelah tombol Simpan di browser/perangkat yang sama. Jadwal dinas tambahan tidak hilang ketika halaman dibuka ulang. Perubahan dan dinas tambahan dipisahkan per grup: mengedit Grup B tidak mengubah Grup A. Grup baru tidak mewarisi perubahan manual dari grup lain.

## Pengingat 3 jam sebelum IJK (WIB)

| Dinas | IJK | Pengingat |
| --- | --- | --- |
| MALAM | 22.00 | 19.00 |
| SIANG | 15.00 | 12.00 |
| PAGI | 07.00 | 04.00 |

Pengingat selalu **180 menit sebelum IJK**. Hari LIBUR tidak memiliki alarm; jika hari itu mempunyai dinas tambahan, dinas tambahannya tetap mempunyai alarm. IJK tambahan yang kosong memakai jam standar sesuai dinas. Bila IJK khusus diisi, alarm dihitung 3 jam sebelum IJK tersebut, termasuk bila waktu pengingat jatuh pada tanggal sebelumnya. Waktu IJK terpisah dari jam timestamp foto yang diacak.

Buka **Pengingat & notifikasi**, lalu tekan **Aktifkan notifikasi web** dan izinkan notifikasi. Gunakan **Tes notifikasi** untuk memeriksa. Fitur notifikasi memerlukan HTTPS atau localhost, browser yang mendukung, dan izin perangkat. Di iPhone/iPad yang mendukung notifikasi web, tambahkan website ke Layar Utama melalui Safari dan buka dari ikon tersebut sebelum meminta izin.

**Batas notifikasi web dalam paket statis ini:** aplikasi mengecek pengingat setiap 30 detik ketika halaman berjalan. Browser dapat menghentikan tab saat tidur atau di latar belakang. Tidak ada penjadwal server/push, sehingga notifikasi web tidak dijamin saat aplikasi ditutup, HP terkunci, atau tab ditangguhkan. Pengingat yang baru dicek lebih dari 5 menit setelah waktunya tidak dikirim sebagai notifikasi terlambat.

Untuk pengingat saat website ditutup, gunakan **Unduh kalender HP (.ics)**. File berisi jadwal grup terpilih pada bulan yang sedang dilihat, perubahan dinas utama, dinas tambahan, catatan, serta alarm 3 jam sebelum IJK. Impor file ke aplikasi Kalender yang mendukung .ics/VALARM dan periksa bahwa alarm serta izin notifikasi diaktifkan. Website tidak mengimpor file secara otomatis. Di Google Calendar, impor file melalui web desktop; kalender tersebut kemudian dapat tersinkron ke HP. Dukungan impor dan alarm mengikuti aplikasi kalender yang digunakan.

File .ics adalah salinan jadwal pada saat diunduh, bukan sinkronisasi langsung. Setelah mengubah dinas, perbarui acara di Kalender HP atau impor ulang hasil baru; periksa agar acara lama tidak terduplikasi. Jangan mengandalkan file lama untuk dinas yang baru diubah.

## Memasang kode dan PWA

Ekstrak ZIP, kemudian unggah **seluruh isi folder `imocam-manual`** ke hosting milikmu. Tidak ada GPT Site yang dibuat. Tidak perlu build, API key, atau database server. Semua URL aset bersifat relatif sehingga paket dapat dipakai dalam subfolder GitHub Pages.

Website dapat dipasang ke Layar Utama. `manifest.webmanifest` dan `sw.js` menyediakan tampilan standalone, ikon, dan cache agar kalender dapat dibuka tanpa internet setelah pernah dibuka online. Instalasi PWA tetap mengikuti dukungan browser. Saat membuat perubahan kode berikutnya, ganti versi cache di `sw.js` dan nomor versi URL CSS/JS agar cache lama dapat diperbarui.

Data petugas tetap memakai kunci penyimpanan semula. Draf foto bulanan lama disalin otomatis ke Grup A saat database perangkat diperbarui; sumber data lama tetap dipertahankan. Catatan/tambahan lama dan foto individual lama tetap menjadi milik Grup A. Draf bulanan maupun individual berikutnya dipisahkan per grup. Foto lama yang dinasnya diatur manual tetap dipertahankan; pilihan **OTOMATIS** pada kartu foto mengembalikannya ke jadwal utama kalender. Foto baru memakai jadwal otomatis. Dinas tambahan tidak mengganti dinas utama pada foto. Gunakan URL hosting/browser yang sama agar data sebelumnya tetap dapat diakses.

## Rekap foto satu bulan

Website pertama kali membuka **Kalender dinas**. Buka **Foto timestamp dan rekap bulanan** untuk melanjutkan rekap foto. Bulan dan mode terakhir kemudian diingat agar pekerjaan yang dicicil bisa langsung dilanjutkan. Mode **Kamera satu foto** tetap tersedia pada tab di atas. Secara bawaan, **Dinas otomatis sesuai grup & tanggal** aktif. Mengganti tanggal menyesuaikan dinas timestamp. Pada tanggal LIBUR, mode ini menampilkan kartu LIBUR yang dapat diunduh tanpa foto. Memilih salah satu dinas secara manual mematikan mode otomatis; centang kembali untuk mengikuti grup. Pilihan manual lama tetap dimuat sebagai manual.

Mengganti grup menyimpan draf grup sebelumnya terlebih dahulu lalu membuka draf grup yang dipilih. Jika foto belum berhasil disimpan, pergantian grup dihentikan agar foto pada sesi itu tetap bisa diunduh. Pilihan petugas tetap tersedia melalui menu **Ganti / simpan petugas**. File ZIP, JPG, ICS, dan kolom Grup dalam CSV mencantumkan grup agar hasil mudah dibedakan.

1. Pilih bulan dan petugas. Kalender menampilkan tanggal serta hari untuk seluruh bulan, termasuk bulan 28, 29, 30, atau 31 hari.
2. Dinas foto baru mengikuti jadwal tanggal tersebut secara otomatis. Kamu dapat memilih dinas manual bila perlu. Jika kumpulan foto sudah bertimestamp, aktifkan **Foto baru sudah bertimestamp**.
3. Tekan **Unggah banyak foto**, lalu pilih beberapa gambar. Foto diurutkan berdasarkan nama file (angka diurutkan secara alami: 1, 2, 10) dan dimasukkan ke tanggal kosong dari awal bulan. Satu tanggal memuat satu foto. Tanggal yang sudah berisi foto tidak ditimpa oleh unggah massal.
4. Periksa dan sesuaikan dinas/jam pada setiap kartu. Bisa juga memilih foto langsung pada tanggal tertentu melalui **Pilih / ganti foto**, atau menekan **Ambil foto** untuk mengambil selfie pada tanggal tersebut.
5. Klik gambar untuk membuka **Pratinjau hasil**. Di sini kamu dapat memindahkan foto ke tanggal lain, mengubah dinas dan jam, serta mengatur penutup timestamp lama. Pemindahan ke tanggal yang sudah terisi akan menukar kedua foto beserta pengaturannya.
6. Tekan **Unduh foto ini** untuk satu JPG, atau **Unduh … foto ZIP** untuk semua tanggal yang berisi foto. Foto kerja diekspor sebagai JPG dengan ukuran piksel asli. Paket juga berisi tabel `REKAP_YYYY-MM.csv`.

**Terapkan ke foto yang terisi** mengganti dinas foto kerja dalam bulan tersebut. Jam yang diatur manual dan tanggal LIBUR tetap dipertahankan; jam mode acak mengikuti rentang dinas baru.

Tanggal tanpa foto tetap kosong, kecuali jika ditandai LIBUR. Unggah massal melewati tanggal LIBUR. Bila file yang dipilih melebihi jumlah tanggal kerja kosong, file sisanya tidak dimasukkan dan jumlahnya ditampilkan. File rusak atau format tidak didukung juga dilaporkan. Maksimal ukuran tiap foto adalah 30 MB.

## Serah Terima dan PDF bulanan

1. Pilih grup, lalu buka tab **Serah Terima** di sebelah **Kamera satu foto**. Pilih bulan rekap.
2. Pada tanggal dinas, pilih **Unggah dokumen** (foto atau PDF tanpa sandi, maksimal 30 MB) atau **Ambil foto**. Kamera belakang tersedia melalui HTTPS atau localhost. Foto diambil pada ukuran aslinya tanpa timestamp, zoom, atau potong. File dapat diganti atau dihapus. Tanggal **LIBUR** mengunci kedua opsi.
3. Tambahkan foto dokumentasi dan Smartcard bila perlu di **Foto timestamp dan rekap bulanan**. Unggahan dari tab Serah Terima dan dari kartu tanggal memakai data yang sama. Memindah foto dokumentasi tidak memindah dokumen serah terima.
4. Tekan **Unduh PDF Bulanan** dari salah satu tampilan. PDF A4 mendatar berisi sampul identitas **STASIUN JAKARTAKOTA · DAOP 1 JAKARTA**, halaman Smartcard, dan kolom Tanggal, Kegiatan, Dokumentasi, dan Serah Terima.
5. Dokumen muncul di kolom **Serah Terima** pada tanggalnya. PDF dengan beberapa halaman mendapat lembar lanjutan pada tanggal yang sama. Kolom yang belum diisi dibiarkan kosong. Hari LIBUR ditandai **LIBUR** dan tidak menampilkan unggahan.

Draf foto dan serah terima disimpan per grup dan tanggal di perangkat ini. Smartcard disimpan per grup dan NIPP. PDF dibuat di browser. Pilihan unduhan ZIP tetap tersedia.

## Hari LIBUR

Pilih **LIBUR** pada menu dinas tanggal tertentu. Tanggal tersebut tidak memerlukan foto atau kamera. Kartu memakai poster KAI / OPERASI / DAOP 1 JAKARTA dari gambar yang diberikan, dengan nama, NIPP, jabatan, UPT, dan keterangan LIBUR. Tanggal serta nama hari mengikuti tanggal kartu. Jam tetap **17:16:39**, seperti contoh; tidak diacak.

Kartu LIBUR masuk ke unduhan ZIP dan tabel rekap. Poster mempertahankan bentuk potret asli dan diekspor berukuran **1200 × 2132**. Jika tanggal sudah pernah memiliki foto, memilih LIBUR menyembunyikan foto tersebut; memilih dinas kembali memulihkan foto sebelumnya.

## Kamera per tanggal

Tekan **Ambil foto** pada tanggal kerja yang diinginkan. Kamera menampilkan pratinjau dengan tanggal, dinas, nama, serta jam yang sudah dipilih. Tekan **Ambil & simpan foto** untuk memasukkan hasil langsung ke tanggal itu. Kamera depan dicerminkan seperti pratinjau. Kamera dilepas saat dialog ditutup atau foto sudah diambil.

Kamera memakai tampilan normal. Aplikasi menyalin seluruh frame pada ukuran piksel yang diterima dari kamera, tanpa pengaturan zoom, crop, peregangan, atau pemaksaan rasio. Pratinjau menyesuaikan layar dengan proporsi asli. Kamera depan tetap dicerminkan seperti sebelumnya. Pilihan lensa dan ukuran frame bawaan bergantung pada kamera HP dan browser. Foto yang sudah terpotong pada versi lama tetap mengikuti file sumber yang tersimpan.

Fitur ini membutuhkan HTTPS atau localhost, dan izin kamera browser. Gunakan **Go Live** di VS Code untuk menjalankannya di laptop. Jika kamera tidak tersedia, tetap bisa memilih foto dari perangkat pada tanggal tersebut.

## Foto yang sudah bertimestamp

Kode ini menutup area bawah dengan bidang gelap sebelum menambahkan timestamp baru. Aktifkan **Timestamp lama** pada kartu atau **Tutup timestamp lama** di pratinjau. Tinggi penutup dapat disesuaikan dari 19% sampai 45% foto. Periksa pratinjau karena posisi tulisan lama dapat berbeda untuk setiap gambar.

Bagian gambar yang tertutup tulisan lama tidak dipulihkan. Penutup juga menutupi bagian foto di area tersebut. Jika timestamp lama berada di luar area bawah, hasilnya perlu disesuaikan sebelum diunduh. Tidak ada pembacaan otomatis tanggal/dinas dari tulisan lama: tanggal dan dinas ditetapkan melalui kontrol website.

Pada foto yang sudah bertimestamp, penambahan logo KAI baru dimatikan secara bawaan untuk menjaga logo yang sudah ada. Aktifkan **Tambahkan logo KAI** jika sumber fotonya belum memiliki logo. Foto bersih memakai bidang transparan seperti template asli.

## Draf bulanan di perangkat

Foto asli, thumbnail, status LIBUR, tanggal, dinas, jam, dan pengaturan penutup disimpan otomatis di IndexedDB pada browser/perangkat yang sama. Menutup dan membuka kembali website memuat draf bulan terakhir. Mode **Kamera satu foto** juga menyimpan foto terakhir dan pengaturannya. Tidak ada server penyimpanan foto dan tidak perlu backend.

Gunakan alamat website yang sama setiap kali (termasuk port localhost yang sama) untuk memuat draf. Berpindah browser/perangkat, memakai mode privat, atau membersihkan data situs dapat menghapus akses ke draf. Unduh ZIP sebagai salinan hasil.

Jika penyimpanan diblokir atau ruang browser tidak cukup, status draf menampilkan keterbatasannya. Foto pada sesi yang masih terbuka tetap bisa diproses dan diunduh. Draf foto belum dianggap tersimpan sebelum status menampilkan **Draf tersimpan di perangkat**.

Setiap kartu juga menampilkan status penyimpanan. Kamu bisa mengisi satu atau beberapa tanggal hari ini lalu melanjutkan besok. Data ini berada di penyimpanan situs pada perangkat, bukan otomatis sebagai file di galeri/folder Downloads. Untuk mendapatkan file biasa, gunakan tombol unduh JPG atau ZIP.

## Memperbarui file di GitHub

Ekstrak ZIP terbaru, buka folder `imocam-manual`, lalu unggah **seluruh isinya**, termasuk folder `assets`, `icons`, dan `vendor`, ke lokasi `index.html` lama melalui **Add file → Upload files**. Commit perubahan setelah unggahan selesai. Pastikan `monthly-report.js` dan `report-logos.js` ikut terunggah. Pertahankan lokasi `index.html`; tidak perlu menghapus data situs untuk memperbarui kode. Paket ini hanya berisi kode dan tidak menerbitkan website otomatis.

## Cara paling mudah

1. Ekstrak ZIP. Semua file harus tetap berada di folder yang sama.
2. Buka `index.html` untuk melihat tampilan dan memakai **Pilih foto**.
3. Pilih petugas tersimpan atau isi nama dan NIPP, lalu tekan **Simpan Petugas**. Pilih tanggal foto dan dinas; nama hari muncul otomatis.
4. Ketik jam pada kolom **Jam pada foto**, atau tekan **Acak jam** untuk mengikuti rentang dinas.
5. Aktifkan kamera, ambil foto dalam tampilan normal, lalu tekan **Unduh foto JPG**.

Kamera browser memerlukan alamat aman **HTTPS** atau **localhost**. Bila kamera tidak berjalan saat membuka file langsung, jalankan dengan cara di bawah. Pemilihan gambar tetap dapat dipakai langsung dari `index.html`.

## Menjalankan kamera di laptop

Jika Python sudah terpasang, buka terminal di folder ini dan jalankan:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000` di Chrome atau Edge. Di Windows kamu juga bisa mencoba `py -m http.server 8000`.

Alternatif di VS Code: buka folder ini, gunakan ekstensi Live Server, lalu pilih **Open with Live Server** pada `index.html`.

## Memasang di website sendiri

Upload seluruh isi folder ini, termasuk `index.html`, semua file CSS/JS, `manifest.webmanifest`, `sw.js`, dan folder `assets` ke direktori website kamu, misalnya `public_html/imocam/`. Buka alamatnya dengan **HTTPS**. Tidak ada proses build dan tidak memerlukan server backend.

Untuk selfie di HP, buka alamat HTTPS tersebut, izinkan akses kamera, lalu ambil foto. Membuka alamat IP laptop melalui HTTP dari HP biasanya tidak dapat mengakses kamera; gunakan hosting HTTPS.

## Ketentuan tanggal dan jam

| Dinas | Rentang jam acak |
| --- | --- |
| PAGI | 07:00:00 sampai 14:59:59 |
| SIANG | 15:00:00 sampai 21:59:59 |
| MALAM | 22:00:00 sampai 23:59:59 |

Tanggal pada hasil foto selalu mengikuti tanggal yang dipilih. Jam acak malam dibatasi sebelum 24:00 supaya tidak mengubah tanggal. Tanggal awal mengikuti Asia/Jakarta.

Jam dapat diketik manual (00:00:00–23:59:59) atau diacak mengikuti dinas. Mode **Manual** mempertahankan jam saat tanggal/dinas diganti. Tombol **Acak jam** mengaktifkan kembali mode **Acak**. Mengambil atau mengunduh foto tidak mengacak ulang jam.

## Simpan petugas

Nama dan NIPP bawaan adalah Andisa, dengan jabatan **PLR**. Buka **Ganti / simpan petugas**, lalu isi **Nama, NIPP, dan Jabatan**. Jabatan dapat diketik bebas, maksimal 40 karakter, misalnya PLR, PAP, atau PPKA. Tekan **Simpan Petugas** untuk menyimpan ketiganya. Jabatan dipakai pada timestamp foto, kartu LIBUR, dan kolom Jabatan dalam rekap CSV. Nama di foto otomatis memakai huruf besar. Menu **Petugas tersimpan** bisa dipakai memilih kembali petugas. Menyimpan NIPP yang sudah ada memperbarui nama dan jabatannya. Setiap petugas tersimpan memiliki jabatan sendiri; memilih petugas memuat kembali ketiga kolomnya. Data petugas lama yang belum memiliki kolom jabatan tetap dapat dimuat dengan jabatan bawaan PLR. Petugas terakhir yang disimpan/dipilih dimuat lagi saat halaman dibuka.

Data petugas tersimpan melalui localStorage di browser/perangkat yang sama. Data tidak disinkronkan antarperangkat dan dapat hilang saat data situs dibersihkan. Browser yang memblokir penyimpanan tetap bisa memakai petugas untuk sesi saat ini. Foto dan pengaturan draf disimpan otomatis melalui IndexedDB jika tersedia.

## Koordinat manual

Digit paling akhir latitude dan longitude dari template diberi variasi saat foto diambil atau dipilih. Contoh bentuknya tetap `-6.137646x, 106.8157x`. Tombol **Acak koordinat** mengganti variasi tanpa mengganti foto. Pratinjau dan unduhan menggunakan nilai yang sama; mengubah nama, tanggal, dan jam tidak mengacak koordinat. Ini merupakan data manual, bukan lokasi hasil GPS.

Dalam mode bulanan, setiap foto memiliki variasinya sendiri yang disimpan bersama draf. Mengekspor ulang ZIP mempertahankan koordinat dan jam yang sudah dipilih.

## Template dan nilai bawaan

Nama: ANDISA JATI APRILIA ABADI. NIPP: 76121. Jabatan: PLR. UPT: STASIUN JAKARTAKOTA. Lokasi: -6.1376467, 106.81578.

Logo kiri atas berasal dari template yang diberikan. Bidang gelap transparan dan enam baris teks mengikuti susunan foto referensi. Baris alamat menggunakan akhiran `KOTA JAKAR...` seperti referensi. Font memakai Courier New/monospace; hasil raster dapat sedikit berbeda dari font dan kompresi aplikasi asal.

Lokasi merupakan koordinat manual dengan variasi digit akhir, bukan pembacaan GPS. Waktu pada foto merupakan waktu manual, bukan waktu pengambilan yang terverifikasi. Website tidak mengubah EXIF foto asal. Foto diproses di browser dan tidak dikirim ke server oleh kode ini.

## Mengubah data dan tampilan

- `index.html`: struktur dan label tampilan.
- `style.css`: warna, ukuran, dan tata letak.
- `app.js`: nilai bawaan dalam `PROFILE`, daftar petugas, waktu manual/acak, dan jadwal dalam `SHIFT_WINDOWS`, kamera, dan penggambaran foto.
- `monthly.js`: kalender, unggah massal, draf foto per grup di IndexedDB, pratinjau, pemindahan tanggal, dan ekspor rekap.
- `duty-schedule.js`: siklus 8 hari, patokan tetap Grup A–D, dan pilihan grup tersimpan.
- `duty-groups.js`: pergantian grup dan sinkronisasi seluruh tampilan.
- `duty-planner.js`: perubahan dinas utama dan tambahan per grup.
- `duty-reminders.js`: pengingat IJK, notifikasi, dan ekspor kalender HP per grup.
- `leave.js` dan `assets/libur-template.jpg`: poster LIBUR asli beserta penggambaran data tanggal/petugas.
- `daily-camera.js`: kamera per tanggal serta penyimpanan/pemulihan foto mode individual.
- `zip.js`: penulisan arsip ZIP tanpa pustaka eksternal. File JPG sudah terkompresi sehingga disimpan langsung dalam arsip.
- `assets/kai.png`: salinan aset logo. Logo juga ditanam di `app.js` agar unduhan tetap berjalan saat file HTML dibuka langsung.

Foto unggahan dan kamera memakai ukuran serta rasio aslinya. Logo kiri atas dan timestamp di bagian bawah mengikuti susunan referensi IMO Cam. Sumber foto disimpan terpisah sehingga perubahan tanggal tidak menumpuk timestamp. Kedua mode menyimpan draf lokal bila penyimpanan tersedia.

Tema halaman memakai latar cerah dengan biru, mint, dan peach. Kartu foto beraksen mint, sedangkan kartu LIBUR beraksen peach. Warna tema dapat disesuaikan melalui variabel pada bagian awal `style.css`.

## Referensi dukungan pengingat

- [Notifications API dan izin](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API)
- [Push API untuk notifikasi dari server](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Notifikasi web pada iPhone dan iPad](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)
- [Impor file ICS ke Google Calendar](https://support.google.com/calendar/answer/37118?hl=en)
- [Format iCalendar dan VALARM](https://datatracker.ietf.org/doc/html/rfc5545)
