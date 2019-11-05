const fs = require('fs');

import { RestService } from './rest.service';

import { config } from '../config';
import { modExternalReferenceResolver } from './external-reference.service';
import { modDataExtractor } from './data-extractor.service';
import { fileService } from './file.service';
import { templateService } from './template.service';

class WorkflowService extends RestService {

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
    if (fs.existsSync(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = templateService.template(json);
      return this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/activate`, {});
    }
    throw new Error(`cannot find workflow at ${path}`);
  }

  public deactivate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fs.existsSync(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = templateService.template(json);
      return this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/deactivate`, {});
    }
    throw new Error(`cannot find workflow at ${path}`);
  }

  public run(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fs.existsSync(path)) {
      const json = fileService.read(`${path}/triggers/startTrigger.json`);
      const startTrigger = templateService.template(json);
      return this.post(`${config.get('modWorkflow')}/${startTrigger.pathPattern}`, {});
    }
    throw new Error(`cannot find workflow at ${path}`);
  }

  public build(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fs.existsSync(path)) {
      return [
        () => this.createReferenceData(name),
        () => this.createReferenceLinkTypes(name),
        () => this.createExtractors(name),
        () => this.createTriggers(name),
        () => this.createTasks(name),
        () => {
          const json = fileService.read(`${path}/workflow.json`);
          const workflow = templateService.template(json);
          return this.createWorkflow(workflow);
        }
      ].reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
    }
    throw new Error(`cannot find workflow at ${path}`);
  }

  public createReferenceData(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/referenceData`;
      if (fs.existsSync(path)) {
        resolve({});
      } else {
        reject(`cannot find reference data at ${path}`);
      }
    });
  }

  public createReferenceLinkTypes(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceLinkTypes`;
    if (fs.existsSync(path)) {
      return this.create(path, modExternalReferenceResolver, 'createReferenceLinkType');
    }
    throw new Error(`cannot find reference link types at ${path}`);
  }

  public createExtractors(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/extractors`;
    if (fs.existsSync(path)) {
      return this.create(path, modDataExtractor, 'createExtractor');
    }
    throw new Error(`cannot find extractors at ${path}`);
  }

  public createTriggers(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/triggers`;
    if (fs.existsSync(path)) {
      return this.create(path, modWorkflow, 'createTrigger');
    }
    throw new Error(`cannot find triggers at ${path}`);
  }

  public createTasks(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/tasks`;
    if (fs.existsSync(path)) {
      return this.create(path, modWorkflow, 'createTask');
    }
    throw new Error(`cannot find tasks at ${path}`);
  }

  private create(path: string, service: any, fn: string): Promise<any> {
    const promises = fileService.readAll(path)
      .map((json: any) => templateService.template(json))
      .map((data: any) => service[fn](data));
    return Promise.all(promises);
  }

}

export const modWorkflow = new WorkflowService();
