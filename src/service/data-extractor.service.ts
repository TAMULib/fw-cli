import { RestService } from './rest.service';
import { config } from '../config';

class DataExtractorService extends RestService {

  public createExtractor(extractor: any): Promise<any> {
    return this.post(`${config.get('modDataExtractor')}/extractors`, extractor);
  }

}

export const modDataExtractor = new DataExtractorService();