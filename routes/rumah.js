const express = require ('express');
const router = express.Router();
const getDataBlogspot = require('../src/api-blogspot');

router.get('/', async (req, res) => {
    // get data blogger
    const data = await getDataBlogspot();
    console.log(data)
    res.render('rumah',{layout:'layouts/main-layout', title:'ADM media line', data})
});

module.exports = router;