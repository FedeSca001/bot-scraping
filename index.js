import express from "express";
import monedasRouter from './src/monedas.js';
import cryptoRouter from './src/crypto.js';
import motogpRouter from './src/motogp.js'
import mgpMotorSport from './src/motogpMotorSport.js'

const PORT = process.env.PORT || 5050;
const app = express();

// Ruta principal
app.get("/", (req, res) => {
  res.send('Scraping monedas/crypto');
});

// Rutas para monedas y criptomonedas
app.use("/monedas", monedasRouter);
app.use("/crypto", cryptoRouter);
app.use("/motogp", motogpRouter);
app.use("/motogpmotorSport", mgpMotorSport);

// Inicio del servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
