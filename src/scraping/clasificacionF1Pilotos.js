import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

// Selectores parametrizados para Pilotos y Equipos
const SELECTORS = {
    piloto: {
        fila: 'tbody > tr',
        pilotoNombre: 'td:nth-child(2) > p > a > span.max-tablet\\:hidden', // Selector del nombre del piloto
        puntos: 'td:nth-child(5) > p' // Selector de los puntos
    },
    equipo: {
        fila: 'tbody > tr',
        equipoNombre: 'td:nth-child(2) > p', // Selector del nombre del equipo
        puntos: 'td:nth-child(3) > p' // Ajustado a un selector más genérico para los puntos de los equipos
    }
};

// Función para obtener la clasificación (ya sea de pilotos o equipos)
const obtenerClasificacion = async (url, tipo) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const clasificacion = [];

        const filaSelector = SELECTORS[tipo].fila;
        const nombreSelector = SELECTORS[tipo][`${tipo}Nombre`];
        const puntosSelector = SELECTORS[tipo].puntos;

        // Iterar sobre cada fila de la tabla
        $(filaSelector).each((index, element) => {
            const nombre = $(element).find(nombreSelector).text().trim();
            const puntos = $(element).find(puntosSelector).text().trim();

            // Almacenar la información en un objeto
            clasificacion.push({
                posicion: index + 1,
                nombre,
                puntos
            });
        });

        return clasificacion;

    } catch (error) {
        console.error(`Error al obtener la clasificación de ${tipo}:`, error);
        return { error: `Error al obtener la clasificación de ${tipo}`, detalle: error.message };
    }
};

// Funciones para obtener la clasificación de pilotos y equipos
const getClasificacionF1Pilotos = () => {
    const url = "https://www.formula1.com/en/results/2024/drivers";
    return obtenerClasificacion(url, 'piloto');
};

const getClasificacionF1Equipos = () => {
    const url = "https://www.formula1.com/en/results/2024/team";
    return obtenerClasificacion(url, 'equipo');
};

// Rutas para obtener la clasificación de pilotos y equipos
router.get('/pilotos', async (req, res) => {
    const data = await getClasificacionF1Pilotos();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

router.get('/equipos', async (req, res) => {
    const data = await getClasificacionF1Equipos();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
