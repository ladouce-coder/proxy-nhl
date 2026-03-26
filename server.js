import express from "express";
import fetch from "node-fetch";
import https from "https";

const app = express();
const PORT = process.env.PORT || 3000;

// Agent HTTPS spécial pour Render (corrige ENOTFOUND)
const agent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false
});

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy NHL
app.get("/nhl/*", async (req, res) => {
  try {
    const nhlUrl = "https://statsapi.web.nhl.com/" + req.params[0];

    const response = await fetch(nhlUrl, { agent });
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Erreur proxy NHL",
      details: err.message
    });
  }
});

// Photos NHL
app.get("/photo/:id", async (req, res) => {
  const id = req.params.id;
  const url = `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${id}.jpg`;

  try {
    const response = await fetch(url, { agent });
    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({
      error: "Erreur photo NHL",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy NHL actif sur le port ${PORT}`);
});
