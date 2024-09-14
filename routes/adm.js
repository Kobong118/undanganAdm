const express = require('express');
const router = express.Router();
const app = express();
const {loadTextContent}=require('../src/loadData')

router.get('/',(req,res,next)=>{
    res.redirect('/muslimin')
})
router.get('/:kepada',(req,res,next)=>{
    const icon = path.join(__dirname, 'public', 'favicon.ico');
    const textsContents = loadTextContent();
    res.render('adm',{icon,layout:'layouts/main-layout',targetDate: new Date('2024-10-27T05:59:59'), title:`Undangan kepada ${req.params.kepada}`,nama:req.params.kepada,textsContents})
});


module.exports = router;
