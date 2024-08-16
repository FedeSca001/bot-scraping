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
const selectorDolarYuan = 'div[data-test="instrument-price-last"]';

let cotizacion = {
  dolarArgentina: {
    precioDolarBlueCompra: "",
    precioDolarBlueVenta: "",
    precioDolarBnaCompra: "",
    precioDolarBnaVenta: "",
    precioDolarTurista: "",
  },
  euroDolar: "",
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
    const { data: data2 } = await axios.get("https://es.investing.com/currencies/eur-usd");
    const $2 = cheerio.load(data2);
    cotizacion.euroDolar = $2(selectorEuroDolar).text();

    const { data: data1 } = await axios.get("https://es.investing.com/currencies/usd-cny");
    const $1 = cheerio.load(data1);
    cotizacion.dolarYuan = $1(selectorDolarYuan).text();

    const { data: data3 } = await axios.get('https://es.investing.com/currencies/eur-cny');
    const $3 = cheerio.load(data3);
    cotizacion.euroYuan = $3(selectorEuroYuan).text();
  } catch (error) {
    console.error("Error al obtener la cotización euro-dólar:", error);
  }
};


updateData();

app.get("/", (req, res) => {
  console.log(req);
  res.send(cotizacion);
  updateData();
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
