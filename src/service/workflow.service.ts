import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { fileService } from './file.service';
import { templateService } from './template.service';
import { defaultService } from './default.service';

class WorkflowService extends RestService implements Enhancer {

  public createTrigger(extractor: any): Promise<any> {
    return this.post(`${this.getAccess()}/triggers`, extractor);
  }

  public createNode(node: any): Promise<any> {
    return this.post(`${this.getAccess()}/nodes`, node);
  }

  public createWorkflow(workflow: any): Promise<any> {
    return this.post(`${this.getAccess()}/workflows`, workflow);
  }

  public list(): string[] {
    const path = `${config.get('wd')}`;
    if (fileService.exists(path)) {
      return fileService.listDirectories(path);
    }
    throw new Error(`cannot find workflow directory at  ${path}`);
  }

  public scaffold(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return Promise.reject(`cannot find workflow at ${path}`);
    }
    fileService.createDirectory(path);
    fileService.createDirectory(`${path}/nodes`);
    fileService.createDirectory(`${path}/nodes/js`);
    fileService.createFile(`${path}/nodes/start.json`, defaultService.startEvent());
    fileService.createFile(`${path}/nodes/end.json`, defaultService.endEvent());
    fileService.createDirectory(`${path}/triggers`);
    fileService.createFile(`${path}/triggers/startTrigger.json`, defaultService.trigger());
    fileService.createFile(`${path}/workflow.json`, defaultService.workflow());
    fileService.createFile(`${path}/setup.json`, {});
    return Promise.resolve(`new workflow ${name} scaffold created`);
  }

  public build(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      return [
        () => this.setup(name),
        () => this.createTriggers(name),
        () => this.createNodes(name),
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
      return this.put(`${this.getAccess()}/workflows/${workflow.id}/activate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public deactivate(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.put(`${this.getAccess()}/workflows/${workflow.id}/deactivate`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public deleteWorkflow(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.delete(`${this.getAccess()}/workflows/${workflow.id}/delete`);
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public run(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}`;
    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));
      return this.post(`${this.getAccess()}/workflows/${workflow.id}/start`, {});
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public enhance(path: string, json: any): any {
    const obj = JSON.parse(json);
    if (obj.deserializeAs === 'ScriptTask') {
      this.script(path, obj, 'code');
    }
    if (obj.deserializeAs === 'ProcessorTask' && obj.processor) {
      this.script(path, obj.processor, 'code');
    }
    if (obj.deserializeAs === 'StreamingExtractTransformLoadTask' && obj.processors) {
      for (const processor of obj.processors) {
        this.script(path, processor, 'code');
      }
    }
    return JSON.stringify(obj);
  }

  private script(path: string, obj: any, prop: string): void {
    if (!!obj && !!obj.scriptFormat && typeof obj.scriptFormat === 'string') {
      let extension;

      if (obj.scriptFormat.toLowerCase() === 'javascript') {
        extension = 'js';
      } else if (obj.scriptFormat.toLowerCase() === 'python') {
        extension = 'py';
      } else if (obj.scriptFormat.toLowerCase() === 'ruby') {
        extension = 'rb';
      } else {
        // Fallback to using the lower case script format itself as the directory name.
        extension = obj.scriptFormat.toLowerCase().trim();
      }

      if (!!extension) {
        const scriptPath = `${path}/${extension}/${obj[prop]}`;

        if (fileService.exists(scriptPath)) {
          const script = fileService.read(scriptPath).trim();
          obj[prop] = JSON.stringify(templateService.template(script));
        }
      }
    }
  }

  private setup(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/setup.json`;
    if (fileService.exists(path)) {
      const setup = JSON.parse(fileService.read(path));
      // nothing to do here
      return Promise.resolve(setup);
    }
    return Promise.reject(`cannot find setup.json at ${path}`);
  }

  private createTriggers(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/triggers`;
    if (fileService.exists(path)) {
      return fileService.readAll(path, '.json')
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => () => modWorkflow.createTrigger(data))
        .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.resolve([]);
  }

  private createNodes(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/nodes`;
    if (fileService.exists(path)) {
      const nodes = fileService.readAll(path, '.json')
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json));
      return this.sort(nodes)
        .map((data: any) => () => modWorkflow.createNode(data))
        .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find nodes at ${path}`);
  }

  private sort(nodes: any[]): any[] {
    const sorted: any[] = [];
    let i = 0;
    while (nodes.length) {
      if (i >= nodes.length) {
        i = 0;
      }
      const node = nodes[i];
      if (node.nodes && node.nodes.length) {
        if (node.nodes.filter((url: string) => {
          return sorted.filter((sn) => {
            return url.endsWith(sn.id);
          }).length > 0;
        }).length === node.nodes.length) {
          sorted.push(nodes.splice(i, 1)[0]);
        }
      } else {
        sorted.push(nodes.splice(i, 1)[0]);
      }
      i++;
    }
    return sorted;
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

  private getAccess(): string {
    const access = config.get('access');
    return config.get(access);
  }

}

export const modWorkflow = new WorkflowService();
