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
GET /monedas: Devuelve las cotizaciones actuales de diversas monedas, incluyendo el dólar y el euro.

Criptomonedas
GET /crypto: Esta ruta devuelve las cotizaciones de diversas criptomonedas (actualmente en desarrollo).
Respuesta de la API

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
Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.