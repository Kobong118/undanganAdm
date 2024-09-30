const express = require('express');
const fs = require('fs');
const createHttpError = require('http-errors');
const path = require('path');
const router = express.Router();

const hadiahFile = path.join(__dirname,'..','src','data','hadiah.json');
const pesanFile = path.join(__dirname,'..','src','data','pesan.json');

router.get('/:id',(req,res)=>{
    if(req.params.id == '767962'){
    const dataHadiah = JSON.parse(fs.readFileSync(hadiahFile,'utf-8'));
    const dataPesan = JSON.parse(fs.readFileSync(pesanFile,'utf-8'));
    res.render('admin',{layout:'layouts/main-layout',title:'Admin ADM',dataHadiah,dataPesan})       
    }
});

module.exports = router;