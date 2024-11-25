/*
  Copyright (C) 2024  Texas A&M University Libraries

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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
