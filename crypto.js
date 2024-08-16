import express from 'express';
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

// Función para actualizar los datos de criptomonedas
const updateCrypto = async () => {
  try {
    // Aquí puedes implementar las llamadas HTTP para obtener los datos de criptomonedas
    // Por ejemplo:
    // const { data } = await axios.get('URL_DE_LA_API_O_PAGINA');
    // const $ = cheerio.load(data);
    // const precioBitcoin = $(SELECTOR_DE_BITCOIN).text();
    
    // Por ahora, solo devolvemos un mensaje de "En proceso"
    return { message: 'En proceso de implementación' };
  } catch (error) {
    console.error("Error al obtener la cotización de criptomonedas:", error);
    return { error: 'Error al obtener la cotización de criptomonedas' };
  }
};

// Ruta para obtener la cotización de criptomonedas
router.get('/', async (req, res) => {
  const data = await updateCrypto();
  res.json(data);
});

export default router;
