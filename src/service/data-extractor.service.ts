import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { fileService } from './file.service';

class DataExtractorService extends RestService implements Enhancer {

  public createExtractor(extractor: any): Promise<any> {
    return this.post(`${config.get('modDataExtractor')}/extractors`, extractor);
  }

  public enhance(path: string, json: any): any {
    const obj = JSON.parse(json);
    if (obj.query) {
      if (fileService.exists(`${path}/js/${obj.query}`)) {
        obj.query = fileService.read(`${path}/sql/${obj.query}`);
      }
    }
    return JSON.stringify(obj);
  }

}

export const modDataExtractor = new DataExtractorService();
