const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const pesanFile = path.join(__dirname,'..','src','data','pesan.json');
// Pastikan file JSON sudah ada, jika belum, buat file kosong
if (!fs.existsSync(pesanFile)) {
    fs.writeFileSync(pesanFile, JSON.stringify([]));
}

router.post('/',(req, res) => {
    const nama = req.body.namaPengirim;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = req.body.location;
    const timestamp = new Date().toISOString();
    const show = true;
    const pesan = req.body.pesan

    // validasi nama
    if(!nama || nama.length > 20){
        return res.status(400).json({success:false, message:'Nama tidak boleh kosong atau melebihi 20 karakter'});
    }
    if (!pesan || pesan.length > 200) {
        return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong atau melebihi 500 karakter.' });
    }

    // Baca file JSON dan periksa apakah IP sudah ada
    fs.readFile(pesanFile, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let messagesData = JSON.parse(data || '{}');
        let messages = messagesData.messages || [];
        let ipTracker = messagesData.ipTracker || {};

        // Cek berapa kali IP ini sudah mengirim pesan
        if (ipTracker[ipAddress] && ipTracker[ipAddress] >= 3) {
            return res.status(429).json({success:false, message: 'Anda telah mencapai batas maksimal 3 kali pengiriman pesan.' });
        }

        // Tambahkan pesan baru
        const newMessage = {
            id : uuidv4(), // Buat ID unik
            nama,
            pesan,
            ip: ipAddress,
            date: timestamp,
            location,
            show
        };

        messages.push(newMessage);

        // Tambahkan atau perbarui counter untuk IP address
        ipTracker[ipAddress] = (ipTracker[ipAddress] || 0) + 1;

        // Simpan kembali data ke file JSON
        messagesData = { messages, ipTracker };

        fs.writeFile(pesanFile, JSON.stringify(messagesData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Gagal mengirim pesan.' });
            }
            res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
        });
    });

});
router.get('/',(req, res)=>{
    const pesans = JSON.parse(fs.readFileSync(pesanFile, 'utf-8'));
    res.json(pesans);
});

// Rute PUT untuk mengedit pesan
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { show } = req.body;

    // Update pesan di dalam file JSON
    const pesans = JSON.parse(fs.readFileSync(pesanFile, 'utf-8'));
    const index = pesans.findIndex(p => p.id === id);
    
    if (index !== -1) {
        pesans[index].show = show || pesans[index].show;
        fs.writeFileSync(pesanFile, JSON.stringify(pesans, null, 2));
        return res.json({ success: true, message: 'Pesan berhasil diperbarui.' });
    } else {
        return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }
});

// Rute DELETE untuk menghapus pesan
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // Hapus pesan dari file JSON
    const pesans = JSON.parse(fs.readFileSync(pesanFile, 'utf-8'));
    const newPesans = pesans.filter(p => p.id !== id);

    if (newPesans.length === pesans.length) {
        return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }

    fs.writeFileSync(pesanFile, JSON.stringify(newPesans, null, 2));
    return res.json({ success: true, message: 'Pesan berhasil dihapus.' });
});


module.exports = router