import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';

class ExternalReferenceService extends RestService implements Enhancer {

  public createReferenceLinkType(referenceLinkType: any): Promise<any> {
    return this.post(`${config.get('modExternalReferenceResolver')}/referenceLinkTypes`, referenceLinkType);
  }

  public enhance(path: string, json: any): any {
    return json;
  }

}

export const modExternalReferenceResolver = new ExternalReferenceService();
