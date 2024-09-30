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


// Rute PUT untuk mengedit donatur
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { show} = req.body;

     // baca file JSON
     fs.readFile(pesanFile,(err,data)=>{
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let messagesData = JSON.parse(data || '{}');
        let messages = messagesData.messages || [];
        let ipTracker = messagesData.ipTracker || {};
        const index = messages.findIndex(p => p.id === id);

        if (index !== -1) {
        messages[index].show = show;
        // Simpan kembali data ke file JSON
        messagesData = { messages, ipTracker };
        fs.writeFileSync(pesanFile, JSON.stringify(messagesData, null, 2));
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
     fs.readFile(pesanFile,(err,data)=>{
        if (err) {
            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
        }

        let messagesData = JSON.parse(data || '{}');
        let messages = messagesData.messages || [];
        let ipTracker = messagesData.ipTracker || {};
        const newMessages = messages.filter(p => p.id !== id);

        if (newMessages.length === messages.length) {
                return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
            }

        // Simpan kembali data ke file JSON
        messagesData = { donatur:newMessages, ipTracker };
        fs.writeFileSync(pesanFile, JSON.stringify(messagesData, null, 2));
        return res.json({ success: true, message: 'berhasil diperbarui.' });
    })
});

module.exports = router