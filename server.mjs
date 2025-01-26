import fs from "fs";
import { createServer } from "https";
import next from "next";
import path from "path";
import { fileURLToPath, parse } from "url";

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "sugandha.key")),
  cert: fs.readFileSync(path.join(__dirname, "sugandha.crt")),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log("> Ready on https://localhost:3000");
  });
});
