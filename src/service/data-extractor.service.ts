import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { fileService } from './file.service';

class DataExtractorService extends RestService implements Enhancer {

  public createExtractor(extractor: any): Promise<any> {
    return this.post(`${config.get('mod-data-extractor')}/extractors`, extractor);
  }

  public enhance(path: string, json: any): any {
    const extractor = JSON.parse(json);
    if (extractor.queryTemplate) {
      if (fileService.exists(`${path}/sql/${extractor.queryTemplate}`)) {
        extractor.queryTemplate = fileService.read(`${path}/sql/${extractor.queryTemplate}`).trim();
        if (extractor.queryTemplate.endsWith(';')) {
          extractor.queryTemplate = extractor.queryTemplate.slice(0, -1);
        }
      }
    }
    return JSON.stringify(extractor);
  }

}

export const modDataExtractor = new DataExtractorService();
