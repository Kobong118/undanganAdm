require('dotenv').config(); // paksa load ulang
const https = require("https");

const agent = new https.Agent({
  keepAlive: true,
});
const axios = require("axios");

const API = process.env.SPREADSHEET_API;

if (!API) {
  throw new Error("SPREADSHEET_API belum di set di .env");
}

async function getSheet() {
  const res = await axios.get(API, {
    httpsAgent: agent
  });
  return res.data;
}

// async function getSheet(sheet) {
//   const res = await axios.get(`${API}?sheet=${sheet}`, {
//     httpsAgent: agent,
//     timeout: 15000
//   });
//   return res.data;
// }

module.exports = { getSheet };