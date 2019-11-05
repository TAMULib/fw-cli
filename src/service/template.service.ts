const handlebars = require('handlebars');

import { config } from '../config';

class TemplateService {

  public template(value: string, data: any = {}): any {
    const templateFn = handlebars.compile(value);
    const store = JSON.parse(JSON.stringify(config.store));
    return templateFn(Object.assign(data, store));
  }

}

export const templateService = new TemplateService();
