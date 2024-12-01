const express = require('express');
const router = express.Router();
const {loadTextContent}=require('../src/loadData');

router.get('/',(req,res,next)=>{
    res.redirect('/undangan-maulid-adm/muslimin')
})
router.get('/:kepada',(req,res,next)=>{
    const textsContents = loadTextContent();
    res.render('adm',{layout:'layouts/main-layout',targetDate: new Date('2024-10-27T05:59:59'), title:`Undangan kepada ${req.params.kepada.replace(/-/g, ' ')}`,nama:req.params.kepada.replace(/-/g, ' '),textsContents})
});


module.exports = router;
