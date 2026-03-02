require('dotenv').config();
const https = require("https");
const axios = require("axios");

const agent = new https.Agent({ keepAlive: true });
const API = process.env.SPREADSHEET_API;

if (!API) {
  throw new Error("SPREADSHEET_API belum di set di .env");
}

// ================= CONFIG =================
const CACHE_TTL = 60 * 2000;
let cacheData = null;
let lastFetch = 0;
let isRefreshing = false;

// ================= NORMALIZER =================
function normalize(data) {
  return {
    jamaah: data.JamaahTourAdm.map(j => ({
      nama: j.Nama || "",
      noWa: j.noWa || "",
      gen: j.Gen || "",
      kamar: j.kamar || "",
      totalTabungan: Number(j.totalTabungan || 0),
      acara: Boolean(j.acara),
      ongkos: j.ongkos,
      kursi: j.kursi || ""
    })),

    IkutTour: data.JamaahIkutTour.map(j => ({
      nama: j.Nama || "",
      noWa: j.noWa || "",
      gen: j.Gen || "",
      kamar: j.kamar || "",
      totalTabungan: Number(j.totalTabungan || 0),
      acara: Boolean(j.acara),
      ongkos: j.ongkos,
      kursi: j.kursi || ""
    })),

    pengeluaran: data.Pengeluaran.map(p => ({
      tanggal: p.Tanggal,
      keterangan: p.Keterangan,
      kategori: p.Kategori,
      metode: p.MetodePembayaran,
      jumlah: Number(p.Q || 0),
      nota: p.nota
    })),

    anggaran: data.Anggaran.map(a => ({
      keterangan: a.Keterangan,
      estimasi: Number(a.Estimasi || 0),
      realisasi: Number(a.Realisasi || 0),
      defisit: Number(a.Defisit || 0),
      surplus: Number(a.Surplus || 0)
    })),

    meta: {
      ikutTour: data.JamaahIkutTour.length,
      berbayar: data.JamaahBerbayar.length,
      prioritas: data.JamaahPrioritas.length,
      kenaOngkos: data.JamaahIkutTour.length - data.JamaahPrioritas.length
    }
  };
}

// ================= FETCH =================
async function fetchFromAPI() {
  const res = await axios.get(API, { httpsAgent: agent });
  return normalize(res.data);
}

// ================= BACKGROUND REFRESH =================
async function refreshInBackground() {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    const fresh = await fetchFromAPI();
    cacheData = fresh;
    lastFetch = Date.now();
    console.log("Spreadsheet cache updated");
  } catch (err) {
    console.error("Refresh gagal:", err.message);
  } finally {
    isRefreshing = false;
  }
}

// ================= GET MASTER DATA =================
async function getData() {
  const now = Date.now();

  if (!cacheData) {
    cacheData = await fetchFromAPI();
    lastFetch = now;
    return cacheData;
  }

  if ((now - lastFetch) > CACHE_TTL) {
    refreshInBackground();
  }

  return cacheData;
}

// ================= HELPER KHUSUS =================

async function getJamaah() {
  const data = await getData();
  return data.jamaah;
}

async function getJamaahIkut() {
  const data = await getData();
  return data.IkutTour;
}

async function getPengeluaran() {
  const data = await getData();
  return data.pengeluaran;
}

async function getAnggaran() {
  const data = await getData();
  return data.anggaran;
}

// ================= STATISTIK OTOMATIS =================

async function getStats(Ongkos) {
  const data = await getData();

  const totalOngkos = data.IkutTour.filter(j => j.ongkos !== "L").reduce((s, j) => s + (j.ongkos || 0), 0);
  const totalPengeluaran = data.pengeluaran.reduce((s, p) => s + p.jumlah, 0);
  const totalEstimasi = data.anggaran.reduce((s, a) => s + a.estimasi, 0);
  const totalRealisasi = data.anggaran.reduce((s, a) => s + a.realisasi, 0);
  const totalPiutang = (data.IkutTour.length - data.meta.prioritas) * Ongkos - totalOngkos;
  const totalTagihan = (data.IkutTour.length - data.meta.prioritas) * Ongkos;
  const persentaseLunas = totalTagihan > 0
    ? Math.round((totalOngkos / totalTagihan) * 100)
    : 0;
  return {
    totalJamaah: data.IkutTour.length,
    totalOngkos,
    totalPengeluaran,
    totalEstimasi,
    totalRealisasi,
    totalPiutang,
    totalTagihan,
    sisaDana: totalOngkos - totalPengeluaran,
    surplusAnggaran: totalOngkos - totalEstimasi,
    persentaseLunas,
    meta: data.meta
  };
}

module.exports = {
  getData,
  getJamaah,
  getJamaahIkut,
  getPengeluaran,
  getAnggaran,
  getStats
};