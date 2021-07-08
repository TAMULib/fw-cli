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
