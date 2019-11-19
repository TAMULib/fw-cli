import { RestService } from './rest.service';
import { config } from '../config';

class OkapiService extends RestService {

  public login(username: string = config.get('username'), password: string = config.get('password')): Promise<any> {
    config.delete('token');
    const url = `${config.get('okapi')}/authn/login`;
    const json = { username, password };
    return new Promise((resolve, reject) => {
      this.request({
        url,
        json,
        method: 'POST',
        headers: {
          'X-Okapi-Tenant': config.get('tenant'),
          'Content-Type': 'application/json'
        }
      }, (error: any, response: any, body: any) => {
        if (response && response.statusCode >= 200 && response.statusCode <= 299) {
          const token = response.headers['x-okapi-token'];
          config.set('token', token);
          resolve(token);
        } else {
          console.log('failed login', url, { username, password });
          reject(body);
        }
      });
    });
  }

  public createReferenceData(request: { path: string, config?: string, data: any[] }): Promise<any> {
    return request.data.map((data: any) => {
      return () => {
        const promise = this.post(`${config.get('okapi')}/${request.path}`, data);
        if (request.config) {
          promise.then((res) => {
            // NOTE: adding id response into config only supports single reference data
            const jobExecutionId = res.jobExecutions[0].id;
            config.set(request.config, jobExecutionId);
          });
        }
        return promise;
      };
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
