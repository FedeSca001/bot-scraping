# Cotizaciones API

Esta API proporciona información sobre cotizaciones de monedas y criptomonedas en tiempo real, utilizando scraping de diversas fuentes. Es ideal para obtener datos actualizados de diferentes tipos de cambio y precios de criptomonedas.

## Tabla de Contenidos
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas Disponibles](#rutas-disponibles)
- [Respuesta de la API](#respuesta-de-la-api)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

## Instalación

Sigue estos pasos para configurar y ejecutar la API en tu entorno local:

1. **Clona este repositorio:**

Navega al directorio del proyecto:
cd tu_repositorio

Instala las dependencias necesarias:
npm install

Inicia el servidor:
npm start

El servidor se iniciará en http://localhost:5050.

Uso
Una vez que el servidor está en funcionamiento, puedes acceder a las rutas disponibles utilizando una herramienta como Postman o desde el navegador.

Ejemplo de uso
Para obtener las cotizaciones de monedas, realiza una solicitud GET a la siguiente URL:
http://localhost:5050/monedas

Rutas Disponibles
Monedas
GET /monedas: Devuelve las cotizaciones actuales de diversas monedas, incluyendo el dólar y el euro.
Criptomonedas
GET /crypto: Esta ruta devolverá las cotizaciones de diversas criptomonedas.
Respuesta de la API

Ejemplo de respuesta para /monedas/cotizacion:
json
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
    "hora": "14"
  }
}

Ejemplo de respuesta para /crypto:
Actualmente, esta ruta está en desarrollo y devolverá la siguiente respuesta:

json
{
  "message": "En proceso de implementación"
}
Tecnologías Utilizadas
Node.js: Entorno de ejecución para JavaScript en el servidor.
Express: Framework web para Node.js.
Axios: Cliente HTTP para realizar solicitudes a las fuentes de datos.
Cheerio: Biblioteca para realizar scraping de HTML.
Contribuciones
Las contribuciones son bienvenidas. Si deseas colaborar, por favor, abre un issue o envía un pull request.