import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

const router = express.Router();

const url = 'https://www.marca.com/motor/motogp/calendario.html?intcmp=MENUMIGA&s_kw=calendario#';

// Función para extraer resultados desde una URL de sesión
const resultadosSession = async (link) => {
  try {
    const { data: buffer } = await axios.get(link, { responseType: 'arraybuffer' });
    const decodedData = iconv.decode(buffer, 'latin1');
    const $ = cheerio.load(decodedData);

    const resultado = [];

    $('div.ue-table-ranking-marca table tbody tr').each((i, row) => {
      const nombre = $(row).find('th.is-main span.ue-table-ranking__race-driver-name').text().trim();
      const equipo = $(row).find('td.ue-table-ranking__race-driver-team').text().trim();
      const t = $(row).find('td.ue-table-ranking__race-driver-time').text().trim();
      let tiempo = t.split(' ')[1] ? t.split(' ')[1] : t;

      if (nombre) {
        let [minuto, segundos] = tiempo.split(':').map((t) => t.padStart(2, '0'));

        const tiempoEnSegundos = parseFloat(minuto) * 60 + parseFloat(segundos);

        const tiempoEnMinutosDecimales = tiempoEnSegundos / 60;

        if (resultado.length > 0) {
          const primerTiempo = resultado[0].tiempo;
          const primerTiempoEnSegundos = parseFloat(primerTiempo) * 60;
          const diferenciaSegundos = tiempoEnSegundos + primerTiempoEnSegundos;


          const diferenciaMinutosDecimales = diferenciaSegundos / 60;

          tiempo = diferenciaMinutosDecimales.toFixed(3);
        } else {

          tiempo = tiempoEnMinutosDecimales.toFixed(3);
        }
        // Normalizar el tiempo para evitar inconsistencias
        if (tiempo.includes('.')) {
          tiempo = parseFloat(tiempo).toFixed(3);
        } else {
          tiempo = parseFloat(tiempo).toFixed(0);
        }
        // Evitar duplicados
        const exists = resultado.some((entry) => entry.nombre === nombre && entry.equipo === equipo && entry.tiempo === tiempo);
        if (!exists) {
          resultado.push({ nombre, equipo, tiempo });
        }
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
    const { data: buffer } = await axios.get(url, { responseType: 'arraybuffer' });
    const decodedData = iconv.decode(buffer, 'latin1');
    const $ = cheerio.load(decodedData);

    const calendario = [];

    const elements = $('.gran-premio__element').toArray();

    for (const [index, element] of elements.entries()) {
      const el = $(element);
      const granPremio = el.find('.gran-premio__title-item a').text().trim();
      const fecha = el.find('.gran-premio__date').text().trim();
      const circuito = el.find('.gran-premio__circuit-name').text().trim();

      const podium = [];
      el.find('.category-motogp .gran-premio__podium-item').each((i, podiumItem) => {
        const position = $(podiumItem).find('.gran-premio__podium-data').text().trim();
        const piloto = $(podiumItem).text().replace(position, '').trim();
        const bandera = $(podiumItem).find('img').attr('src');
        podium.push({ position, piloto, bandera });
      });

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
