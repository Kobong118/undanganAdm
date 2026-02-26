const express = require('express');
const router = express.Router();
const { authRequired } = require("../../middleware/authMiddleware");
const { getSheet } = require("../../services/spreadsheetService");

function sumField(arr = [], field) {
    return arr.reduce((sum, item) => sum + (Number(item?.[field]) || 0), 0);
}

router.get('/', authRequired, async (req, res, next) => {
    try {
        const {
            JamaahTourAdm = [],
            JamaahIkutTour = [],
            JamaahBerbayar = [],
            JamaahPrioritas = [],
            Pengeluaran = [],
            Anggaran = []
        } = await getSheet();

        const totalAnggaran = sumField(Anggaran, 'Estimasi');
        const totalRealisasi = sumField(Anggaran, 'Realisasi');
        const ongkosTerkumpul = sumField(JamaahBerbayar, 'ongkos');

        res.render('managementTourAdm/dashboard', {
            layout: 'layouts/tour-adm-2026-layout',
            title: 'Management Tour ADM',
            ikhwan: JamaahIkutTour.filter(i => i.Gen === "L"),
            akhwat: JamaahIkutTour.filter(i => i.Gen === "P"),
            pengeluaran: Pengeluaran,
            JamaahBerbayar,
            totalAnggaran,
            ongkosTerkumpul,
            totalRealisasi,
            jamaah: JamaahIkutTour,
            Anggaran: Anggaran
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;