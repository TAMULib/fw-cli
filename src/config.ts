/*
  Copyright (C) 2024-2025 Texas A&M University Libraries

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
  access: {
    type: 'string',
    enum: ['okapi', 'mod-workflow'],
    default: 'mod-workflow',
  },
  accessToken: {
    type: 'object',
    default: {},
  },
  okapi: {
    type: 'string',
    default: 'http://localhost:9130',
  },
  okapiLoginPath: {
    type: 'string',
    default: '/authn/login-with-expiry',
  },
  'mod-workflow': {
    type: 'string',
    default: 'http://localhost:9001',
  },
  password: {
    type: 'string',
    default: 'admin',
  },
  refreshToken: {
    type: 'object',
    default: {},
  },
  tenant: {
    type: 'string',
    default: 'diku'
  },
  token: {
    type: 'string',
    default: '',
  },
  username: {
    type: 'string',
    default: 'diku_admin',
  },
  userId: {
    type: 'string',
    default: '',
  },
  wd: {
    type: 'string',
    default: './fw-registry',
  }
};

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
