const https = require('https');

// Usa la URL pública de tu portfolio, leyendo la variable de entorno que pusimos en Render
const url = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolioai-o1je.onrender.com';

function keepAlive() {
  // Genera un tiempo aleatorio entre 5 y 14 minutos (para evitar los 15 min de Render)
  // 5 minutos = 300,000 milisegundos
  // 14 minutos = 840,000 milisegundos
  const min = 5 * 60 * 1000;
  const max = 14 * 60 * 1000;
  const interval = Math.floor(Math.random() * (max - min + 1)) + min;

  setTimeout(() => {
    console.log(`[Keep-Alive] Haciendo ping a ${url} para mantener el servidor despierto...`);
    
    // Hacemos una petición GET sencilla a la raíz del proyecto
    https.get(url, (res) => {
      console.log(`[Keep-Alive] Éxito. Estado de la respuesta: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[Keep-Alive] Error en el ping: ${err.message}`);
    });

    // Programamos el siguiente ping recursivamente
    keepAlive();
  }, interval);
}

// Inicializamos el ciclo
console.log(`[Keep-Alive] Servicio de auto-ping iniciado. Los pings serán aleatorios entre 5 y 14 mins.`);
keepAlive();
