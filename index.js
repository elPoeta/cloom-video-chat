const http = require('http');
const url = require('url');
const { PORT } = require('./config/keys');

const httpServer = (req, res) => {

}

const server = http.createServer(httpServer);

server.listen(PORT, error => {
  if (error) console.error(`Error to start server: ${error}`);
  console.log(`Server ran on port: ${PORT}`)
})