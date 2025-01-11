// server.ts
const https = require('https');
const fs = require('fs');
const path = require('path');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(process.cwd(), 'certificates/localhost-key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'certificates/localhost.pem')),
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req:Request, res:Response) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log('> Ready on https://localhost:3000');
  });
});