import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';

const router = express.Router();

const url = 'https://www.marca.com/motor/motogp/calendario.html?intcmp=MENUMIGA&s_kw=calendario#';

// Función para extraer resultados desde una URL de sesión
const resultadosSession = async (link) => {
  try {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    const resultado = [];

    $('div.ue-table-ranking-marca table tbody tr').each((i, row) => {
      const nombre = $(row).find('th.is-main span.ue-table-ranking__race-driver-name').text().trim();
      const equipo = $(row).find('td.ue-table-ranking__race-driver-team').text().trim();
      const tiempo = $(row).find('td.ue-table-ranking__race-driver-time').text().trim();

      if (nombre) {
        resultado.push({ nombre, equipo, tiempo });
      }
    });

    return resultado;
  } catch (err) {
    console.error('Error en resultadosSession:', err.message);
    return [];
  }
};

const dataObject = async () => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const calendario = [];

    // Seleccionamos todas las tarjetas de gran premio
    const elements = $('.gran-premio__element').toArray();

    for (const [index, element] of elements.entries()) {
      const el = $(element);
      const granPremio = el.find('.gran-premio__title-item a').text().trim();
      const fecha = el.find('.gran-premio__date').text().trim();
      const circuito = el.find('.gran-premio__circuit-name').text().trim();

      // Extraer podio
      const podium = [];
      el.find('.category-motogp .gran-premio__podium-item').each((i, podiumItem) => {
        const position = $(podiumItem).find('.gran-premio__podium-data').text().trim();
        const piloto = $(podiumItem).text().replace(position, '').trim();
        const bandera = $(podiumItem).find('img').attr('src');
        podium.push({ position, piloto, bandera });
      });

      // Extraer competiciones
      const competiciones = { motoGp: [], moto2: [], moto3: [] };
      let currentDay = null;

      const children = el.find('.gran-premio__schedule').children().toArray();

      for (const child of children) {
        const ch = $(child);
        if (ch.is('dt')) {
          currentDay = ch.text().trim();
        } else if (ch.is('dd')) {
          const link = ch.find('a').attr('href');
          const descripcion = ch.find('a').text().trim();
          const hora = ch.find('.hora').text().trim();

          const resultado = link ? await resultadosSession(link) : [];

          const sessionData = { dia: currentDay, descripcion, link, resultado, hora };

          if (competiciones.motoGp.length < 6) {
            competiciones.motoGp.push(sessionData);
          } else if (competiciones.moto2.length < 5) {
            competiciones.moto2.push(sessionData);
          } else {
            competiciones.moto3.push(sessionData);
          }
        }
      }

      calendario.push({
        index,
        granPremio,
        fecha,
        circuito,
        podium,
        competiciones,
      });
    }

    return calendario;
  } catch (error) {
    console.error('Error al obtener el calendario MotoGp:', error);
    return { error: 'Error al obtener el calendario MotoGp', detalle: error.message };
  }
};

router.get('/', async (req, res) => {
  const data = await dataObject();
  res.json(data);
});

export default router;
