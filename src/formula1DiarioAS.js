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

let noticiasFormula1 = [];

// Función para actualizar las noticias de Fórmula 1
const updateFormula1News = async () => {
    try {
        const { data: noticiaFormula1Data } = await axios.get("https://as.com/motor/formula_1/");
        const $ = cheerio.load(noticiaFormula1Data);

        // Limpiar el array antes de añadir nuevas noticias
        noticiasFormula1 = [];

        // Iterar sobre cada card de noticia
        $(SELECTORS.noticiaSelector).each((index, element) => {
            const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
            const enlace = $(element).find(SELECTORS.enlaceSelector).attr('href');  // Captura el href del <a>
            const img = $(element).find(SELECTORS.imgSelector).attr('src');  // Captura el src del <img>

            // Almacenar la información en un objeto
            noticiasFormula1.push({
                index: index + 1,
                titulo,
                enlace: enlace ? enlace : '',  // Usar el enlace si está disponible
                img: img ? img : 'nada'  // Si no hay imagen, retorna 'nada'
            });
        });

    } catch (error) {
        console.error('Error al obtener las noticias de Fórmula 1:', error);
        return { error: 'Error al obtener las noticias de Fórmula 1', detalle: error.message };
    }

    return noticiasFormula1;
};

// Ruta para obtener las noticias de Fórmula 1
router.get('/', async (req, res) => {
    const data = await updateFormula1News();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
