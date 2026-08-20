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
const process = require('node:process');

import { config } from '../config';
import { RestService } from './rest.service';

class OkapiService extends RestService {

  public login(username: string = config.get('cliFolioUser'), password: string = config.get('cliFolioPass')): Promise<any> {
    config.delete('cliFolioToken');
    config.delete('cliFolioAccessToken');
    config.delete('cliFolioRefreshToken');

    return new Promise((resolve, reject) => {
      this.request({
        url: `${config.get('cliGatewayUrl')}${config.get('cliFolioLoginPath')}`,
        json: { username, password },
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': config.get('cliFolioTenant'),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }, (error: any, resp: any, body: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          const matchAccess = /folioAccessToken=([^;\s]*)/i;
          const matchRefresh = /folioRefreshToken=([^;\s]*)/i;

          let accessToken: Record<string, any> = {};
          let refreshToken: Record<string, any> = {};

          if (!!resp?.headers['set-cookie'] && Array.isArray(resp?.headers['set-cookie'])) {
            resp.headers['set-cookie'].forEach((cookie: string) => {
              if (cookie.match(matchAccess)) {
                accessToken = this.cookieToObject(cookie);
              } else if (cookie.match(matchRefresh)) {
                refreshToken = this.cookieToObject(cookie);
              }
            });
          } else {
            if (!!resp?.body?.okapiToken) {
              accessToken = { folioAccessToken: resp.body.okapiToken };
            } else if (!!resp.headers['x-okapi-token']) {
              accessToken = { folioAccessToken: resp.headers['x-okapi-token'] };
            }

            if (!!resp.body?.refreshToken) {
              refreshToken = { folioRefreshToken: resp.body.refreshToken };
            } else if (!!resp.body?.folioRefreshToken) {
              refreshToken = { folioRefreshToken: resp.body.folioRefreshToken };
            }
          }

          // This preserves `token` for backwards compatibility and for simple script expansion in the registry scripts.
          // The `accessToken` and `refreshToken` provide complete objects to use on HTTP requests.
          // If the `refreshToken` is an empty Object, then this must be a non-RTR access, so `accessToken.folioAccessToken` represents the `X-Okapi-Token`.
          if (!!accessToken?.folioAccessToken) {
            config.set('cliFolioToken', accessToken.folioAccessToken);
            config.set('cliFolioAccessToken', accessToken);

            if (!!refreshToken?.folioRefreshToken) {
              config.set('cliFolioRefreshToken', refreshToken);
            }

            resolve({
              status: `Login succeeded for user '${username}'.`,
              http: {
                code: resp?.statusCode,
                message: resp?.statusMessage,
              },
              tokens: {
                accessToken,
                refreshToken,
                token: accessToken?.folioAccessToken,
              },
            });
          } else {
            this.loginError(username, reject, body, resp);
          }
        } else {
          this.loginError(username, reject, body, resp);
        }
      });
    });
  }

  public getUser(username: string = config.get('username')): Promise<any> {
    const url = `${config.get('cliGatewayUrl')}/users?query=username==${username}`;

    return new Promise((resolve, reject) => {
      this.request({
        url,
        method: 'GET',
        headers: {
          'Accept': ['application/json', 'text/plain'],
          'Content-Type': 'application/json',
          'X-Okapi-Tenant': config.get('cliFolioTenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp: any, body: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          const users = JSON.parse(body).users;

          if (users?.length > 0) {
            const user = users[0]
            config.set('cliUserId', user.id);

            resolve(user);
          } else {
            this.serviceError(`Error: Cannot find user ${username}.`, url, reject, body, error, resp);
          }
        } else {
          this.serviceError(`Error: Failed to lookup user ${username}.`, url, reject, body, error, resp);
        }
      });
    });
  }

  public createReferenceData(request: { path: string, config?: string, data: any[] }): Promise<any> {
    return request.data.map((data: any) => {
      return () => this.post(`${config.get('cliGatewayUrl')}/${request.path}`, data);
    }).reduce((chain, callback) => {
      return chain.then(() =>
        callback().then(response => {
          return response;
        })
      );
    }, Promise.resolve())
    .catch((error) => {
      process.exitCode = 2;

      return Promise.reject(error);
    });
  }

  public deleteReferenceData(request: { path: string, config?: string, data: any[] }): Promise<any> {
    return request.data.map((data: any) => {
      return () => {
        const id = request.config ? config.get(request.config) : data.id;
        return this.delete(`${config.get('cliGatewayUrl')}/${request.path}/${id}`);
      };
    }).reduce((chain, callback) => {
      return chain.then(() =>
        callback().then(response => {
          return response;
        })
      );
    }, Promise.resolve())
    .catch((error) => {
      process.exitCode = 2;

      return Promise.reject(error);
    });
  }

  public getDiscoveryModules(): Promise<any> {
    return this.get(`${config.get('cliGatewayUrl')}/_/discovery/modules`);
  }

  public getDiscoveryModuleURL(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.get(`${config.get('cliGatewayUrl')}/_/discovery/modules`).then((modules: any[]) => {
        for (const module of modules) {
          if (module.srvcId.startsWith(name) || module.srvcId.startsWith(`mod-${name}`)) {
            resolve(module.url);

            return;
          }
        }

        process.exitCode = 2;

        reject(`Error: ${name} not found.`);
      }).catch(reject);
    });
  }

  /**
   * Helper function for rejecting the login failure.
   *
   * @param user   - The user name.
   * @param reject - The promise reject callback.
   * @param body   - The exception or an error message.
   * @param [resp] - The response data.
   */
  protected loginError(user: string, reject: any, body: any, resp?: any) {
    this.serviceError(`Login failed for user '${user}'.`,
      `${config.get('cliGatewayUrl')}${config.get('cliFolioLoginPath')}`,
      reject,
      body,
      null,
      resp
    );

    process.exitCode = 3;
  }

  /**
   * Extract the cookie and its parts from a string to an object.
   *
   * This sets the key value pair to TRUE if there is no value to allow for easy boolean tests.
   * This is particularly important for token processing logic.
   *
   * @param cookie - The cookie to parse.
   *
   * @return An object representing the cookie.
   */
  protected cookieToObject(cookie: string): Record<string, any> {
    const result: Record<string, any> = {};

    cookie.split(';').forEach((fields: any) => {
      const parts = fields.split('=');

      if (parts.length > 0 && parts.length < 3) {
        result[parts[0].trim()] = parts[1] ?? true;
      }
    });

    return result;
  }

}

export const gateway = new OkapiService();
