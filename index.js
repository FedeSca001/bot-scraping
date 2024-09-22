import express from "express";
import cors from 'cors';  // Importar cors
import monedasRouter from './src/monedas.js';
import cryptoRouter from './src/crypto.js';
import motogpRouter from './src/motogp.js';
import mgpMotorSport from './src/motogpMotorSport.js';
import clasificacionMotogp from './src/clasificacionMotogp.js';
import formula1Oficial from './src/formula1.js'

const PORT = process.env.PORT || 5050;
const app = express();

// Configurar CORS
app.use(cors());

// Ruta principal
app.get("/", (req, res) => {
  res.send('Scraping monedas/crypto');
});

// Rutas para monedas y criptomonedas
app.use("/monedas", monedasRouter);
app.use("/crypto", cryptoRouter);
app.use("/motogp", motogpRouter);
app.use("/motogpmotorSport", mgpMotorSport);
app.use("/clasificacionMotogp", clasificacionMotogp);
app.use("/formula1Oficial", formula1Oficial);

// Inicio del servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
