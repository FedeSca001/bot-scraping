import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const SELECTORS = {
    noticiaSelector: 'div.ms-grid.ms-grid-hor-d.ms-grid-hor-t.ms-grid-hor-m > a',  // Selector más general para cada noticia
    tituloSelector: 'div.ms-item__info > div.ms-item__title',  // Selector corregido para el título
    enlaceSelector: 'a',  // Enlace a la noticia
    imgSelector: 'div.ms-item__thumb > picture > img'  // Selector para la imagen
};

let noticiasMotogp = [];

const updateMotogpNews = async () => {
    try {
        const { data: noticiaMotogpData } = await axios.get("https://es.motorsport.com/motogp/news/");
        const $ = cheerio.load(noticiaMotogpData);

        // Limpiar el array antes de añadir nuevas noticias
        noticiasMotogp = [];

        // Iterar sobre cada card de noticia
        $(SELECTORS.noticiaSelector).each((index, element) => {
            const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
            const enlace = $(element).attr('href');  // Captura el href directamente del elemento <a>
            const img = $(element).find(SELECTORS.imgSelector).attr('src');

            // Almacenar la información en un objeto
            noticiasMotogp.push({
                index: index + 1,
                titulo,
                enlace: enlace ? `https://es.motorsport.com${enlace}` : '',  // Usar la URL base correcta
                img: img ? img : 'nada'
            });
        });

    } catch (error) {
        console.error('Error al obtener las noticias MotoGP:', error);
        return { error: 'Error al obtener las noticias MotoGP', detalle: error.message };
    }

    return noticiasMotogp;
};

// Ruta para obtener las noticias de MotoGP
router.get('/', async (req, res) => {
    const data = await updateMotogpNews();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
