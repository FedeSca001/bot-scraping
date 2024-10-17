import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const SELECTORS = {
    pilotoNombre: 'td.piloto',  // Selector para el nombre del piloto
    puntos: 'td.puntosmundial > b',  // Selector para los puntos del piloto
    fila: 'table > tbody > tr' // Selector para cada fila de la tabla
};

const obtenerClasificacion = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const clasificacion = [];

        // Iterar sobre cada fila de la tabla
        $(SELECTORS.fila).each((index, element) => {
            const piloto = $(element).find(SELECTORS.pilotoNombre).text().trim();
            const puntos = $(element).find(SELECTORS.puntos).text().trim();

            // Almacenar la información en un objeto
            clasificacion.push({
                posicion: index + 1,
                piloto,
                puntos
            });
        });

        return clasificacion;

    } catch (error) {
        console.error('Error al obtener la clasificación:', error);
        return { error: 'Error al obtener la clasificación', detalle: error.message };
    }
};

const getClasificacionMotogp = () => {
    return obtenerClasificacion("https://www.marca.com/motor/motociclismo/clasificacion-motogp.html");
};

const getClasificacionMoto2 = () => {
    return obtenerClasificacion("https://www.marca.com/motor/motociclismo/clasificacion-moto2.html");
};

const getClasificacionMoto3 = () => {
    return obtenerClasificacion("https://www.marca.com/motor/motociclismo/clasificacion-moto3.html");
};
// Ruta para obtener la clasificación de MotoGP
router.get('/', async (req, res) => {
    const data = await getClasificacionMotogp();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

// Ruta para obtener la clasificación de Moto2
router.get('/moto2', async (req, res) => {
    const data = await getClasificacionMoto2();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

// Ruta para obtener la clasificación de Moto2
router.get('/moto3', async (req, res) => {
    const data = await getClasificacionMoto3();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
