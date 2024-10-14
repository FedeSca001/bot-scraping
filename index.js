import express from "express";
import cors from 'cors';  // Importar cors
import monedasRouter from './src/monedas.js';
import cryptoRouter from './src/crypto.js';
import motogpRouter from './src/motogp.js';
import mgpMotorSport from './src/motogpMotorSport.js';
import clasificacionMotogp from './src/clasificacionMotogp.js';
import formula1Oficial from './src/formula1.js';
import clasificacionF1Pilotos from './src/clasificacionF1Pilotos.js'
import motoGpDiarioAS from './src/motoGpDiarioAS.js';
import formula1DiarioAS from './src/formula1DiarioAS.js';

const PORT = process.env.PORT || 5050;
const app = express();

// Configurar CORS
app.use(cors({
  origin: 'https://show-me-the-data.netlify.app/',
  methods: ['GET'],
}));

// Ruta principal
app.get("/", (req, res) => {
  res.send('Scraping monedas/crypto');
});

// Rutas
app.use("/monedas", monedasRouter);
app.use("/crypto", cryptoRouter);
app.use("/motogp", motogpRouter);
app.use("/motoGpDiarioAS", motoGpDiarioAS);
app.use("/motogpmotorSport", mgpMotorSport);
app.use("/clasificacionMotogp", clasificacionMotogp);
app.use("/formula1Oficial", formula1Oficial);
app.use("/formula1DiarioAS", formula1DiarioAS);
app.use("/clasificacionF1", clasificacionF1Pilotos);

// Inicio del servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
