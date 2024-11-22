/*
  Copyright (C) 2024  William Stanley Welling

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
const Conf = require('conf');

// tslint:disable: object-literal-key-quotes
const schema = {
  wd: {
    type: 'string',
    default: './fw-registry'
  },
  okapi: {
    type: 'string',
    default: 'http://localhost:9130'
  },
  'okapi-internal': {
    type: 'string',
    default: 'http://localhost:9130'
  },
  tenant: {
    type: 'string',
    default: 'diku'
  },
  token: {
    type: 'string',
    default: ''
  },
  username: {
    type: 'string',
    default: 'diku_admin'
  },
  password: {
    type: 'string',
    default: 'admin'
  },
  userId: {
    type: 'string',
    default: 'ad6d42d1-1239-526b-a997-6b96888f7719'
  },
  'mod-camunda': {
    type: 'string',
    default: 'http://localhost:9000'
  },
  'mod-camunda-internal': {
    type: 'string',
    default: 'http://localhost:9000'
  },
  'mod-workflow': {
    type: 'string',
    default: 'http://localhost:9001'
  },
  'mod-workflow-internal': {
    type: 'string',
    default: 'http://localhost:9001'
  }
};

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
