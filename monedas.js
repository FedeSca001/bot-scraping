import express from 'express';
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

// Selectores para las diferentes cotizaciones
const SELECTORS = {
  dolarBlueCompra: "#market-scrll-2 > tbody > tr:nth-child(2) > td.buy > a > div > div.buy-value",
  dolarBlueVenta: "#market-scrll-2 > tbody > tr:nth-child(2) > td.sell > a > div > div.sell-value",
  dolarBnaCompra: "#market-scrll-2 > tbody > tr:nth-child(1) > td.buy > a > div > div.buy-value",
  dolarBnaVenta: "#market-scrll-2 > tbody > tr:nth-child(1) > td.sell > a > div > div.sell-value",
  dolarTurista: "#market-scrll-2 > tbody > tr:nth-child(3) > td.sell > a > div > div.sell-value",
  euroDolar: ".text-5xl\\/9.font-bold.text-\\[\\#232526\\]", // Selector simplificado para la cotización euro-dólar
  euroYuan: 'div[data-test="instrument-price-last"]',
  dolarYuan: 'div[data-test="instrument-price-last"]',
};

// Estructura para almacenar la cotización
let cotizacion = {
  dolarArgentina: {
    precioDolarBlueCompra: "",
    precioDolarBlueVenta: "",
    precioDolarBnaCompra: "",
    precioDolarBnaVenta: "",
    precioDolarTurista: "",
  },
  euroDolar: "",
  euroYuan: "",
  dolarYuan: "",
  fecha: {
    dia: "",
    hora: ""
  }
};

// Función para actualizar los datos
const updateData = async () => {
  try {
    // Obtener y procesar datos del dólar argentino
    const { data } = await axios.get("https://www.cronista.com/MercadosOnline/dolar.html");
    const $ = cheerio.load(data);
    cotizacion.dolarArgentina.precioDolarBlueCompra = $(SELECTORS.dolarBlueCompra).text();
    cotizacion.dolarArgentina.precioDolarBlueVenta = $(SELECTORS.dolarBlueVenta).text();
    cotizacion.dolarArgentina.precioDolarBnaCompra = $(SELECTORS.dolarBnaCompra).text();
    cotizacion.dolarArgentina.precioDolarBnaVenta = $(SELECTORS.dolarBnaVenta).text();
    cotizacion.dolarArgentina.precioDolarTurista = $(SELECTORS.dolarTurista).text();
    cotizacion.fecha.dia = new Date().toLocaleDateString();
    cotizacion.fecha.hora = new Date().getHours();
  } catch (error) {
    console.error("Error al obtener la cotización del dólar:", error);
  }

  try {
    // Obtener y procesar datos del euro-dólar
    const { data: dataEuroDolar } = await axios.get("https://es.investing.com/currencies/eur-usd");
    const $2 = cheerio.load(dataEuroDolar);
    cotizacion.euroDolar = $2(SELECTORS.euroDolar).text();

    // Obtener y procesar datos del dólar-yuan
    const { data: dataDolarYuan } = await axios.get("https://es.investing.com/currencies/usd-cny");
    const $1 = cheerio.load(dataDolarYuan);
    cotizacion.dolarYuan = $1(SELECTORS.dolarYuan).text();

    // Obtener y procesar datos del euro-yuan
    const { data: dataEuroYuan } = await axios.get('https://es.investing.com/currencies/eur-cny');
    const $3 = cheerio.load(dataEuroYuan);
    cotizacion.euroYuan = $3(SELECTORS.euroYuan).text();
  } catch (error) {
    console.error("Error al obtener la cotización euro-dólar:", error);
  }
  return cotizacion;
};

// Ruta para obtener la cotización
router.get('/', async (req, res) => {
  const data = await updateData();
  res.json(data);
});

export default router;
