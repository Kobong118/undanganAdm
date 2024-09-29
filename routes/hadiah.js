const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

const hadiahFile = path.join(__dirname,'..','src','data','hadiah.json');
// Pastikan file JSON sudah ada, jika belum, buat file kosong
if (!fs.existsSync(hadiahFile)) {
    fs.writeFileSync(hadiahFile, JSON.stringify([]));
}
// Rate limiter (3 kali pengiriman per IP dalam 1 jam)
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 jam
    max: 3, // Maksimal 3 request per IP
    message: { success: false, message: 'Anda telah mencapai batas pengajuan. Coba lagi dalam 1 jam.' }
});
router.route('/')
.post(limiter,(req, res) => {
    const nama = req.body.namaDonatur;
    const ip = req.ip;
    const location = req.body.location;
    const timestamp = new Date().toISOString();
    const show = req.body.show;
    const verifikasi = req.body.verifikasi

    // validasi nama
    if(!nama || nama.length > 20){
        return res.status(400).json({success:false, message:'Nama tidak boleh kosong atau melebihi 20 karakter'});
    }
    // simpan ke dalam file JSON
    const donatur = JSON.parse(fs.readFileSync(hadiahFile,'utf-8'));
    donatur.push({
        nama,
        ip,
        location,
        timestamp,
        show,
        verifikasi
    });
    fs.writeFileSync(hadiahFile,JSON.stringify(donatur,null,2));
    res.json({success:true, message:'permintaan berhasil dikirim!'});
})