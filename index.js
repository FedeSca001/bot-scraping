import express from "express";
import cors from 'cors';
import monedasRouter from './src/scraping/monedas.js';
import cryptoRouter from './src/scraping/crypto.js';
import motogpRouter from './src/scraping/motogp.js';
import motoGpMarca from './src/scraping/motogpMarca.js'
import mgpMotorSport from './src/scraping/motogpMotorSport.js';
import clasificacionMotogp from './src/scraping/clasificacionMotogp.js';
import formula1Oficial from './src/scraping/formula1.js';
import clasificacionF1Pilotos from './src/scraping/clasificacionF1Pilotos.js';
import motoGpDiarioAS from './src/scraping/motoGpDiarioAS.js';
import formula1DiarioAS from './src/scraping/formula1DiarioAS.js';
import userRouter from './src/router/userRouter.js'; // Importación correcta
import climaWeatherapi from './src/scraping/climaWeatherapi.js';
import calendarioMotoGp from './src/scraping/CalendarioMotoGp.js';

const PORT = process.env.PORT || 5050;
const app = express();
app.use(express.json()); // Esto es importante
app.use(express.urlencoded({ extended: true }));


// Configurar CORS
/*app.use(cors({
  origin: 'https://show-me-the-data.netlify.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Custom-Header'],
  credentials: true,
}));*/


app.use(cors())
// Ruta principal
app.get("/", (req, res) => {
  res.send('Scraping monedas/crypto');
});

// Rutas
app.use("/monedas", monedasRouter);
app.use("/crypto", cryptoRouter);
app.use("/motogp", motogpRouter);
app.use("/motoGpMarca", motoGpMarca);
app.use("/motoGpDiarioAS", motoGpDiarioAS);
app.use("/motogpmotorSport", mgpMotorSport);
app.use("/clasificacionMotogp", clasificacionMotogp);
app.use("/formula1Oficial", formula1Oficial);
app.use("/formula1DiarioAS", formula1DiarioAS);
app.use("/clasificacionF1", clasificacionF1Pilotos);
app.use('/climaWeatherapi', climaWeatherapi);
app.use("/user", userRouter); // Asociar el enrutador de usuario
app.use('/calendarioMotoGp', calendarioMotoGp);

app.use((req, res, next) => {
  res.status(404).send({ error: "Ruta no encontrada" });
});

// Inicio del servidor
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
