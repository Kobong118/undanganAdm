const express = require('express');
//const fs = require('fs');
//const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
 //  metode firebase
  const db = require('../firebase');
  const { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc ,setDoc} = require('firebase/firestore');


//const pesanFile = path.join(__dirname,'..','src','data','pesan.json');
//// Pastikan file JSON sudah ada, jika belum, buat file kosong
//if (!fs.existsSync(pesanFile)) {
//    fs.writeFileSync(pesanFile, JSON.stringify([]));
//}

router.post('/',async(req, res) => {
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
//    fs.readFile(pesanFile, (err, data) => {
//        if (err) {
//            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
//        }
//
//        let messagesData = JSON.parse(data || '{}');
//        let messages = messagesData.messages || [];
//        let ipTracker = messagesData.ipTracker || {};
//
//        // Cek berapa kali IP ini sudah mengirim pesan
//        if (ipTracker[ipAddress] && ipTracker[ipAddress] >= 3) {
//            return res.status(429).json({success:false, message: 'Anda telah mencapai batas maksimal 3 kali pengiriman pesan.' });
//        }
//
//        // Tambahkan pesan baru
//        const newMessage = {
//            id : uuidv4(), // Buat ID unik
//            nama,
//            pesan,
//            ip: ipAddress,
//            date: timestamp,
//            location,
//            show
//        };
//
//        messages.push(newMessage);
//
//        // Tambahkan atau perbarui counter untuk IP address
//        ipTracker[ipAddress] = (ipTracker[ipAddress] || 0) + 1;
//
//        // Simpan kembali data ke file JSON
//        messagesData = { messages, ipTracker };
//
//        fs.writeFile(pesanFile, JSON.stringify(messagesData, null, 2), (err) => {
//            if (err) {
//                return res.status(500).json({ success: false, message: 'Gagal mengirim pesan.' });
//            }
//            res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
//        });
//    });
       try{
         // Referensi ke koleksi 'ipTracker'
    const ipDocRef = doc(db, 'ipTrackerPesan', ipAddress);
    const ipDocSnap = await getDoc(ipDocRef);

    // Cek berapa kali IP ini sudah mengirim pesan
    if (ipDocSnap.exists()) {
        const data = ipDocSnap.data();
        if (data.counter >= 3) {
            return res.status(429).json({ success: false, message: 'Anda telah mencapai batas maksimal 3 kali kirim pesan' });
        }

        // Update counter
        await updateDoc(ipDocRef, { counter: data.counter + 1 });
    } else {
        // Jika belum ada, buat dokumen baru
        await setDoc(ipDocRef, { counter: 1 });
    }

      const newMessage ={
        id : uuidv4(),
        nama,
        pesan,
        ip:ipAddress,
        date:timestamp,
        location,
        show
      }
         // Simpan pesan ke Firestore
    const donaturColRef = collection(db, 'pesan');
    await setDoc(doc(donaturColRef, newMessage.id), newMessage);

    res.status(200).json({ success: true, message: 'Pesan berhasil dikirim.' });
    }catch (error){
      res.status(500).json({success: false, message: `gagal mengirim pesan error:${error}`})
    }

});
router.get('/',async(req, res)=>{
//    const pesans = JSON.parse(fs.readFileSync(pesanFile, 'utf-8'));
//    res.json(pesans);
  try {
    // Ambil referensi ke koleksi 'pesan'
    const pesanColRef = collection(db, "pesan");

    // Dapatkan semua dokumen dari koleksi 'pesan'
    const pesanSnapshot = await getDocs(pesanColRef);

    // Cek apakah koleksi kosong
    if (pesanSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'Tidak ada pesan yang ditemukan.',
        data: []
      });
    }

    // Ubah snapshot menjadi array objek
    const pesanList = pesanSnapshot.docs.map(msg => ({
      id: msg.id,
      ...msg.data()
    }));

    // Kirimkan hasil sebagai respons
    res.json({ success: true, data: pesanList });
  } catch (error) {
    // Tangani kesalahan dan kirim respons error
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data, error: ${error.message}`
    });
  }

});


// Rute PUT untuk mengedit donatur
router.put('/:id', async(req, res) => {
    const { id } = req.params;
    const { show} = req.body;
  try {
    const pesan = doc(db,'pesan',id);
      await updateDoc(pesan,{show});
    res.status(200).json({success:true,message:'data berhasil di update'});
  }catch {
    res.status(500).json({success:false,message:`gagal mengupdate data id:${id}`});
  }


     // baca file JSON
//     fs.readFile(pesanFile,(err,data)=>{
//        if (err) {
//            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
//        }
//
//        let messagesData = JSON.parse(data || '{}');
//        let messages = messagesData.messages || [];
//        let ipTracker = messagesData.ipTracker || {};
//        const index = messages.findIndex(p => p.id === id);
//
//        if (index !== -1) {
//        messages[index].show = show;
//        // Simpan kembali data ke file JSON
//        messagesData = { messages, ipTracker };
//        fs.writeFileSync(pesanFile, JSON.stringify(messagesData, null, 2));
//        return res.json({ success: true, message: 'berhasil diperbarui.' });
//    } else {
//        return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
//    }
//    })
});

// Rute DELETE untuk menghapus donatur
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
   try{
     const pesan = doc(db,'pesan',id);
     await deleteDoc(pesan);
    res.status(200).json({success:true,message:'data berhasil di update'});
  }catch {
    res.status(500).json({success:false,message:`gagal mengupdate data id:${id}`});
  }




     // baca file JSON
//     fs.readFile(pesanFile,(err,data)=>{
//        if (err) {
//            return res.status(500).json({ error: 'Gagal membaca file pesan.' });
//        }
//
//        let messagesData = JSON.parse(data || '{}');
//        let messages = messagesData.messages || [];
//        let ipTracker = messagesData.ipTracker || {};
//        const newMessages = messages.filter(p => p.id !== id);
//
//        if (newMessages.length === messages.length) {
//                return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
//            }
//
//        // Simpan kembali data ke file JSON
//        messagesData = { donatur:newMessages, ipTracker };
//        fs.writeFileSync(pesanFile, JSON.stringify(messagesData, null, 2));
//        return res.json({ success: true, message: 'berhasil diperbarui.' });
//    })
});

module.exports = router
