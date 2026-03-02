const express = require('express');
const router = express.Router();
const { getPengeluaran, getAnggaran, getJamaahIkut } = require('../../services/spreadsheetService');

router.get('/:type', async (req, res) => {
    console.log("Masuk route", req.params.type);
  try {
    const type = req.params.type;

    if (type === 'jamaah') {
      const jamaah = await getJamaahIkut();

      // jika ada query ?nama=
    //   if (req.query.nama) {
    //     const detail = jamaah.find(j =>
    //       j.nama.toLowerCase() === req.query.nama.toLowerCase()
    //     );

    //     if (!detail) {
    //       return res.status(404).json({ error: "Tidak ditemukan" });
    //     }

    //     return res.json(detail);
    //   }

      return res.json(jamaah);
    }

    if (type === 'pengeluaran') {
      const pengeluaran = await getPengeluaran();
      return res.json(pengeluaran);
    }

    if (type === 'anggaran') {
      const anggaran = await getAnggaran();
      return res.json(anggaran);
    }

    res.status(404).json({ error: "Endpoint tidak valid" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;