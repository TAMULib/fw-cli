import { RestService } from './rest.service';
import { config } from '../config';

class OkapiService extends RestService {

  public login(username: string = config.get('username'), password: string = config.get('password')): Promise<any> {
    config.delete('token');
    config.delete('folioAccessToken');
    config.delete('folioRefreshToken');

    let okapi_login_path = config.get('okapi_login_path');
    if (okapi_login_path === undefined) {
      okapi_login_path = '/authn/login';
    }

    const url = `${config.get('okapi')}${okapi_login_path}`;
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
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          let accessToken;
          let refreshToken;

          if (!!response.headers['set-cookie']) {
            const matchAccess = /folioAccessToken=([^;\s]*)/gi;
            const matchRefresh = /folioRefreshToken=([^;\s]*)/gi;
            const cookies = !!response.headers['set-cookie'] ? response.headers['set-cookie'] : undefined;
            let foundAccess;
            let foundRefresh;

            if (Array.isArray(cookies)) {
              let matched;

              for (let i = 0; i < cookies.length; i++) {
                matched = cookies[i].match(matchAccess);

                if (!!matched) {
                  foundAccess = matched;
                } else {
                  matched = cookies[i].match(matchRefresh);

                  if (!!matched) {
                    foundRefresh = matched;
                  }
                }
              }
            } else {
              foundAccess = cookies.match(matchAccess);
              foundRefresh = cookies.match(matchRefresh);
            }

            accessToken = Array.isArray(foundAccess) ? foundAccess[0] : undefined;
            refreshToken = Array.isArray(foundRefresh) ? foundRefresh[0] : undefined;
          } else {
            if (!!response.body.okapiToken) {
              accessToken = response.body.okapiToken;
            } else if (!!response.headers['x-okapi-token']) {
              accessToken = response.headers['x-okapi-token'];
            }

            if (!!response.body.refreshToken) {
              refreshToken = response.body.refreshToken;
            } else if (!!response.body.folioRefreshToken) {
              refreshToken = response.body.folioRefreshToken;
            }
          }

          config.set('token', accessToken);
          config.set('folioAccessToken', accessToken);
          config.set('folioRefreshToken', refreshToken);

          resolve(accessToken);
        } else {
          console.log('failed login', url, { username, password });
          reject(body);
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
