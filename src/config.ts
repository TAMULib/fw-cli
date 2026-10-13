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

import sha256 from 'crypto-js/sha256';

/**
 * A list of all fields private to fw-cli.
 *
 * These are excluded from the list during generation of a workflow and check sum processes.
 */
export const privateConfigFields = [
  'cliAccess',
  'cliAutoRefresh',
  'cliDirectUrl',
  'cliFolioLoginPath',
  'cliFolioPass',
  'cliFolioRefreshPath',
  'cliFolioTenant',
  'cliFolioUser',
  'cliGatewayUrl',
  'cliWd',
];

/**
 * The initial schema template.
 *
 */
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

/**
 * Use SHA256 in such a way that it matches what can be reproduced through manual hashing.
 *
 * This excludes all **CLI** specific variables as well as designated custom identifiers.
 *
 * This should produce an identical hash to the command:
 *   ```sh
 *   jq --sort-keys -cM '
 *     del(.cliAccess, .cliAutoRefresh, .cliDirectUrl, .cliFolioLoginPath, .cliFolioPass, .cliFolioRefreshPath, .cliFolioTenant, .cliFolioUser, .cliGatewayUrl, .cliWd)
 *     | walk(if type == "object"
 *     then with_entries(
 *       select(.key | test("[^\\w-]") | not)
 *     )
 *     else . end
 *   )' config.json | sha256sum
 *   ```
 * Where `config.json` is the configuration file.
 *
 * The trailing new line is necessary to produce a consistent valid hash in this manner.
 *
 * @return The configration hash string.
 */
export function configChecksum(): string {
  const json = JSON.stringify(sortConfig(config, privateConfigFields)) + '\n';

  return sha256(json).toString();
}

/**
 * Test a JSON identifier / key to determine if it is a designated custom identifier.
 *
 * The practice being used to designate custom identifiers is to use non-word characters (other than `-`), similiar to the following example:
 *  ```
 *    "==FILE==": "EXAMPLE",
 *  ```
 *
 * @param key The JSON key to be tested.
 *
 * @returns `true` if the key matches the expected practices of a custom identifier, `false` otherwise.
 */
function customJsonIdentifier(key: string): boolean {
  const customValidatorRegex = /[^\w-]/;
  return customValidatorRegex.test(key);
}

/**
 * Get the configuration as JSON, in a sorted manner.
 *
 * @param config    The configuration to sort.
 * @param filterOut (optional) An array list of keys to filter out.
 *
 * @return a JSON Object representing the configuration.
 */
export function sortConfig(config?: any, filterOut?: string[]): Object {
  const sorted = Object.entries(config?.store)
    .sort(([left], [right]) => left.localeCompare(right))

  return Object.fromEntries(
    filterOut
      ? sorted.filter(([key]) => !filterOut.includes(key) && !customJsonIdentifier(key))
      : sorted
  );
}

export const projectName = 'fwcli';

export const config = new Conf({
  projectName,
  schema
});
