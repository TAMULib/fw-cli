import { RestService } from './rest.service';

import { config } from '../config';
import { fileService } from './file.service';
import { okapi } from './okapi.service';

class MappingRulesService extends RestService {

  public update(path: string, endpoint: string = 'mapping-rules'): Promise<any> {
    if (fileService.exists(path)) {
      const rules = fileService.read(path);
      if (rules.length === 0) {
        return Promise.resolve();
      }
      return [
        () => okapi.login(),
        () => okapi.put(`${config.get('okapi')}/${endpoint}`, JSON.parse(rules))
      ].reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find rules at ${path}`);
  }

}

export const mappingRules = new MappingRulesService();
