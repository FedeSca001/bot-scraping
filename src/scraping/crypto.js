import express from 'express';
import * as cheerio from "cheerio";
import axios from "axios";

const router = express.Router();

const SELECTORS = {
    btnDolarSelect: `<h2 class="lrtcss-1hluwqn">$60.392,6<div class="lrtcss-18vlxt8"><span class=" lrtcss-6a5gvc color-high">+1,29&nbsp;%</span><span class="lrtcss-udp0k9"></span></div></h2>`,
    ethDolarSelect: `<h2 class="lrtcss-1hluwqn">$2595,17<div class="lrtcss-m92npm"><span class=" lrtcss-6a5gvc color-low">-0,41&nbsp;%</span><span class="lrtcss-udp0k9"></span></div></h2>`,
    bchDolarSelect:`<h2 class="lrtcss-1hluwqn">$350,99<div class="lrtcss-18vlxt8"><span class=" lrtcss-6a5gvc color-high">+0,89&nbsp;%</span><span class="lrtcss-udp0k9"></span></div></h2>`,
    trxDolarSelect: `<h2 class="lrtcss-1hluwqn">$0,1582<div class="lrtcss-18vlxt8"><span class=" lrtcss-6a5gvc color-high">+1,41&nbsp;%</span><span class="lrtcss-udp0k9"></span></div></h2>`,
    fetDolarSelect: `<h2 class="lrtcss-1hluwqn">$1,0700<div class="lrtcss-18vlxt8"><span class=" lrtcss-6a5gvc color-high">+415,28&nbsp;%</span><span class="lrtcss-udp0k9"></span></div></h2>`
  };

  let crypto = {
    btnDolar:"",
    ethDolar:"",
    bchDolar:"",
    trxDolar: "",
    fetDolar: "",
    fecha: {
      dia: "",
      hora: ""
    }
  }

  const updateCrypto = async () => {
    try {
      const { data: btcData } = await axios.get("https://www.kucoin.com/es/price/BTC");
      const $btc = cheerio.load(btcData);
      
      let btcText = $btc(SELECTORS.btnDolarSelect).text();
      if (btcText.includes('+')) {
        crypto.btnDolar = btcText.split('+')[0].trim();
      } else if (btcText.includes('-')) {
        crypto.btnDolar = btcText.split('-')[0].trim();
      } else {
        crypto.btnDolar = btcText.trim();
      }
      

      crypto.fecha.dia = new Date().toLocaleDateString();
      crypto.fecha.hora = new Date().getHours();
  
    } catch (error) {
      return { error: 'Error al obtener la cotización de Bitcoin', detalle: error.message };
    }
    
    try {
      const { data: ethData } = await axios.get("https://www.kucoin.com/es/price/ETH");
      const $eth = cheerio.load(ethData);
      
      let ethText = $eth(SELECTORS.ethDolarSelect).text();
      if (ethText.includes('+')) {
        crypto.ethDolar = ethText.split('+')[0].trim();
      } else if (ethText.includes('-')) {
        crypto.ethDolar = ethText.split('-')[0].trim();
      } else {
        crypto.ethDolar = ethText.trim();
      }
  
    } catch (error) {
      return { error: 'Error al obtener la cotización de Ethereum', detalle: error.message };
    }
  
    try {
      const { data: bchData } = await axios.get("https://www.kucoin.com/es/price/BCH");
      const $bch = cheerio.load(bchData);
      
      let bchText = $bch(SELECTORS.bchDolarSelect).text();
      if (bchText.includes('+')) {
        crypto.bchDolar = bchText.split('+')[0].trim();
      } else if (bchText.includes('-')) {
        crypto.bchDolar = bchText.split('-')[0].trim();
      } else {
        crypto.bchDolar = bchText.trim();
      }
    } catch (error) {
      return { error: 'Error al obtener la cotización de Bitcoin Cash', detalle: error.message };
    }

    try {
      const { data: trxData } = await axios.get("https://www.kucoin.com/es/price/TRX");
      const $trx = cheerio.load(trxData);

      let trxText = $trx(SELECTORS.trxDolarSelect).text();
      if (trxText.includes('+')) {
        crypto.trxDolar = trxText.split('+')[0].trim();
      } else if (trxText.includes('-')) {
        crypto.trxDolar = trxText.split('-')[0].trim();
      } else {
        crypto.trxDolar = trxText.trim();
      }
    } catch (error) {
      return { error: 'Error al obtener la cotización de Tron', detalle: error.message };
    }

    try {
      const { data: fetData } = await axios.get("https://www.kucoin.com/es/price/FET");
      const $fet = cheerio.load(fetData);

      let fetText = $fet(SELECTORS.fetDolarSelect).text();
      if (fetText.includes('+')) {
        crypto.fetDolar = fetText.split('+')[0].trim();
      } else if (fetText.includes('-')) {
        crypto.fetDolar = fetText.split('-')[0].trim();
      } else {
        crypto.fetDolar = fetText.trim();
      }
    } catch (error) {
      return { error: 'Error al obtener la cotización de Tron', detalle: error.message };
    }

    return crypto;
  };
  
// Ruta para obtener la cotización de criptomonedas
router.get('/', async (req, res) => {
  const data = await updateCrypto();
  res.json(data);
});

export default router;
