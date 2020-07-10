import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { modDataExtractor } from './data-extractor.service';
import { fileService } from './file.service';
import { templateService } from './template.service';
import { defaultService } from './default.service';
import { referenceData } from './reference-data.service';
import { referenceLinks } from './reference-links.service';

class WorkflowService extends RestService implements Enhancer {

  public createTrigger(extractor: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/triggers`, extractor);
  }

  public createNode(node: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/nodes`, node);
  }

  public createWorkflow(workflow: any): Promise<any> {
    return this.post(`${config.get('mod-workflow')}/workflows`, workflow);
  }

  public list(): Promise<any> {
    const path = `${config.get('wd')}`;
    if (fileService.exists(path)) {
      return Promise.resolve(fileService.listDirectories(path));
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
    fileService.createDirectory(`${path}/nodes`);
    fileService.createFile(`${path}/nodes/.gitkeep`);
    fileService.createDirectory(`${path}/nodes/js`);
    fileService.createFile(`${path}/nodes/js/.gitkeep`);
    fileService.createFile(`${path}/nodes/start.json`, defaultService.startEvent());
    fileService.createFile(`${path}/nodes/end.json`, defaultService.endEvent());
    fileService.createDirectory(`${path}/triggers`);
    fileService.createFile(`${path}/triggers/.gitkeep`);
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
        () => referenceData.createReferenceData(name),
        () => referenceLinks.createReferenceLinkTypes(name),
        () => this.createExtractors(name),
        () => this.createTriggers(name),
        () => this.createNodes(name),
        () => this.finalize(name)
      ].reduce((prevPromise, process) => prevPromise.then(() => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find workflow at ${path}`);
  }

  public isActive(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}`;
      if (fileService.exists(path)) {
        const json = fileService.read(`${path}/workflow.json`);
        const workflow = JSON.parse(templateService.template(json));
        this.get(`${config.get('mod-workflow')}/workflows/${workflow.id}`).then((response: any) => {
          resolve(response.active);
        }, reject);
      } else {
        reject(`cannot find workflow at ${path}`);
      }
    });
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
    if (fileService.exists(`${path}/js/${obj[prop]}`)) {
      const script = fileService.read(`${path}/js/${obj[prop]}`).trim();
      obj[prop] = templateService.template(script)
        // remove all endline characters
        .replace(/(\r\n|\n|\r)/gm, '')
        // remove all extraneous double spaces
        .replace(/\s\s+/g, ' ')
        // replace all double quotes with single quotes
        .replace(/"/g, '\'');
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

  private createExtractors(name: string): Promise<any> {
    const path = `${config.get('wd')}/${name}/extractors`;
    if (fileService.exists(path)) {
      return fileService.readAll(path, '.json')
        .map((json: any) => modDataExtractor.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => () => modDataExtractor.createExtractor(data))
        .reduce((prevPromise, process) => prevPromise.then(() => process(), () => process()), Promise.resolve());
    }
    return Promise.reject(`cannot find extractors at ${path}`);
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
    return Promise.reject(`cannot find triggers at ${path}`);
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

}

export const modWorkflow = new WorkflowService();
