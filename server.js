import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser ton site web à accéder au proxy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Proxy NHL (toutes les routes /nhl/... passent ici)
app.get("/nhl/*", async (req, res) => {
  try {
    const nhlUrl = "https://statsapi.web.nhl.com/" + req.params[0];
    console.log("→ NHL:", nhlUrl);

    const response = await fetch(nhlUrl);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Erreur proxy NHL",
      details: err.message
    });
  }
});

// Proxy pour les photos NHL
app.get("/photo/:id", async (req, res) => {
  const id = req.params.id;
  const url = `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${id}.jpg`;

  try {
    const response = await fetch(url);
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
