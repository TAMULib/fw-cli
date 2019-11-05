const fs = require('fs');
const handlebars = require('handlebars');

import { config } from "../config";
import { modExternalReferenceResolver } from "./external-reference.service";
import { modDataExtractor } from "./data-extractor.service";

import { RestService } from './rest.service';

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
    return new Promise((resolve, reject) => {

      const path = `${config.get('wd')}/${name}`;
      if (fs.existsSync(path)) {

        const path = `${config.get('wd')}/${name}/workflow.json`;
        if (fs.existsSync(path)) {
          fs.readFile(`${path}`, "utf8", (err: any, workflowJson: string) => {
            var template = handlebars.compile(workflowJson);
            const data = JSON.parse(JSON.stringify(config.store));
            const workflow = JSON.parse(template(data));

            this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/activate`, {}).then((workflow: any) => {
              resolve(workflow);
            }, (err: any) => {
              reject(err);
            });

          });
        } else {
          reject(`cannot find workflow at ${path}`);
        }

      } else {
        reject(`cannot find workflow at ${path}`);
      }

    });
  }

  public deactivate(name: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const path = `${config.get('wd')}/${name}`;
      if (fs.existsSync(path)) {

        const path = `${config.get('wd')}/${name}/workflow.json`;
        if (fs.existsSync(path)) {
          fs.readFile(`${path}`, "utf8", (err: any, workflowJson: string) => {
            var template = handlebars.compile(workflowJson);
            const data = JSON.parse(JSON.stringify(config.store));
            const workflow = JSON.parse(template(data));

            this.put(`${config.get('modWorkflow')}/workflows/${workflow.id}/deactivate`, {}).then((workflow: any) => {
              resolve(workflow);
            }, (err: any) => {
              reject(err);
            });

          });
        } else {
          reject(`cannot find workflow at ${path}`);
        }

      } else {
        reject(`cannot find workflow at ${path}`);
      }

    });
  }

  public run(name: string): Promise<any> {
    return new Promise((resolve, reject) => {

      const path = `${config.get('wd')}/${name}`;
      if (fs.existsSync(path)) {

        const path = `${config.get('wd')}/${name}/triggers/startTrigger.json`;
        if (fs.existsSync(path)) {
          fs.readFile(`${path}`, "utf8", (err: any, startTriggerJson: string) => {
            var template = handlebars.compile(startTriggerJson);
            const data = JSON.parse(JSON.stringify(config.store));
            const startTrigger = JSON.parse(template(data));

            this.post(`${config.get('modWorkflow')}/${startTrigger.pathPattern}`, {}).then((response: any) => {
              resolve(response);
            }, (err: any) => {
              reject(err);
            });

          });
        } else {
          reject(`cannot find workflow at ${path}`);
        }

      } else {
        reject(`cannot find workflow at ${path}`);
      }

    });
  }


  public build(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}`;
      if (fs.existsSync(path)) {

        this.createReferenceData(name);
        this.createReferenceLinkTypes(name);
        this.createExtractors(name);
        this.createTriggers(name);
        this.createTasks(name);

        const path = `${config.get('wd')}/${name}/workflow.json`;
        if (fs.existsSync(path)) {
          fs.readFile(`${path}`, "utf8", (err: any, workflowJson: string) => {
            var template = handlebars.compile(workflowJson);
            const data = JSON.parse(JSON.stringify(config.store));
            const workflow = JSON.parse(template(data));
            this.createWorkflow(workflow);
          });
        } else {
          reject(`cannot find workflow at ${path}`);
        }

      } else {
        reject(`cannot find workflow at ${path}`);
      }
    });
  }

  public createReferenceData(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/referenceData`;
      if (fs.existsSync(path)) {

        fs.readdir(path, function (err: any, files: string[]) {
          for (const file of files) {

          }
        });

      } else {
        reject(`cannot find reference data at ${path}`);
      }
    });
  }

  public createReferenceLinkTypes(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/referenceLinkTypes`;
      if (fs.existsSync(path)) {
        fs.readdir(path, (err: any, files: string[]) => {
          for (const file of files) {
            fs.readFile(`${path}/${file}`, "utf8", (err: any, referenceLinkTypeJson: string) => {
              var template = handlebars.compile(referenceLinkTypeJson);
              const data = JSON.parse(JSON.stringify(config.store));
              const referenceLinkType = JSON.parse(template(data));
              modExternalReferenceResolver.createReferenceLinkType(referenceLinkType);
            });
          }
        });
      } else {
        reject(`cannot find reference link types at ${path}`);
      }
    });
  }

  public createExtractors(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/extractors`;
      if (fs.existsSync(path)) {
        fs.readdir(path, (err: any, files: string[]) => {
          for (const file of files) {
            fs.readFile(`${path}/${file}`, "utf8", (err: any, extractorJson: string) => {
              var template = handlebars.compile(extractorJson);
              const data = JSON.parse(JSON.stringify(config.store));
              const extractor = JSON.parse(template(data));
              modDataExtractor.createExtractor(extractor);
            });
          }
        });
      } else {
        reject(`cannot find extractors at ${path}`);
      }
    });
  }

  public createTriggers(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/triggers`;
      if (fs.existsSync(path)) {
        fs.readdir(path, (err: any, files: string[]) => {
          for (const file of files) {
            fs.readFile(`${path}/${file}`, "utf8", (err: any, triggerJson: string) => {
              var template = handlebars.compile(triggerJson);
              const data = JSON.parse(JSON.stringify(config.store));
              const trigger = JSON.parse(template(data));
              this.createTrigger(trigger);
            });
          }
        });
      } else {
        reject(`cannot find triggers at ${path}`);
      }
    });
  }

  public createTasks(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const path = `${config.get('wd')}/${name}/tasks`;
      if (fs.existsSync(path)) {
        fs.readdir(path, (err: any, files: string[]) => {
          for (const file of files) {
            fs.readFile(`${path}/${file}`, "utf8", (err: any, taskJson: string) => {
              var template = handlebars.compile(taskJson);
              const data = JSON.parse(JSON.stringify(config.store));
              const task = JSON.parse(template(data));
              this.createTask(task);
            });
          }
        });
      } else {
        reject(`cannot find tasks at ${path}`);
      }
    });
  }

}

export const modWorkflow = new WorkflowService();