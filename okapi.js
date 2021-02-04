var compression = require('compression');
var cors = require('cors');
var express = require('express');

var server = express();
server.use(cors());
server.use(compression());

server.use(express.json({ limit: '50mb' }));
server.use(express.urlencoded({ extended: true }))

const PORT = 9130;
const HOST = 'localhost';
const BASE_HREF = '/';

server.post('/authn/login', function (req, res) {
  console.log(JSON.stringify(req.body));
  console.log(req.headers);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Okapi-Token', 'TOKEN');
  res.send({});
});

server.post('/user-import', function (req, res) {
  console.log(JSON.stringify(req.body));
  console.log(req.headers);
  res.setHeader('Content-Type', 'application/json');
  res.send({});
});

server.listen(PORT, HOST, () => {
  console.log(`Mock Okapi server listening on http://${HOST}:${PORT}${BASE_HREF}`);
});
