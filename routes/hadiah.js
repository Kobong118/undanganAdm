const express = require('express');
//const fs = require('fs');
//const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
  //  metode firebase
  const db = require('../firebase');
  const { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc ,setDoc} = require('firebase/firestore');



//const hadiahFile = path.join(__dirname,'..','src','data','hadiah.json');
// Pastikan file JSON sudah ada, jika belum, buat file kosong
//if (!fs.existsSync(hadiahFile)) {
//    fs.writeFileSync(hadiahFile, JSON.stringify([]));
//}

router.post('/', async (req, res) => {
    const nama = req.body.namaDonatur;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const location = req.body.location || null;
    const timestamp = new Date().toISOString();
    const show = true;
    const verifikasi = false;

    // validasi nama
    if(!nama || nama.length > 50){
        return res.status(400).json({success:false, message:'Nama tidak boleh kosong atau melebihi 20 karakter'});
    }
    // Baca file JSON dan periksa apakah IP sudah ada
  //  fs.readFile(hadiahFile, (err, data) => {
  //      if (err) {
  //          return res.status(500).json({ error: 'Gagal membaca file pesan.' });
  //      }

  //      let hadiahData = JSON.parse(data || '{}');
  //      let donatur = hadiahData.donatur || [];
  //      let ipTracker = hadiahData.ipTracker || {};

        // Cek berapa kali IP ini sudah mengirim pesan
  //      if (ipTracker[ipAddress] && ipTracker[ipAddress] >= 3) {
  //          return res.status(429).json({success:false, message: 'Anda telah mencapai batas maksimal 3 kali pengajuan.' });
  //      }

        // Tambahkan pesan baru
 //       const newDonatur = {
  //          id : uuidv4(),
   //         nama,
    //        verifikasi,
     //       ip: ipAddress,
     //       date: timestamp,
     //       location,
     //       show
     //   };

    //    donatur.push(newDonatur);

        // Tambahkan atau perbarui counter untuk IP address
   //     ipTracker[ipAddress] = (ipTracker[ipAddress] || 0) + 1;

        // Simpan kembali data ke file JSON
      //  hadiahData = { donatur, ipTracker };

       // fs.writeFile(hadiahFile, JSON.stringify(hadiahData, null, 2), (err) => {
        //    if (err) {
         //       return res.status(500).json({ success: false, message: 'Gagal mengirim pengajuan.' });
         //   }
         //   res.status(200).json({ success: true, message: 'Pengajuan berhasil dikirim.' });
       // });

  //  });
  //
       try{
         // Referensi ke koleksi 'ipTracker'
    const ipDocRef = doc(db, 'ipTracker', ipAddress);
    const ipDocSnap = await getDoc(ipDocRef);

    // Cek berapa kali IP ini sudah mengirim pesan
    if (ipDocSnap.exists()) {
        const data = ipDocSnap.data();
        if (data.counter >= 3) {
            return res.status(429).json({ success: false, message: 'Anda telah mencapai batas maksimal 3 kali pengajuan.' });
        }

        // Update counter
        await updateDoc(ipDocRef, { counter: data.counter + 1 });
    } else {
        // Jika belum ada, buat dokumen baru
        await setDoc(ipDocRef, { counter: 1 });
    }

      const newDonatur ={
        id : uuidv4(),
        nama,
        verifikasi,
        ip:ipAddress,
        date:timestamp,
        location,
        show
      }
         // Simpan donatur ke Firestore
    const donaturColRef = collection(db, 'donatur');
    await setDoc(doc(donaturColRef, newDonatur.id), newDonatur);

    res.status(200).json({ success: true, message: 'Pengajuan berhasil dikirim.' });
    }catch (error){
      res.status(500).json({success: false, message: `gagal mengirim pengajuan error:${error}`})
    }
});


router.get('/', async (req, res) => {
  try {
    // Ambil referensi ke koleksi 'donatur
    const donaturColRef = collection(db, "donatur");

    // Dapatkan semua dokumen dari koleksi 'donatur'
    const donaturSnapshot = await getDocs(donaturColRef);

    // Cek apakah koleksi kosong
    if (donaturSnapshot.empty) {
      return res.status(200).json({
        success: true,
        message: 'Tidak ada donatur yang ditemukan.',
        data: []
      });
    }

    // Ubah snapshot menjadi array objek
    const donaturList = donaturSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Kirimkan hasil sebagai respons
    res.json({ success: true, data: donaturList });
  } catch (error) {
    // Tangani kesalahan dan kirim respons error
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data, error: ${error.message}`
    });
  }
});

// Rute PUT untuk mengedit verifikasi
router.put('/verifikasi/:id', async (req, res) => {
    const { id } = req.params;
    const { verifikasi} = req.body;
  try {
    const donatur = doc(db,'donatur',id);
      await updateDoc(donatur,{verifikasi});
    res.status(200).json({success:true,message:'data berhasil di update'});
  }catch {
    res.status(500).json({success:false,message:`gagal mengupdate data id:${id}`});
  }

    
    // baca file JSON
  //  fs.readFile(hadiahFile,(err,data)=>{
    //    if (err) {
      //      return res.status(500).json({ error: 'Gagal membaca file pesan.' });
       // }

       // let hadiahData = JSON.parse(data || '{}');
       // let donatur = hadiahData.donatur || [];
       // let ipTracker = hadiahData.ipTracker || {};
       // const index = donatur.findIndex(p => p.id === id);

       // if (index !== -1) {
      //  donatur[index].verifikasi = verifikasi;
        // Simpan kembali data ke file JSON
       // hadiahData = { donatur, ipTracker };
        //fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
        //return res.json({ success: true, message: 'berhasil diperbarui.' });
   // } else {
     //   return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
   // }
   // })
});

// Rute PUT untuk mengedit donatur
router.put('/show/:id', async(req, res) => {
    const { id } = req.params;
    const { show} = req.body;
try {
    const donatur = doc(db,'donatur',id);
      await updateDoc(donatur,{show});
    res.status(200).json({success:true,message:'data berhasil di update'});
  }catch {
    res.status(500).json({success:false,message:`gagal mengupdate data id:${id}`});
  }

     // baca file JSON
   //  fs.readFile(hadiahFile,(err,data)=>{
   //     if (err) {
   //         return res.status(500).json({ error: 'Gagal membaca file pesan.' });
   //     }

   //     let hadiahData = JSON.parse(data || '{}');
   //     let donatur = hadiahData.donatur || [];
   //     let ipTracker = hadiahData.ipTracker || {};
   //     const index = donatur.findIndex(p => p.id === id);

   //     if (index !== -1) {
   //     donatur[index].show = show;
   //     // Simpan kembali data ke file JSON
   //     hadiahData = { donatur, ipTracker };
   //     fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
   //     return res.json({ success: true, message: 'berhasil diperbarui.' });
   // } else {
   //     return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
   // }
  //  })
});

// Rute DELETE untuk menghapus donatur
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
   try{
     const donatur = doc(db,'donatur',id);
     await deleteDoc(donatur);
    res.status(200).json({success:true,message:'data berhasil di update'});
  }catch {
    res.status(500).json({success:false,message:`gagal mengupdate data id:${id}`});
  }



     // baca file JSON
   //  fs.readFile(hadiahFile,(err,data)=>{
   //     if (err) {
   //         return res.status(500).json({ error: 'Gagal membaca file pesan.' });
   //     }

//        let hadiahData = JSON.parse(data || '{}');
//        let donatur = hadiahData.donatur || [];
//       let ipTracker = hadiahData.ipTracker || {};
//        const newDonatur = donatur.filter(p => p.id !== id);

//        if (newDonatur.length === donatur.length) {
  //              return res.status(404).json({ success: false, message: 'tidak ditemukan.' });
  //          }

        // Simpan kembali data ke file JSON
  //      hadiahData = { donatur:newDonatur, ipTracker };
  //      fs.writeFileSync(hadiahFile, JSON.stringify(hadiahData, null, 2));
  //      return res.json({ success: true, message: 'berhasil diperbarui.' });
  //  })
});

module.exports = router
