const uuid = require('uuid/v1');

import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { modExternalReferenceResolver } from './external-reference.service';
import { modDataExtractor } from './data-extractor.service';
import { fileService } from './file.service';
import { templateService } from './template.service';

class WorkflowService extends RestService implements Enhancer {

  public createTrigger(extractor: any): Promise<any> {
    return this.post(`${config.get('modWorkflow')}/triggers`, extractor);
  }

  public createTask(task: any): Promise<any> {
    return this.post(`${config.get('modWorkflow')}/tasks`, task);
  }

  public createWorkflow(workflow: any): Promise<any> {
    return this.post(`${config.get('modWorkflow')}/workflows`, workflow);
  }

  public activate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/activate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public deactivate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/deactivate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public run(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/triggers/startTrigger.json`);
      const startTrigger = JSON.parse(templateService.template(json));
      return this.post(`${config.get('modWorkflow')}/${startTrigger.pathPattern}`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public scaffold(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return Promise.reject(`cannot find workflow at ${path}`);
    }
    fileService.createDirectory(path);
    fileService.createDirectory(`${path}/extractors`);
    fileService.createDirectory(`${path}/extractors/sql`);
    fileService.createDirectory(`${path}/referenceData`);
    fileService.createDirectory(`${path}/referenceLinkTypes`);
    fileService.createDirectory(`${path}/tasks`);
    fileService.createDirectory(`${path}/tasks/js`);
    fileService.createDirectory(`${path}/triggers`);
    fileService.createFile(`${path}/triggers/startTrigger.json`, {
      id: uuid(),
      name: '',
      description: '',
      type: 'MESSAGE_CORRELATE',
      method: 'POST',
      deserializeAs: 'EventTrigger',
      pathPattern: ''
    });
    return Promise.resolve(`new workflow ${name} scaffold created`);
  }

  public build(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return [
        () => this.createReferenceData(name),
        () => this.createReferenceLinkTypes(name),
        () => this.createExtractors(name),
        () => this.createTriggers(name),
        () => this.createTasks(name),
        () => {
          const json = fileService.read(`${path}/workflow.json`);
          const workflow = templateService.template(json);
          return this.createWorkflow(JSON.parse(workflow));
        }
      ].reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public createReferenceData(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/referenceData`;
      if (fileService.exists(path)) {
        resolve({});
      } else {
        reject(`cannot find reference data at ${path}`);
      }
    });
  }

  public createReferenceLinkTypes(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceLinkTypes`;
    if (fileService.exists(path)) {
      return this.create(path, modExternalReferenceResolver, 'createReferenceLinkType');
    }
    return Promise.reject(`cannot find reference link types at ${path}`);
  }

  public createExtractors(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/extractors`;
    if (fileService.exists(path)) {
      return this.create(path, modDataExtractor, 'createExtractor');
    }
    return Promise.reject(`cannot find extractors at ${path}`);
  }

  public createTriggers(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/triggers`;
    if (fileService.exists(path)) {
      return this.create(path, modWorkflow, 'createTrigger');
    }
    return Promise.reject(`cannot find triggers at ${path}`);
  }

  public createTasks(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/tasks`;
    if (fileService.exists(path)) {
      return this.create(path, modWorkflow, 'createTask');
    }
    return Promise.reject(`cannot find tasks at ${path}`);
  }

  private create(path: string, service: any, fn: string): Promise<any> {
    const promises = fileService.readAll(path)
      .map((json: any) => service.enhance(path, json))
      .map((json: any) => templateService.template(json))
      .map((json: any) => service[fn](JSON.parse(json)));
    return Promise.all(promises);
  }

  public enhance(path: string, json: any): any {
    const obj = JSON.parse(json);
    if (obj.script) {
      if (fileService.exists(`${path}/js/${obj.script}`)) {
        const scriptJson = fileService.read(`${path}/js/${obj.script}`);
        obj.script = templateService.template(scriptJson)
          // remove all endline characters
          .replace(/(\r\n|\n|\r)/gm, '')
          // remove all extraneous double spaces
          .replace(/\s+/g, ' ')
          // replace all double quotes with single quotes
          .replace(/'/g, '\'');
      }

    }
    return JSON.stringify(obj);
  }

}

export const modWorkflow = new WorkflowService();
