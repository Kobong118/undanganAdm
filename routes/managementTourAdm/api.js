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

    if (type === 'ongkos-prioritas') {
      const jamaah = await getJamaahIkut();
      const prioritas = jamaah.filter(j => j.ongkos === "L");
      return res.json(prioritas);
    }

    if (type === 'ongkos-lunas') {
      const jamaah = await getJamaahIkut();
      const lunas = jamaah.filter(j => j.ongkos === 370000);
      return res.json(lunas);
    }

    if (type === 'ongkos-belum-lunas') {
      const jamaah = await getJamaahIkut();
      const belumLunas = jamaah.filter(j => j.ongkos !== 370000 && j.ongkos !== "L" && j.ongkos !== 0 && j.ongkos !== "");
      return res.json(belumLunas);
    }

    if (type === 'ongkos-kosong') {
      const jamaah = await getJamaahIkut();
      const kosong = jamaah.filter(j => !j.ongkos || j.ongkos === "");
      return res.json(kosong);
    }

    if (type === 'ongkos-piutang') {
      const jamaah = await getJamaahIkut();
      const piutang = jamaah.filter(j => j.ongkos !== "L" && j.ongkos !== "" && 370000 - j.ongkos !== 0);
      return res.json(piutang);
    }

    res.status(404).json({ error: "Endpoint tidak valid" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;