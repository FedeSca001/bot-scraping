import express from 'express';
import axios from 'axios';

const router = express.Router();

// DOCUMENTACION https://www.weatherapi.com/docs/#weather-icons

const WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json";
const API_KEY = "966b7ca84f6c4058a4d171342240711";  // Reemplaza "TU_CLAVE_API" con tu clave real de la API

let climatología = {};

// Función para obtener datos meteorológicos
const getWeatherData = async (location) => {
    try {
        const { data } = await axios.get(`${WEATHER_API_URL}?key=${API_KEY}&q=${location}&lang=es&aqi=yes`);
        climatología = {
            ubicacion: data.location.name,
            temperatura: data.current.temp_c,
            condicion: data.current.condition.text,
            viento: data.current.wind_kph
        };
    } catch (error) {
        console.error('Error al obtener los datos del clima:', error);
        return { error: 'Error al obtener los datos del clima', detalle: error.message };
    }

    return climatología;
};

// Ruta para obtener los datos del clima
router.get('/:location', async (req, res) => {
    const {location} = req.params;
    const climaData = await getWeatherData(location);

    if (climaData.error) {
        res.status(500).json(climaData);
    } else {
        res.json(climaData);
    }
});

export default router;
