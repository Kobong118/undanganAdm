const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get('/', async(req,res)=>{
    try {
        const response = await axios.get('https://admmedialine.blogspot.com/feeds/posts/default/-/Qoul%20Ulama?alt=json&max-results=5');
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fatching data')
    }
});

module.exports= router;