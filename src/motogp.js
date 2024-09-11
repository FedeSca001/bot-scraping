import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const SELECTORS = {
    noticiaSelector: '#main-content > div > div.content-grid.content-grid--light.video-items.js-lazy-load-images > div > div > ul > li',
    tituloSelector: 'a > div.content-item__info > h3',
    enlaceSelector: 'a',
    imgSelector: '#main-content > div > div.content-grid.content-grid--light.video-items.js-lazy-load-images > div > div > ul > li:nth-child(12) > a > div.content-item__thumbnail > div.js-lazy-load.u-observed.lazy-image-wrapper.is-loaded > picture > img'
};

let noticiasMotogp = [];

const updateMotogpNews = async () => {
    try {
        const { data: noticiaMotogpData } = await axios.get("https://www.motogp.com/es/news/latest-news");
        const $ = cheerio.load(noticiaMotogpData);

        // Limpiar el array antes de añadir nuevas noticias
        noticiasMotogp = [];

        // Iterar sobre cada card de noticia
        $(SELECTORS.noticiaSelector).each((index, element) => {
            const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
            const enlace = $(element).find(SELECTORS.enlaceSelector).attr('href');
            const img = $(element).find(SELECTORS.imgSelector).attr('src');
            
            // Almacenar la información en un objeto
            noticiasMotogp.push({
                index: index + 1,
                titulo,
                enlace: enlace ? `https://www.motogp.com${enlace}` : '',
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
