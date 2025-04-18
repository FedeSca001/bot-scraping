import express from 'express';
import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

const router = express.Router();

// Función para extraer resultados desde una URL de sesión
const resultadosSession = async (link) => {
    console.log('Link:', link);
    
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

router.get('/', async (req, res) => {
    const { url } = req.query;
  
    const data = await resultadosSession(url);
    if (data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron resultados' });
    }
    res.json(data);
  });
  

export default router;
