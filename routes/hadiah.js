const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 

const hadiahFile = path.join(__dirname,'..','src','data','hadiah.json');
// Pastikan file JSON sudah ada, jika belum, buat file kosong
if (!fs.existsSync(hadiahFile)) {
    fs.writeFileSync(hadiahFile, JSON.stringify([]));
}

router.post('/',(req, res) => {
    const nama = req.body.namaDonatur;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = req.body.location;
    const timestamp = new Date().toISOString();
    const show = true;
    const verifikasi = false;

    // validasi nama
    if(!nama || nama.length > 20){
        return res.status(400).json({success:false, message:'Nama tidak boleh kosong atau melebihi 20 karakter'});
    }
    // Baca file JSON dan periksa apakah IP sudah ada
    fs.readFile(hadiahFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let hadiahData = JSON.parse(data || '{}');
        let donatur = hadiahData.donatur || [];
        let ipTracker = hadiahData.ipTracker || {};

        // Cek berapa kali IP ini sudah mengirim pesan
        if (ipTracker[ipAddress] && ipTracker[ipAddress] >= 3) {
            return res.status(429).json({success:false, message: 'Anda telah mencapai batas maksimal 3 kali pengajuan.' });
        }

        // Tambahkan pesan baru
        const newDonatur = {
            id : uuidv4(),
            nama,
            verifikasi,
            ip: ipAddress,
            date: timestamp,
            location,
            show
        };

        donatur.push(newDonatur);

        // Tambahkan atau perbarui counter untuk IP address
        ipTracker[ipAddress] = (ipTracker[ipAddress] || 0) + 1;

        // Simpan kembali data ke file JSON
        hadiahData = { donatur, ipTracker };

        fs.writeFile(hadiahFile, JSON.stringify(hadiahData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Gagal mengirim pengajuan.' });
            }
            res.status(200).json({ success: true, message: 'Pengajuan berhasil dikirim.' });
        });
    });
});
router.get('/',(req, res)=>{
    const donatur = JSON.parse(fs.readFileSync(hadiahFile, 'utf-8'));
    res.json(donatur);
});

// Rute PUT untuk mengedit verifikasi
router.put('/verifikasi/:id', (req, res) => {
    const { id } = req.params;
    const { verifikasi} = req.body;
    
    // baca file JSON
    fs.readFile(hadiahFile,(err,data)=>{
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let hadiahData = JSON.parse(data || '{}');
        let donatur = hadiahData.donatur || [];
        let ipTracker = hadiahData.ipTracker || {};
        const index = donatur.findIndex(p => p.id === id);

        if (index !== -1) {
        donatur[index].verifikasi = verifikasi;
        // Simpan kembali data ke file JSON
        hadiahData = { donatur, ipTracker };
        fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
        return res.json({ success: true, message: 'berhasil diperbarui.' });
    } else {
        return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
    }
    })
});

// Rute PUT untuk mengedit donatur
router.put('/show/:id', (req, res) => {
    const { id } = req.params;
    const { show} = req.body;

     // baca file JSON
     fs.readFile(hadiahFile,(err,data)=>{
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let hadiahData = JSON.parse(data || '{}');
        let donatur = hadiahData.donatur || [];
        let ipTracker = hadiahData.ipTracker || {};
        const index = donatur.findIndex(p => p.id === id);

        if (index !== -1) {
        donatur[index].show = show;
        // Simpan kembali data ke file JSON
        hadiahData = { donatur, ipTracker };
        fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
        return res.json({ success: true, message: 'berhasil diperbarui.' });
    } else {
        return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
    }
    })
});

// Rute DELETE untuk menghapus donatur
router.delete('/:id', (req, res) => {
    const { id } = req.params;
     // baca file JSON
     fs.readFile(hadiahFile,(err,data)=>{
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let hadiahData = JSON.parse(data || '{}');
        let donatur = hadiahData.donatur || [];
        let ipTracker = hadiahData.ipTracker || {};
        const newDonatur = donatur.filter(p => p.id !== id);

        if (newDonatur.length === donatur.length) {
                return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
            }

        // Simpan kembali data ke file JSON
        hadiahData = { donatur:newDonatur, ipTracker };
        fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
        return res.json({ success: true, message: 'berhasil diperbarui.' });
    })
});

module.exports = router