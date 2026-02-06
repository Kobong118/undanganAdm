const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('tourAdm/tour-adm-2026',{layout:'layouts/tour-adm-2026-layout',title : 'Tour ADM 2026'})
});

module.exports = router ;