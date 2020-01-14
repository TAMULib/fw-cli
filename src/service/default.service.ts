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
      description: '',
      deploymentId: null,
      processDefinitionIds: [],
      active: false,
      tasks: [],
      initialContext: {},
      startTrigger: ''
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
      script: `${name}.js`,
      scriptType: 'JS',
      contextInputKeys: [],
      contextOutputKey: 'output'
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
