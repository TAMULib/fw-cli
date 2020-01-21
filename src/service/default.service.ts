const uuid = require('uuid/v1');

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
      versionTag: '1.0',
      historyTimeToLive: 0,
      description: '',
      deploymentId: null,
      active: false,
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
      expression: '',
      interrupting: false,
      asyncBefore: true
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

}

export const defaultService = new DefaultService();
