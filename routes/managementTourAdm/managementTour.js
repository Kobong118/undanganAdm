const express = require('express');
const router = express.Router();
const { authRequired } = require("../../middleware/authMiddleware");
const { getStats } = require("../../services/spreadsheetService");

router.get('/', authRequired, async (req, res, next) => {
    const Ongkos = 370000; // Ongkos per jamaah, bisa disesuaikan sesuai kebutuhan
    const stats = await getStats(Ongkos);

    // format tanggal untuk ditampilkan di dashboard
    const options = {
        weekday: 'long',// nama hari lengkap
        year: 'numeric',// tahun angka
        month: 'long',// nama bulan lengkap
        day: 'numeric'   // tanggal angka
    };

    res.render('managementTourAdm/dashboard', {
        layout: 'layouts/tour-adm-2026-layout',
        title: 'Management Tour ADM',
        stats,
        Ongkos,
        waktu : new Date().toLocaleDateString('id-ID', options)
    });
});

module.exports = router;