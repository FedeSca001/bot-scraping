import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();
const url = 'https://www.marca.com/motor/motogp/calendario.html?intcmp=MENUMIGA&s_kw=calendario#';

const updateCalendario = async () => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const calendario = [];

        // Seleccionamos todas las tarjetas de gran premio
        $('.gran-premio__element').each((index, element) => {
            const granPremio = $(element).find('.gran-premio__title-item a').text().trim();
            const fecha = $(element).find('.gran-premio__date').text().trim();
            const circuito = $(element).find('.gran-premio__circuit-name').text().trim();
            const imgCircuito = $(element).find('.gran-premio__img-circuit').attr('src');

            // Extraer información del podio MotoGP
            const podium = [];
            $(element)
                .find('.category-motogp .gran-premio__podium-item')
                .each((i, podiumItem) => {
                    const position = $(podiumItem).find('.gran-premio__podium-data').text().trim();
                    const piloto = $(podiumItem).text().replace(position, '').trim();
                    const bandera = $(podiumItem).find('img').attr('src');
                    podium.push({ position, piloto, bandera });
                });

            // Extraer información de las competiciones
            const competiciones = { motoGp: [], moto2: [], moto3: [] };
            let currentDay = null;

            $(element)
                .find('.gran-premio__schedule')
                .children()
                .each((i, child) => {
                    if ($(child).is('dt')) {
                        // Si es un <dt>, actualizamos el día actual
                        currentDay = $(child).text().trim();
                    } else if ($(child).is('dd')) {
                        // Si es un <dd>, es una competición asociada al día actual
                        const link = $(child).find('a').attr('href');
                        const descripcion = $(child).find('a').text().trim();
                        const hora = $(child).find('.hora').text().trim();

                        // Verificamos el índice y lo clasificamos en motoGp, moto2 o moto3
                        if (competiciones.motoGp.length < 6) {
                            competiciones.motoGp.push({ dia: currentDay, descripcion, link, hora });
                        } else if (competiciones.moto2.length < 5) {
                            competiciones.moto2.push({ dia: currentDay, descripcion, link, hora });
                        } else {
                            competiciones.moto3.push({ dia: currentDay, descripcion, link, hora });
                        }
                    }
                });

            // Agregamos la información a la lista del calendario
            calendario.push({
                index,
                granPremio,
                fecha,
                circuito,
                imgCircuito,
                podium,
                competiciones,
            });
        });

        return calendario;
    } catch (error) {
        console.error('Error al obtener el calendario MotoGp:', error);
        return { error: 'Error al obtener el calendario MotoGp', detalle: error.message };
    }
};

// Ruta para obtener las noticias de MotoGP
router.get('/', async (req, res) => {
    const data = await updateCalendario();
    if (data.error) {
        res.status(500).json(data);
    } else {
        res.json(data);
    }
});

export default router;
