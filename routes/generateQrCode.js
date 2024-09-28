const express = require('express');
const router = express.Router();
const app = express();
const QRCode = require('qrcode');

router.get('/',(req, res)=>{
    // Koordinat lokasi yang ingin di-encode ke dalam QR code (contoh koordinat)
    const latitude = '-7.0150614';
    const longitude = '107.5262599';
    // https://www.google.com/maps/place/Pesantren+Al+Ukhuwwah+Darrul+Mushtofa/@-7.0150614,107.5262599,20z/data=!4m6!3m5!1s0x2e68ed004cdddcc5:0x7aa9ccab763eb70!8m2!3d-7.0150316!4d107.5264496!16s%2Fg%2F11lf4yrjmm?entry=ttu&g_ep=EgoyMDI0MDkyNC4wIKXMDSoASAFQAw%3D%3D
    // URL Google Maps dengan koordinat lokasi
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    
    // Generate QR code dari URL lokasi
    QRCode.toDataURL(locationUrl, (err, url) => {
        if (err) {
            res.status(500).send('Error generating QR code');
        } else {
            res.json({ qrCodeUrl: url }); // Mengirim URL QR code sebagai response JSON
        }
    });
});

module.exports = router;