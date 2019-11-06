import { RestService } from './rest.service';

import { config } from '../config';

class ExternalReferenceService extends RestService {

  public createReferenceLinkType(referenceLinkType: any): Promise<any> {
    return this.post(`${config.get('mod-external-reference-resolver')}/referenceLinkTypes`, referenceLinkType);
  }

}

export const modExternalReferenceResolver = new ExternalReferenceService();
