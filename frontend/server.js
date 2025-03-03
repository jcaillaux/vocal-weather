const next = require('next');
const https = require('https');
const fs = require('fs');
const { parse } = require('url');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Assurez-vous que ces chemins sont corrects
const httpsOptions = {
  key: fs.readFileSync('./localhost+4-key.pem'),
  cert: fs.readFileSync('./localhost+4.pem')
};

// Obtenez votre adresse IP locale
const getLocalIP = () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Ignorer les interfaces non IPv4 et internes
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '0.0.0.0'; // Fallback
};

const localIP = getLocalIP();
const port = 3000;

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, '0.0.0.0', err => {
    if (err) throw err;
    console.log(`> Ready on https://localhost:${port}`);
    console.log(`> Network access available at https://${localIP}:${port}`);
  });
});