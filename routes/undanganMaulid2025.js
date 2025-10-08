const express = require('express');
const router = express.Router();
// pengalihan ke undangan maulid 2025
router.get('/',(req,res,next)=>{
    res.redirect('/undangan-maulid-adm-2025/muslimin')
})
/* GET home page. */
router.get('/:kepada', function(req, res, next) {
  res.render('undangan/undanganMaulid2025', { layout:'layouts/main-layout',targetDate: new Date('2025-10-19T05:59:59'), title:`Undangan kepada ${req.params.kepada.replace(/-/g, ' ')}`,nama:req.params.kepada.replace(/-/g, ' ') });
}); 
module.exports = router;