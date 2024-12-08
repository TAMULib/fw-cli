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
import { config } from '../config';
import { parseCookie } from './cookie.utility';
import { RestService } from './rest.service';

class OkapiService extends RestService {

  public login(username: string = config.get('username'), password: string = config.get('password')): Promise<any> {
    config.delete('token');
    config.delete('folioAccessToken');
    config.delete('folioRefreshToken');

    const url = `${config.get('okapi')}${config.get('okapi_login_path')}`;
    const json = { username, password };

    return new Promise((resolve, reject) => {
      this.request({
        url,
        json,
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }, (error: any, response: any, body: any) => {
        if (!!response && response?.statusCode >= 200 && response?.statusCode <= 299) {
          let accessToken;
          let refreshToken;

          const headers = response?.headers;

          if (!!headers?.['set-cookie'] && Array.isArray(headers['set-cookie'])) {
            const extractCookieValue = (token: string) => {
              const cookie = headers['set-cookie'].find((c: string) => c.startsWith(token));
              const cookieMap = parseCookie(cookie);
              if (cookieMap.has(token)) {
                return cookieMap.get(token);
              }
            };

            accessToken = extractCookieValue('folioAccessToken');
            refreshToken = extractCookieValue('folioRefreshToken');

          } else {
            if (!!response?.body?.okapiToken) {
              accessToken = response.body.okapiToken;
            } else if (!!headers?.['x-okapi-token']) {
              accessToken = headers['x-okapi-token'];
            }

            if (!!response?.body?.refreshToken) {
              refreshToken = response.body.refreshToken;
            } else if (!!response?.body?.folioRefreshToken) {
              refreshToken = response.body.folioRefreshToken;
            }
          }

          if (!!accessToken) {
            config.set('token', accessToken);
            config.set('folioAccessToken', accessToken);
          }

          if (!!refreshToken) {
            config.set('folioRefreshToken', refreshToken);
          }

          resolve({ status: `Login succeeded for user '${username}'.`, accessToken, refreshToken });
        } else {
          reject({ status: `Login failed for user '${username}'.`, body });
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
          'X-Okapi-Tenant': config.get('tenant'),
          'X-Okapi-Token': config.get('token'),
          'Accept': ['application/json', 'text/plain'],
          'Content-Type': 'application/json'
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          const users = JSON.parse(body).users;
          if (users.length > 0) {
            const user = users[0]
            config.set('userId', user.id);
            resolve(user);
          } else {
            reject(`cannot find user ${username}`)
          }
        } else {
          console.log('failed user lookup', url);
          reject(body);
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
          }
        }
        reject(`${name} not found`);
      });
    });
  }

}

export const okapi = new OkapiService();
