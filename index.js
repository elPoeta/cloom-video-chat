const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const lookup = require("mime-types").lookup;
const { PORT } = require('./config/keys');

const httpServer = (req, res) => {
  let parsedURL = url.parse(req.url, true);
  let urlPath = parsedURL.path.replace(/^\/+|\/+$/g, "");
  if (urlPath == "") {
    urlPath = "index.html";
  }
  if (urlPath.toLowerCase() != 'chatroom') {
    let file = __dirname + "/public/" + urlPath;
    let mime = lookup(urlPath);
    res.writeHead(200, { "Content-type": mime });
    const readStream = fs.createReadStream(file, { encoding: 'utf-8' });
    readStream.on('error', function (error) {
      res.writeHead(404, 'Not Found');
      res.write('404: File Not Found!');
      res.end();
    });
    res.statusCode = 200;
    readStream.pipe(res);
  }
}

const server = http.createServer(httpServer);

server.listen(PORT, error => {
  if (error) console.error(`Error to start server: ${error}`);
  console.log(`Server ran on port: ${PORT}`)
})