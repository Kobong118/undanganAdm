const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('tarkiban/index',{layout:'layouts/narkib-layout',title : 'Bebegig Narkib'})
});


module.exports = router ;