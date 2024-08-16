import express from "express";
import monedasRouter from './monedas.js';
import cryptoRouter from './crypto.js';

const PORT = process.env.PORT || 5050;
const app = express();

// Ruta principal
app.get("/", (req, res) => {
  res.send('Scraping monedas/crypto');
});

// Rutas para monedas y criptomonedas
app.use("/monedas", monedasRouter);
app.use("/crypto", cryptoRouter);

// Inicio del servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
