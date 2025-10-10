/*
  Copyright (C) 2024  Texas A&M University Libraries

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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

server.post('/authn/login-with-expiry', function (req, res) {
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
