const express = require('express');
const router = express.Router();
const app = express();
const {loadTextContent}=require('../src/loadData');
const path = require('path');

app.use('/mp3', express.static(path.join(__dirname, 'public/mp3')));
router.get('/',(req,res,next)=>{
    res.redirect('/muslimin')
})
router.get('/:kepada',(req,res,next)=>{
    const textsContents = loadTextContent();
    res.render('adm',{layout:'layouts/main-layout',targetDate: new Date('2024-10-27T05:59:59'), title:`Undangan kepada ${req.params.kepada}`,nama:req.params.kepada,textsContents})
});


module.exports = router;
