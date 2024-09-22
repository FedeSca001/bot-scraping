import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const SELECTORS = {
    noticiaSelector: 'article.s.s--v',  // Selector para cada noticia
    tituloSelector: 'h2.s__tl a',  // Selector para el título dentro del artículo
    enlaceSelector: 'h2.s__tl a',  // Enlace a la noticia
    imgSelector: 'figure.mm.s__mm img'  // Selector para la imagen dentro del artículo
};

let noticiasMotogp = [];

// Función para actualizar las noticias de MotoGP
const updateMotogpNews = async () => {
    try {
        const { data: noticiaMotogpData } = await axios.get("https://as.com/noticias/moto-gp/");
        const $ = cheerio.load(noticiaMotogpData);

        // Limpiar el array antes de añadir nuevas noticias
        noticiasMotogp = [];

        // Iterar sobre cada card de noticia
        $(SELECTORS.noticiaSelector).each((index, element) => {
            const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
            const enlace = $(element).find(SELECTORS.enlaceSelector).attr('href');  // Captura el href del <a>
            const img = $(element).find(SELECTORS.imgSelector).attr('src');  // Captura el src del <img>

            // Almacenar la información en un objeto
            noticiasMotogp.push({
                index: index + 1,
                titulo,
                enlace: enlace ? enlace : '',  // Ajustar la URL base si es necesario
                img: img ? img : 'nada'  // Si no hay imagen, retorna 'nada'
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
