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
import { config } from '../config';
import { parseCookie } from './cookie.utility';
import { RestService } from './rest.service';

class OkapiService extends RestService {

  public login(username: string = config.get('username'), password: string = config.get('password')): Promise<any> {
    config.delete('token');
    config.delete('accessToken');
    config.delete('refreshToken');

    return new Promise((resolve, reject) => {
      this.request({
        url: `${config.get('okapi')}${config.get('okapiLoginPath')}`,
        json: { username, password },
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
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
            resp.headers['set-cookie'].forEach((cookie: any) => {
              if (cookie.match(matchAccess)) {
                accessToken = {};

                cookie.split(';').forEach((fields: any) => {
                  const parts = fields.split('=');

                  if (parts.length > 0 && parts.length < 3) {
                    accessToken[parts[0].trim()] = parts[1] ?? true;
                  }
                });
              } else if (cookie.match(matchRefresh)) {
                refreshToken = {};

                cookie.split(';').forEach((fields: any) => {
                  const parts: string[] = fields.split('=');

                  if (parts.length > 0 && parts.length < 3) {
                    refreshToken[parts[0].trim()] = parts[1] ?? true;
                  }
                });
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
            config.set('token', accessToken.folioAccessToken);
            config.set('accessToken', accessToken);

            if (!!refreshToken?.folioRefreshToken) {
              config.set('refreshToken', refreshToken);
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
    const url = `${config.get('okapi')}/users?query=username==${username}`;

    return new Promise((resolve, reject) => {
      this.request({
        url,
        method: 'GET',
        headers: {
          'Accept': ['application/json', 'text/plain'],
          'Content-Type': 'application/json',
          'X-Okapi-Tenant': config.get('tenant'),
          ...this.buildAccessHeaders(),
        }
      }, (error: any, resp: any, body: any) => {
        if (resp?.statusCode >= 200 && resp?.statusCode <= 299) {
          const users = JSON.parse(body).users;

          if (users.length > 0) {
            const user = users[0]
            config.set('userId', user.id);

            resolve(user);
          } else {
            this.serviceError(`Cannot find user ${username}.`, url, reject, body, resp);
          }
        } else {
          this.serviceError(`Failed to lookup user ${username}.`, url, reject, !!error ? error : body, resp);
        }
      });
    });
  }

  public createReferenceData(request: { path: string, config?: string, data: any[] }): Promise<any> {
    return request.data.map((data: any) => {
      return () => this.post(`${config.get('okapi')}/${request.path}`, data);
    }).reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
  }

  public deleteReferenceData(request: { path: string, config?: string, data: any[] }): Promise<any> {
    return request.data.map((data: any) => {
      return () => {
        const id = request.config ? config.get(request.config) : data.id;
        return this.delete(`${config.get('okapi')}/${request.path}/${id}`);
      };
    }).reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
  }

  public getDiscoveryModules(): Promise<any> {
    return this.get(`${config.get('okapi')}/_/discovery/modules`);
  }

  public getDiscoveryModuleURL(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.get(`${config.get('okapi')}/_/discovery/modules`).then((modules: any[]) => {
        for (const module of modules) {
          if (module.srvcId.startsWith(name) || module.srvcId.startsWith(`mod-${name}`)) {
            resolve(module.url);

            return;
          }
        }

        reject(`${name} not found`);
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
      `${config.get('okapi')}${config.get('okapiLoginPath')}`,
      reject,
      body,
      resp
    );
  }

}

export const okapi = new OkapiService();
