import { RestService } from './rest.service';

import { config } from '../config';
import { modExternalReferenceResolver } from './external-reference.service';
import { fileService } from './file.service';
import { templateService } from './template.service';

class ReferenceLinksService extends RestService {

  public createReferenceLinkTypes(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceLinkTypes`;
    if (fileService.exists(path)) {
      return fileService.readAll(path, '.json')
        .map((json: any) => templateService.template(json))
        .map((json: any) => {
          console.log('loading', json);
          return JSON.parse(json);
        })
        .map((data: any) => () => modExternalReferenceResolver.createReferenceLinkType(data))
        .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find reference link types at ${path}`);
  }

}

export const referenceLinks = new ReferenceLinksService();
