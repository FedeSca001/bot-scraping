import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const PORT = process.env.PORT || 5050;

const app = express();

const selectorDolarCompra = "#market-scrll-2 > tbody > tr:nth-child(2) > td.buy > a > div > div.buy-value";
const selectorDolarVenta = "#market-scrll-2 > tbody > tr:nth-child(2) > td.sell > a > div > div.sell-value";
const selectorDolarBnaCompra = "#market-scrll-2 > tbody > tr:nth-child(1) > td.buy > a > div > div.buy-value";
const selectorDolarBnaVenta = "#market-scrll-2 > tbody > tr:nth-child(1) > td.sell > a > div > div.sell-value";    
const selectorDolarTurisata = "#market-scrll-2 > tbody > tr:nth-child(3) > td.sell > a > div > div.sell-value";
const selectorEuroDolar = ".text-5xl\\/9.font-bold.text-\\[\\#232526\\]"; // Selector simplificado para la cotización euro-dólar
const selectorEuroYuan = 'div[data-test="instrument-price-last"]';


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
  fecha: {
    dia: "",
    hora: ""
  }
};

const updateData = async () => {
  try {
    const { data } = await axios.get("https://www.cronista.com/MercadosOnline/dolar.html");
    const $ = cheerio.load(data);
    cotizacion.dolarArgentina.precioDolarBlueCompra = $(selectorDolarCompra).text();
    cotizacion.dolarArgentina.precioDolarBlueVenta = $(selectorDolarVenta).text();
    cotizacion.dolarArgentina.precioDolarBnaCompra = $(selectorDolarBnaCompra).text();
    cotizacion.dolarArgentina.precioDolarBnaVenta = $(selectorDolarBnaVenta).text();
    cotizacion.dolarArgentina.precioDolarTurista = $(selectorDolarTurisata).text();
    cotizacion.fecha.dia = new Date().toLocaleDateString();
    cotizacion.fecha.hora = new Date().getHours();
  } catch (error) {
    console.error("Error al obtener la cotización del dólar:", error);
  }

  try {
    const { data } = await axios.get("https://es.investing.com/currencies/eur-usd");
    const $ = cheerio.load(data);
    cotizacion.euroDolar = $(selectorEuroDolar).text(); // Utilizar el nuevo selector para la cotización euro-dólar
  } catch (error) {
    console.error("Error al obtener la cotización euro-dólar:", error);
  }
  try {
    const {data} = await axios.get('https://es.investing.com/currencies/eur-cny');
    const $ = cheerio.load(data);
    cotizacion.euroYuan = $(selectorEuroYuan).text();
  } catch (error) {
    console.log(error);
  }
};

updateData();

app.get("/", (req, res) => {
  res.send(cotizacion);
  updateData();
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
