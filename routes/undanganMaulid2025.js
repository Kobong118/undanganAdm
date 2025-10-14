const express = require('express');
const router = express.Router();
const {loadTextContent}=require('../src/loadData');
// pengalihan ke undangan maulid 2025
router.get('/',(req,res,next)=>{
    res.redirect('/undangan-maulid-adm-2025/muslimin')
})
/* GET home page. */
router.get('/:kepada', function(req, res, next) {
  const textsContents = loadTextContent();
  res.render('undangan/undanganMaulid2025', { layout:'layouts/maulid2025-layout', title:`Undangan kepada ${req.params.kepada.replace(/-/g, ' ')}`,nama:req.params.kepada.replace(/-/g, ' '),textsContents });
}); 
module.exports = router;