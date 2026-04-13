const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

// ⚠️ HARD CODE (TIDAK AMAN)
const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const filePath = req.file.path;

    // kirim lokasi
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `📍 Lokasi:\nLat: ${lat}\nLon: ${lon}`
    });

    // kirim video
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("video", fs.createReadStream(filePath));

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`,
      form,
      { headers: form.getHeaders() }
    );

    res.send("OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => console.log("Server jalan"));
