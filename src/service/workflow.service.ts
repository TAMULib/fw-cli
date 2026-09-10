/*
  Copyright (C) 2024-2026 Texas A&M University Libraries

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const childProcess = require('node:child_process');
const process = require('node:process');

import sha256 from 'crypto-js/sha256';

import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { fileService } from './file.service';
import { templateService } from './template.service';
import { defaultService } from './default.service';

class WorkflowService extends RestService implements Enhancer {

  private gitHashVersion = false;

  /**
   * Use SHA256 in such a way that it matches what can be reproduced through manual hashing.
   *
   * This excludes all **CLI** specific variables.
   *
   * This should produce an identical hash to the command:
   *   ```sh
   *   jq --sort-keys -cM 'del(.cliAccess, .cliDirectUrl, .cliFolioLoginPath, .cliFolioPass, .cliFolioTenant, .cliFolioToken, .cliFolioUser, .cliGatewayUrl, .cliWd)' config.json | sha256sum
   *   ```
   * Where `config.json` is the configuration file.
   *
   * The trailing new line is necessary to produce a consistent valid hash in this manner.
   *
   * @return The configration hash string.
   */
  public checksum(): string {
    const toDelete = [
      'cliAccess',
      'cliDirectUrl',
      'cliFolioLoginPath',
      'cliFolioPass',
      'cliFolioTenant',
      'cliFolioUser',
      'cliGatewayUrl',
      'cliWd`'
    ];

    const json = JSON.stringify(
      Object.fromEntries(
        Object.entries(config.store)
          .filter(([key]) => !toDelete.includes(key))
          .sort(([left], [right]) => left.localeCompare(right))
      )
    ) + '\n';

    return sha256(json).toString();
  }

  public createTrigger(extractor: any): Promise<any> {
    return this.post(`${this.getAccessUrl()}/triggers`, extractor);
  }

  public createNode(node: any): Promise<any> {
    return this.post(`${this.getAccessUrl()}/nodes`, node);
  }

  public createWorkflow(workflow: any): Promise<any> {
    return this.post(`${this.getAccessUrl()}/workflows`, workflow);
  }

  public list(): string[] {
    const path = this.getWd();

    if (fileService.exists(path)) {
      return fileService.listDirectories(path);
    }

    process.exitCode = 1;

    throw new Error(`Error: Cannot find workflow directory at ${path}.`);
  }

  public scaffold(name: string): Promise<any> {
    const path = `${this.getWd()}${name}`;
    if (fileService.exists(path)) {
      process.exitCode = 2;

      return Promise.reject(`Error: Cannot find workflow at ${path}.`);
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

  public build(name: string, header: boolean = false): Promise<any> {
    const path = `${this.getWd()}${name}`;

    if (header) {
      console.log(`\nBuilding Workflow ${name}:`);
    }

    if (fileService.exists(path)) {
      const workflow = [
        () => this.setup(name),
        () => this.createTriggers(name),
        () => this.createNodes(name),
        () => this.finalize(name)
      ].reduce((chain, callback) => {
        return chain.then(() =>
          callback().then(response => {
            return response;
          })
        );
      }, Promise.resolve())
      .catch((error) => {
        process.exitCode = 2;

        return Promise.reject(error);
      });

      return workflow;
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
  }

  public activate(name: string, header: boolean = false): Promise<any> {
    const path = `${this.getWd()}${name}`;

    if (header) {
      console.log(`\nActivating Workflow ${name}:`);
    }

    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));

      return this.put(`${this.getAccessUrl()}/workflows/${workflow.id}/activate`, {});
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
  }

  public deactivate(name: string): Promise<any> {
    const path = `${this.getWd()}${name}`;

    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));

      return this.put(`${this.getAccessUrl()}/workflows/${workflow.id}/deactivate`, {});
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
  }

  public deploy(name: string): Promise<any> {
    const service = this;

    return service.build(name, true)?.then((result) => {
      // Ensure the build response is printed.
      if (result) console.log(result);

      return service.activate(name, true);
    });
  }

  public history(name: string): Promise<any> {
    const path = `${this.getWd()}${name}`;

    console.log(`\nFetching History for Workflow ${name}:`);

    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));

      return this.get(`${this.getAccessUrl()}/workflows/${workflow.id}/history`);
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
  }

  public redeploy(name: string): Promise<any> {
    const service = this;

    const buildActivate = () => {
      return service.build(name, true)?.then((result) => {
        // Ensure the build response is printed.
        if (result) console.log(result);

        return service.activate(name, true);
      });
    }

    return service.deleteWorkflow(name, true)?.then((result) => {
      // Ensure the delete response is printed.
      if (result) console.log(result);

      return buildActivate();
    }).catch(error => {
      if (error?.http?.code === 404) {
        console.log(error);
        console.log(`\nWorkflow ${name} does not exist, continuing on.`);

        // Reset the console error to avoid incorrectly return with error code on success.
        process.exitCode = 0;

        return buildActivate();
      }

      return Promise.reject(error);
    });
  }

  public deleteWorkflow(name: string, header: boolean = false): Promise<any> {
    const path = `${this.getWd()}${name}`;

    if (header) {
      console.log(`\nDeleting Workflow ${name}:`);
    }

    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));

      return this.delete(`${this.getAccessUrl()}/workflows/${workflow.id}/delete`);
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
  }

  public run(name: string): Promise<any> {
    const path = `${this.getWd()}${name}`;

    if (fileService.exists(path)) {
      const json = fileService.read(`${path}/workflow.json`);
      const workflow = JSON.parse(templateService.template(json));

      return this.post(`${this.getAccessUrl()}/workflows/${workflow.id}/start`, {});
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow at ${path}.`);
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

  public enableGitHash() {
    this.gitHashVersion = true;
  }

  public getGitHash() {
    const data = config?.store;
    const cliWd = data?.cliWd;

    if (!cliWd) return false;

    const command = 'git rev-parse --short=12 HEAD';
    const options = { 'cwd': cliWd, encoding: 'utf8' };

    return childProcess.execSync(command, options)?.trimEnd();
  }

  /**
   * Get the CLI working directory.
   *
   * This ensures a trailing slash always exists.
   *
   * @return The working directory with a trailing slash.
   */
  public getWd(): string {
    let wd = config.get('cliWd');

    if (typeof wd !== 'string') {
      wd = '';
    }

    if (wd === '') return './';

    return wd.replace(/\/*$/, '/');
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
    const path = `${this.getWd()}${name}/setup.json`;

    if (fileService.exists(path)) {
      const setup = JSON.parse(fileService.read(path));

      // nothing to do here
      return Promise.resolve(setup);
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find setup.json at ${path}.`);
  }

  private createTriggers(name: string): Promise<any> {
    const path = `${this.getWd()}${name}/triggers`;

    if (fileService.exists(path)) {
      return fileService.readAll(path, '.json')
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json))
        .map((data: any) => () => modWorkflow.createTrigger(data))
        .reduce((chain, callback) => {
          return chain.then(() =>
            callback().then(response => {
              return response;
            })
          );
        }, Promise.resolve())
        .catch((error) => {
          process.exitCode = 2;

          return Promise.reject(error);
        });
    }

    return Promise.resolve([]);
  }

  private createNodes(name: string): Promise<any> {
    const path = `${this.getWd()}${name}/nodes`;

    if (fileService.exists(path)) {
      const nodes = fileService.readAll(path, '.json')
        .map((json: any) => modWorkflow.enhance(path, json))
        .map((json: any) => templateService.template(json))
        .map((json: any) => JSON.parse(json));

      return this.sort(nodes)
        .map((data: any) => () => modWorkflow.createNode(data))
        .reduce((chain, callback) => {
          return chain.then(() =>
            callback().then(response => {
              return response;
            })
          );
        }, Promise.resolve())
        .catch((error) => {
          process.exitCode = 2;

          return Promise.reject(error);
        });
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find nodes at ${path}.`);
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
    const path = `${this.getWd()}${name}/workflow.json`;

    if (fileService.exists(path)) {
      const json = fileService.read(path);
      const workflow = templateService.template(json);
      const parsed = JSON.parse(workflow);

      parsed.checksum = modWorkflow.checksum();

      if (this.gitHashVersion) {
        const suffix = this.getGitHash();

        if (suffix) {
          parsed.versionTag += `-${suffix}`;
        } else {
          throw new Error('Git hash command returned no results in working directory (cliWd) path.');
        }
      }

      return this.createWorkflow(parsed);
    }

    process.exitCode = 2;

    return Promise.reject(`Error: Cannot find workflow.json at ${path}.`);
  }

  private getAccessUrl(): string {
    const access = config.get('cliAccess');

    if (access === 'direct') {
      return config.get('cliDirectUrl');
    }

    return config.get('cliGatewayUrl');
  }

}

export const modWorkflow = new WorkflowService();
