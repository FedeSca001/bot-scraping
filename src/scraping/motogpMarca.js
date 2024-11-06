import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const BASE_URL = "https://www.marca.com";
const SELECTORS = {
    noticiaSelector: 'article.ue-c-cover-content',  // Selector simplificado para cada noticia
    tituloSelector: '.ue-c-cover-content__main header a',  // Selector relativo para el título
    enlaceSelector: '.ue-c-cover-content__main header a',  // Selector relativo para el enlace
    imgSelector: '.ue-c-cover-content__media source',  // Selector simplificado para la imagen
    encabezadoSelector: '.ue-c-cover-content__kicker'  // Selector simplificado para el encabezado
};

let noticiasMarca = [];

// Función para actualizar las noticias de MotoGP en Marca
const updateMarcaNews = async () => {
    try {
        const { data: noticiaData } = await axios.get(`${BASE_URL}/motor/motogp.html`);
        const $ = cheerio.load(noticiaData);

        // Limpiar el array antes de añadir nuevas noticias
        noticiasMarca = [];

        // Iterar sobre cada card de noticia
        $(SELECTORS.noticiaSelector).each((index, element) => {
            const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
            const encabezado = $(element).find(SELECTORS.encabezadoSelector).text().trim();
            let enlace = $(element).find(SELECTORS.enlaceSelector).attr('href');
            const img = $(element).find(SELECTORS.imgSelector).attr('srcset') || $(element).find(SELECTORS.imgSelector).attr('src');

            // Verifica si el enlace es relativo y ajusta con la URL base
            if (enlace && !enlace.startsWith('http')) {
                enlace = `${BASE_URL}${enlace}`;
            }

            // Agrega al array de noticias
            noticiasMarca.push({
                index: index + 1,
                titulo: titulo || 'Sin título',  // Mensaje predeterminado si no hay título
                encabezado: encabezado || 'Sin encabezado',  // Mensaje predeterminado si no hay encabezado
                enlace: enlace || 'Sin enlace',
                img: img || 'Imagen no disponible'
            });
        });

    } catch (error) {
        console.error('Error al obtener las noticias de MotoGP en Marca:', error);
        return { error: 'Error al obtener las noticias de MotoGP en Marca', detalle: error.message };
    }

    return noticiasMarca;
};

// Ruta para obtener las noticias de MotoGP en Marca
router.get('/', async (req, res) => {
    const data = await updateMarcaNews();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
