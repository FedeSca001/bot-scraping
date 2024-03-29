import express from "express";
import * as cheerio from "cheerio";
import axios from "axios";

const PORT = process.env.PORT || 5000;

const app = express();

const selectorDolarCompra = "#market-scrll-2 > tbody > tr:nth-child(2) > td.buy > a > div > div.buy-value";
const selectorDolarVenta = "#market-scrll-2 > tbody > tr:nth-child(2) > td.sell > a > div > div.sell-value";
const selectorDolarBnaCompra = "#market-scrll-2 > tbody > tr:nth-child(1) > td.buy > a > div > div.buy-value";
const selectorDolarBnaVenta = "#market-scrll-2 > tbody > tr:nth-child(1) > td.sell > a > div > div.sell-value";    
const selectorDolarMepCompra = "#market-scrll-2 > tbody > tr:nth-child(6) > td.buy > a > div > div.buy-value";
const selectorDolarMepVenta = "#market-scrll-2 > tbody > tr:nth-child(6) > td.sell > a > div > div.sell-value";
const selectorDolarTurisata = "#market-scrll-2 > tbody > tr:nth-child(3) > td.sell > a > div > div.sell-value";
const selectorEuroDolar = "#main-wrap > section.mainLayout.insideLayout > div > div > div.main-content.row.d-flex.justify-content-start.flex-wrap > div:nth-child(1) > div:nth-child(3) > section > table > tbody > tr:nth-child(1) > td:nth-child(2)";
const selectorOroKt24 = "#content > div > table:nth-child(13) > tbody > tr:nth-child(1) > td:nth-child(2)";
const selectorOroKt18 = "#content > div > table:nth-child(10) > tbody > tr:nth-child(1) > td:nth-child(2)";

let cotizacion = {
  dolarArgentina: {
    precioDolarBlueCompra: "",
    precioDolarBlueVenta: "",
    precioDolarBnaCompra: "",
    precioDolarBnaVenta: "",
    precioDolarMepCompra: "",
    precioDolarMepVenta: "",
    precioDolarTurista: "",
  },
  euroDolar: "",
  oro: {
    Kt24: "",
    Kt18: ""
  },
  fecha: {
    dia: "",
    hora: ""
  }
};


const updateData = async (req,res) => {
  try {
    const { data } = await axios.get("https://www.cronista.com/MercadosOnline/dolar.html");
    const $ = cheerio.load(data);
    cotizacion.dolarArgentina.precioDolarBlueCompra = $(selectorDolarCompra).text();
    cotizacion.dolarArgentina.precioDolarBlueVenta = $(selectorDolarVenta).text();
    cotizacion.dolarArgentina.precioDolarBnaCompra = $(selectorDolarBnaCompra).text();
    cotizacion.dolarArgentina.precioDolarBnaVenta = $(selectorDolarBnaVenta).text();
    cotizacion.dolarArgentina.precioDolarMepCompra = $(selectorDolarMepCompra).text();
    cotizacion.dolarArgentina.precioDolarMepVenta = $(selectorDolarMepVenta).text();
    cotizacion.dolarArgentina.precioDolarTurista = $(selectorDolarTurisata).text();
    cotizacion.fecha.dia = new Date().toLocaleDateString();
    cotizacion.fecha.hora = new Date().getHours();
  } catch (error) {
    res.send(error)
  }

  try {
    const { data } = await axios.get("https://www.eleconomista.es/cruce/EURUSD");
    const $ = cheerio.load(data);
    cotizacion.euroDolar = $(selectorEuroDolar).text();
  } catch (error) {
    console.log(error);
  }

  try {
    const { data } = await axios.get("https://www.goldpricedata.com/es/gold-rates/europe/gram/24k/");
    const $ = cheerio.load(data);
    cotizacion.oro.Kt24 = $(selectorOroKt24).text();
  } catch (error) {
    console.log(error);
  }

  try {
    const { data } = await axios.get("https://www.goldpricedata.com/es/gold-rates/europe/gram/18k/");
    const $ = cheerio.load(data);
    cotizacion.oro.Kt18 = $(selectorOroKt18).text();
  } catch (error) {
    console.log(error);
  }
};

updateData();

//setInterval(updateData, updateInterval);

app.get("/", (req, res) => {
  res.send(cotizacion);
  updateData()
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
