/*
  Copyright (C) 2024-2026 Texas A&M University Libraries

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

const schema = {
  cliAccess: {
    type: 'string',
    enum: ['gateway', 'direct'],
    default: 'gateway',
  },
  cliAutoRefresh: {
    type: 'boolean',
    default: true,
  },
  cliDirectUrl: {
    type: 'string',
    default: 'http://localhost:9001',
  },
  cliFolioLoginPath: {
    type: 'string',
    default: '/authn/login-with-expiry',
  },
  cliFolioPass: {
    type: 'string',
    default: 'admin',
  },
  cliFolioRefreshPath: {
    type: 'string',
    default: '/authn/refresh',
  },
  cliFolioTenant: {
    type: 'string',
    default: 'diku'
  },
  cliFolioUser: {
    type: 'string',
    default: 'diku_admin',
  },
  cliGatewayUrl: {
    type: 'string',
    default: 'http://localhost:9130',
  },
  cliWd: {
    type: 'string',
    default: './fw-registry',
  },
  folioPass: {
    type: 'string',
    default: '',
  },
  folioUser: {
    type: 'string',
    default: '',
  },
  gatewayUrl: {
    type: 'string',
    default: 'http://localhost:9130',
  }
};

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
