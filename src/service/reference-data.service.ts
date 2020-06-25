import { RestService } from './rest.service';

import { config } from '../config';
import { fileService } from './file.service';
import { templateService } from './template.service';
import { okapi } from './okapi.service';

class ReferenceDataService extends RestService {

  public createReferenceData(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceData`;
    if (fileService.exists(path)) {
      const references = fileService.readAll(path);
      if (references.length === 0) {
        return Promise.resolve();
      }
      return [
        () => okapi.login(),
        () => okapi.getUser(),
        // clear reference data, iterate in reverse
        () => references.slice().reverse()
          .map((json: any) => JSON.parse(json))
          .map((reference: any) => () => okapi.deleteReferenceData(reference))
          .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve()),
        // create reference data
        () => references
          .map((json: any) => templateService.template(json))
          .map((json: any) => {
            console.log('loading', json);
            return JSON.parse(json);
          })
          .map((data: any) => () => okapi.createReferenceData(data))
          .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve())
      ].reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find reference data at ${path}`);
  }

  // TODO: sort reference data by dependency to remove file name convention requirements

}

export const referenceData = new ReferenceDataService();
