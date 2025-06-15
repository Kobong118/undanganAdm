const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('tourAdm/tourADM',{layout:'layouts/haul-layout',targetDate: new Date('2025-05-25T08:59:59'), title:`Serat Uleman kahatur`})
})


module.exports = router;