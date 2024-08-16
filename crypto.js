import express from 'express';
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

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

  let crypto = {
    btn:"",
    eth:""
  }

// Función para actualizar los datos de criptomonedas
const updateCrypto = async () => {
  try {

      
  } catch (error) {
    console.error("Error al obtener la cotización de criptomonedas:", error);
    return { error: 'Error al obtener la cotización de criptomonedas' };
  }
  return crypto
};

// Ruta para obtener la cotización de criptomonedas
router.get('/', async (req, res) => {
  const data = await updateCrypto();
  res.json(data);
});

export default router;
