const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.redirect('/haul-apa-limbangan/alumni+muhibbin')
})
router.get('/:kepada',(req,res,next)=>{
    res.render('haulApaLimbangan/canvas',{layout:'layouts/haul-layout',targetDate: new Date('2025-05-25T08:59:59'), title:`Serat Uleman kahatur ${req.params.kepada.replace(/\+/g, ' ')}`,nama:req.params.kepada.replace(/\+/g, ' ')})
});


module.exports = router;