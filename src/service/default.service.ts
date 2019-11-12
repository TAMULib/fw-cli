const uuid = require('uuid/v1');

class DefaultService {

  public trigger(name: string): any {
    return {
      id: uuid(),
      name,
      description: '',
      type: 'MESSAGE_CORRELATE',
      method: 'POST',
      deserializeAs: 'EventTrigger',
      pathPattern: `/events/${name}/workflow`
    };
  }

  public workflow(name: string): any {
    return {
      id: uuid(),
      name,
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
