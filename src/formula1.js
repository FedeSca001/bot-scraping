import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const SELECTORS = {
    noticiaSelector: '#article-list > li',
    tituloSelector: 'a > figcaption > p',
    enlaceSelector: 'a',
    imgSelector: 'a > figure > img'
};

let noticiasFormula1 = [];

const updateFormula1News = async () => {
    // Limpiar el array antes de añadir nuevas noticias
    noticiasFormula1 = [];
    let indexGlobal = 1; // Índice global para todas las noticias

    // Crear un array de promesas para las 5 páginas (0 a 4)
    const promises = [];
    for (let i = 0; i <= 5; i++) {
        promises.push(
            axios.get(`https://www.formula1.com/en/latest/all?page=${i}`)
                .then(response => {
                    const $ = cheerio.load(response.data);

                    $(SELECTORS.noticiaSelector).each((index, element) => {
                        const titulo = $(element).find(SELECTORS.tituloSelector).text().trim();
                        const enlace = $(element).find(SELECTORS.enlaceSelector).attr('href');

                        // Aquí intentamos obtener la imagen desde diferentes atributos
                        let img = $(element).find(SELECTORS.imgSelector).attr('data-src')
                            || $(element).find(SELECTORS.imgSelector).attr('src')
                            || $(element).find(SELECTORS.imgSelector).attr('data-srcset');

                        // Si no hay imagen, devolver 'nada'
                        if (!img) {
                            img = 'nada';
                        }

                        // Almacenar la información en el array
                        noticiasFormula1.push({
                            index: indexGlobal++,
                            titulo,
                            enlace: enlace ? `https://www.formula1.com${enlace}` : '',
                            img
                        });
                    });
                })
                .catch(error => {
                    console.error(`Error al obtener las noticias de la página ${i}:`, error.message);
                    // No interrumpir el proceso si una página falla
                })
        );
    }

    // Esperar a que todas las promesas se resuelvan
    await Promise.all(promises);

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
