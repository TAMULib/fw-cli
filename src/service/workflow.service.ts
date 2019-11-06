const uuid = require('uuid/v1');

import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { modExternalReferenceResolver } from './external-reference.service';
import { modDataExtractor } from './data-extractor.service';
import { fileService } from './file.service';
import { templateService } from './template.service';
import { okapi } from './okapi.service';

class WorkflowService extends RestService implements Enhancer {

  public createTrigger(extractor: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/triggers`, extractor);
  }

  public createTask(task: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/tasks`, task);
  }

  public createWorkflow(workflow: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/workflows`, workflow);
  }

  public list(): Promise<any> {
    const path = `${config.get('wd')}`;
    if (fileService.exists(path)) {
      return Promise.resolve(fileService.list(path));
    }
    return Promise.reject(`cannot find workflow directory at ${path}`);
  }

  public scaffold(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return Promise.reject(`cannot find workflow at ${path}`);
    }
    fileService.createDirectory(path);
    fileService.createDirectory(`${path}/extractors`);
    fileService.createFile(`${path}/extractors/.gitkeep`);
    fileService.createDirectory(`${path}/extractors/sql`);
    fileService.createFile(`${path}/extractors/sql/.gitkeep`);
    fileService.createDirectory(`${path}/referenceData`);
    fileService.createFile(`${path}/referenceData/.gitkeep`);
    fileService.createDirectory(`${path}/referenceLinkTypes`);
    fileService.createFile(`${path}/referenceLinkTypes/.gitkeep`);
    fileService.createDirectory(`${path}/tasks`);
    fileService.createFile(`${path}/tasks/.gitkeep`);
    fileService.createDirectory(`${path}/tasks/js`);
    fileService.createFile(`${path}/tasks/js/.gitkeep`);
    fileService.createDirectory(`${path}/triggers`);
    fileService.createFile(`${path}/triggers/.gitkeep`);
    fileService.createFile(`${path}/triggers/startTrigger.json`, {
      id: uuid(),
      name: '',
      description: '',
      type: 'MESSAGE_CORRELATE',
      method: 'POST',
      deserializeAs: 'EventTrigger',
      pathPattern: ''
    });
    fileService.createFile(`${path}/workflow.json`, {
      id: uuid(),
      name: '',
      processDefinitionIds: [],
      active: false,
      tasks: [],
      startTrigger: ''
    });
    fileService.createFile(`${path}/setup.json`, {
      lookups: []
    });
    return Promise.resolve(`new workflow ${name} scaffold created`);
  }

  public build(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return [
        () => this.setup(name),
        () => this.createReferenceData(name),
        () => this.createReferenceLinkTypes(name),
        () => this.createExtractors(name),
        () => this.createTriggers(name),
        () => this.createTasks(name),
        () => this.finalize(name)
      ].reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public activate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.put(`${config.get('mod-workflow')}/workflows/${workflow.id}/activate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public deactivate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.put(`${config.get('mod-workflow')}/workflows/${workflow.id}/deactivate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public run(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/triggers/startTrigger.json`);
      const startTrigger = JSON.parse(templateService.template(json));
      return this.post(`${config.get('mod-workflow')}/${startTrigger.pathPattern}`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public enhance(path: string, json: any): any {
    const obj = JSON.parse(json);
    if (obj.script) {
      if (fileService.exists(`${path}/js/${obj.script}`)) {
        const scriptJson = fileService.read(`${path}/js/${obj.script}`).trim();
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

  private setup(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/setup.json`;
    if (fileService.exists(path)) {
      const setup = JSON.parse(fileService.read(path));
      const lookups = setup.lookups ? setup.lookups : [];
      return Promise.all(lookups.map((module: string) => {
        const promise = okapi.getDiscoveryModuleURL(module);
        promise.then((u: string) => {
          if (config.get('useLocalhost')) {
            const url = new URL(u);
            return config.set(module, `http://localhost:${url.port}`);
          }
          return module;
        }, console.log);
        return promise;
      }));
    }
    return Promise.reject(`cannot find setup.json at ${path}`);
  }

  private createReferenceData(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceData`;
    if (fileService.exists(path)) {
      return [
        () => okapi.login(),
        () => Promise.all(fileService.readAll(path)
          .map((json: any) => templateService.template(json))
          .map((json: any) => JSON.parse(json))
          .map((data: any) => okapi.createReferenceData(data)))
      ].reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find reference data at ${path}`);
  }

  private createReferenceLinkTypes(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/referenceLinkTypes`;
    if (fileService.exists(path)) {
      return Promise.all(fileService.readAll(path)
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => modExternalReferenceResolver.createReferenceLinkType(data)));
    }
    return Promise.reject(`cannot find reference link types at ${path}`);
  }

  private createExtractors(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/extractors`;
    if (fileService.exists(path)) {
      return Promise.all(fileService.readAll(path)
        .map((json: any) => modDataExtractor.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => modDataExtractor.createExtractor(data)));
    }
    return Promise.reject(`cannot find extractors at ${path}`);
  }

  private createTriggers(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/triggers`;
    if (fileService.exists(path)) {
      return Promise.all(fileService.readAll(path)
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => modWorkflow.createTrigger(data)));
    }
    return Promise.reject(`cannot find triggers at ${path}`);
  }

  private createTasks(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/tasks`;
    if (fileService.exists(path)) {
      return Promise.all(fileService.readAll(path)
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => modWorkflow.createTask(data)));
    }
    return Promise.reject(`cannot find tasks at ${path}`);
  }

  private finalize(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/workflow.json`;
    if (fileService.exists(path)) {
      const json = fileService.read(path);
      const workflow = templateService.template(json);
      return this.createWorkflow(JSON.parse(workflow));
    }
    return Promise.reject(`cannot find workflow.json at ${path}`);
  }

}

export const modWorkflow = new WorkflowService();
