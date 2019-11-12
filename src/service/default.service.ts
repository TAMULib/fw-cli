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
      deploymentId: null,
      processDefinitionIds: [],
      active: false,
      tasks: [],
      startTrigger: ''
    };
  }

  public extractor(name: string): any {
    return {
      id: uuid(),
      name,
      query: `${name}.sql`,
      type: 'VOYAGER'
    };
  }

  public processor(name: string): any {
    return {
      id: uuid(),
      name,
      delegate: 'streamingProcessDelegate',
      deserializeAs: 'ProcessorTask',
      streaming: false,
      script: `${name}.js`,
      scriptType: 'JS'
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
