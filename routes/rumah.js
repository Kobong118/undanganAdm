const express = require ('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('rumah',{layout:'layouts/main-layout', title:'ADM media line'})
});

module.exports = router;