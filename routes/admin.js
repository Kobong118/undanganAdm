const express = require('express');
const fs = require('fs');
const createHttpError = require('http-errors');
const path = require('path');
const router = express.Router();
const db = require('../firebase');
const { collection, addDoc, getDocs, getDoc, updateDoc, doc, deleteDoc ,setDoc} = require('firebase/firestore');

//const hadiahFile = path.join(__dirname,'..','src','data','hadiah.json');
//const pesanFile = path.join(__dirname,'..','src','data','pesan.json');

router.get('/:id',async (req,res)=>{
    if(req.params.id == '767962'){
//    const dataHadiah = JSON.parse(fs.readFileSync(hadiahFile,'utf-8'));
//    const dataPesan = JSON.parse(fs.readFileSync(pesanFile,'utf-8'));
//    res.render('admin',{layout:'layouts/main-layout',title:'Admin ADM',dataHadiah,dataPesan})       
    try{
      const donaturColRf = collection(db,'donatur');
      const donaturSnapshot = await getDocs(donaturColRf);

      const donaturList = donaturSnapshot.docs.map(doc =>({
        id:doc.id,
          ...doc.data()
      }));

      const pesanColRf = collection(db,'pesan');
      const pesanSnapshot = await getDocs(pesanColRf);

      const pesanList = pesanSnapshot.docs.map(doc =>({
        id:doc.id,
          ...doc.data()
      }));
    res.render('admin',{layout:'layouts/main-layout',title:'Admin ADM',donaturList:JSON.stringify(donaturList),pesanList:JSON.stringify(pesanList)});
    }
      catch (error){
      res.status(500).json({error})
    }

    }else{
     res.status(404).send('Halaman tidak ditemukan');
    }
});

module.exports = router;
