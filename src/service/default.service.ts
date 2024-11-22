/*
  Copyright (C) 2024  William Stanley Welling

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
const uuid = require('uuid/v4');

class DefaultService {

  public trigger(): any {
    return {
      id: uuid(),
      name: '',
      description: '',
      type: 'MESSAGE_CORRELATE',
      method: 'POST',
      deserializeAs: 'EventTrigger',
      pathPattern: ''
    };
  }

  public workflow(): any {
    return {
      id: uuid(),
      name: '',
      description: '',
      versionTag: '1.0',
      historyTimeToLive: 0,
      deploymentId: null,
      active: false,
      setup: {
        asyncBefore: false,
        asyncAfter: false
      },
      nodes: [],
      initialContext: {}
    };
  }

  public startEvent(): any {
    return {
      id: uuid(),
      name: 'Start',
      description: '',
      type: 'MESSAGE_CORRELATION',
      deserializeAs: 'StartEvent',
      expression: ''
    };
  }

  public endEvent(): any {
    return {
      id: uuid(),
      name: 'End',
      description: '',
      deserializeAs: 'EndEvent'
    };
  }

  public extractor(name: string): any {
    return {
      id: uuid(),
      name,
      description: '',
      queryTemplate: `${name}.sql`,
      type: 'VOYAGER'
    };
  }

  public processor(name: string): any {
    return {
      id: uuid(),
      name,
      description: '',
      deserializeAs: 'ProcessorTask',
      processor: {
        functionName: name,
        scriptType: 'JS',
        code: `${name}.js`
      },
      inputVariables: [],
      outputVariable: {
        key: 'output',
        type: 'PROCESS'
      }
    };
  }

  public references(): any {
    return {
      path: '',
      data: []
    };
  }

  public uuid(): string {
    return uuid();
  }

}

export const defaultService = new DefaultService();
