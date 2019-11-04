import { RestService } from "./rest.service";

const config = require('../../config/default.json');

class OkapiService extends RestService {

  public login(username: string = config.username, password: string = config.password): Promise<any> {
    return this.post(`${config.okapi}/authn/login`, { username, password });
  }

  public getDiscoveryModules(): Promise<any> {
    return this.get(`${config.okapi}/_/discovery/modules`);
  }

  public getDiscoveryModuleURL(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.get(`${config.okapi}/_/discovery/modules`).then((modules: any[]) => {
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