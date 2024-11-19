Cotizaciones API
Esta API proporciona información en tiempo real sobre cotizaciones de monedas y criptomonedas mediante técnicas de scraping desde diversas fuentes. Es ideal para obtener datos actualizados de tipos de cambio y precios de criptomonedas.

Tabla de Contenidos
Instalación
Uso
Rutas Disponibles
Respuesta de la API
Tecnologías Utilizadas
Contribuciones
Licencia
Instalación
Sigue estos pasos para configurar y ejecutar la API en tu entorno local:

Clona este repositorio:

git clone https://github.com/FedeSca001/bot-scraping
cd bot-scraping

Instala las dependencias necesarias:

npm install

Inicia el servidor:
npm start

El servidor se iniciará en http://localhost:5050.

Uso
Una vez que el servidor está en funcionamiento, puedes acceder a las rutas disponibles utilizando herramientas como Postman o tu navegador web.

Ejemplo de uso
Para obtener las cotizaciones de monedas, realiza una solicitud GET a la siguiente URL:

http://localhost:5050/monedas

También puedes utilizar la versión desplegada en:

https://bot-scraping.onrender.com/monedas

Rutas Disponibles
Monedas
GET /monedas
Devuelve las cotizaciones actuales de diversas monedas, incluyendo el dólar y el euro.

Criptomonedas
GET /crypto
Devuelve las cotizaciones de diversas criptomonedas. (Actualmente en desarrollo).

MotoGP
GET /motogp
Devuelve las últimas noticias relacionadas con MotoGP, extraídas de fuentes confiables.

GET /motogpmotorsport
Devuelve noticias relacionadas con MotoGP específicamente desde el sitio web de Motorsport.

GET /clasificacionMotogp
Devuelve la clasificación actual de los pilotos en MotoGP.

GET /clasificacionMotogp/moto2
Devuelve la clasificación actual de los pilotos en la categoría Moto2.

GET /clasificacionMotogp/moto3
Devuelve la clasificación actual de los pilotos en la categoría Moto3.

Fórmula 1
GET /formula1Oficial
Devuelve noticias sobre la Fórmula 1 extraídas de su sitio oficial.

GET /formula1DiarioAS
Devuelve noticias sobre la Fórmula 1 extraídas del diario AS.

GET /clasificacionF1/pilotos
Devuelve la clasificación actual de los pilotos en la categoría Fórmula 1.

GET /clasificacionF1/equipos
Devuelve la clasificación actual de los equipos en la categoría Fórmula 1.

Clima
GET /climaWeatherapi
Devuelve datos climáticos obtenidos de la API de WeatherAPI.


Ejemplo de respuesta para /monedas:
{
  "dolarArgentina": {
    "precioDolarBlueCompra": "350.00",
    "precioDolarBlueVenta": "355.00",
    "precioDolarBnaCompra": "340.00",
    "precioDolarBnaVenta": "345.00",
    "precioDolarTurista": "370.00"
  },
  "euroDolar": "1.12",
  "euroYuan": "7.92",
  "dolarYuan": "6.47",
  "fecha": {
    "dia": "16/08/2024",
    "hora": "14:00"
  }
}

Ejemplo de respuesta para /crypto:
{
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

Tecnologías Utilizadas
Node.js: Entorno de ejecución para JavaScript en el servidor.
Express: Framework web para Node.js que facilita la creación de servidores y APIs.
Axios: Cliente HTTP que se utiliza para realizar solicitudes a las fuentes de datos.
Cheerio: Biblioteca que facilita el scraping de HTML para extraer información.
ES6+: Utilización de las últimas características del lenguaje JavaScript.

Contribuciones
Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.