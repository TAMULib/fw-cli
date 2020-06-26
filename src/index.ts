#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

import { okapi } from './service/okapi.service';
import { config } from './config';
import { modWorkflow } from './service/workflow.service';
import { fileService } from './service/file.service';
import { defaultService } from './service/default.service';
import { referenceData } from './service/reference-data.service';
import { referenceLinks } from './service/reference-links.service';
import { pathToFileURL } from 'url';
import { mappingRules } from './service/mapping-rules.service';

const CONF_DIR = 'configs';

if (!fileService.exists(CONF_DIR)) {
  fileService.createDirectory(CONF_DIR);
}

program
  .version('0.0.2')
  .usage('[options]')
  .option('-c, --config', 'show current configuration', () => {
    console.log(JSON.stringify(config.store, null, 2));
  })
  .option('-w, --workflows', 'list workflows', () => {
    modWorkflow.list().then((workflows: string[]) => {
      for (const workflow of workflows) {
        modWorkflow.isActive(workflow).then((isActive: boolean) => {
          console.log(` - ${workflow} ${isActive ? 'ACTIVE' : ''}`);
        }, () => console.log(` - ${workflow}`));
      }
    }, console.log);
  })
  .description('A CLI for building and running FOLIO migration workflows');

program
  .command('config <action> [property/name] [value]')
  .description('get/set/delete/reset/save/load config value or reset all config to defaults')
  .action((action: 'get' | 'set' | 'delete' | 'reset' | 'save' | 'load', property?: string, value?: string) => {
    switch (action) {
      case 'get':
        if (property) {
          console.log(config.get(property));
        } else {
          console.log('get requires a property');
        }
        break;
      case 'set':
        if (property) {
          if (value) {
            try {
              config.set(property, value);
            } catch (error) {
              config.set(property, Number(value));
            }
            console.log(`set ${property} to ${value}`);
          } else {
            console.log('set requires a value');
          }
        } else {
          console.log('set requires a property');
        }
        break;
      case 'reset':
        if (property) {
          config.reset(property);
          console.log(`reset ${property} to ${config.get(property)}`);
        } else {
          config.clear();
          console.log('reset config to default');
          console.log(JSON.stringify(config.store, null, 2));
        }
        break;
      case 'delete':
        if (property) {
          config.delete(property);
          console.log(`deleted ${property}`);
        } else {
          console.log('delete reset a property');
        }
        break;
      case 'save':
        if (property) {
          const path = `${CONF_DIR}/${property}.conf`;
          fileService.save(path, config.store);
          console.log(`stored the following config to ${path}`);
          console.log(JSON.stringify(config.store, null, 2));
        } else {
          console.log('config save requires name for the stored config');
        }
        break;
      case 'load':
        if (property) {
          const path = `${CONF_DIR}/${property}.conf`;
          const conf = JSON.parse(fileService.read(path));
          config.set(conf);
          console.log(`loaded config from ${path}`);
          console.log(JSON.stringify(config.store, null, 2));
        } else {
          console.log('config load requires name for the stored config');
        }
        break;
      default:
        console.log(`${action} not a valid action. <get/set/delete/reset>`);
    }
  });

program
  .command('login [username] [password]')
  .description('login to acquire token')
  .action((username?: string, password?: string) => {
    okapi.login(username, password).then(console.log, console.log);
  });

program
  .command('logout')
  .description('logout to remove token from config')
  .action(() => {
    config.delete('token');
    console.log('success');
  });

program
  .command('user [username]')
  .description('lookup user')
  .action((username?: string) => {
    okapi.getUser(username).then(console.log, console.log);
  });

program
  .command('lookup <module>')
  .description('lookup module, matching name starting with')
  .action((name: string) => {
    okapi.getDiscoveryModuleURL(name).then(console.log, console.log);
  });

program
  .command('new <name>')
  .description('scaffold new workflow with name')
  .action((name: string) => {
    modWorkflow.scaffold(name).then(console.log, console.log);
  });

program
  .command('add <workflow> <type> <name>')
  .description('add new extractor/processor/references with name to an existing workflow')
  .action((workflow: string, type: 'extractor' | 'processor' | 'references', name: string) => {
    const workflowPath = `${config.get('wd')}/${workflow}`;
    if (fileService.exists(workflowPath)) {
      switch (type) {
        case 'extractor':
          fileService.createFile(`${workflowPath}/extractors/${name}.json`, defaultService.extractor(name));
          fileService.createFile(`${workflowPath}/extractors/sql/${name}.sql`);
          console.log(`new ${name} ${type} added to ${workflow}`);
          break;
        case 'processor':
          fileService.createFile(`${workflowPath}/nodes/${name}.json`, defaultService.processor(name));
          fileService.createFile(`${workflowPath}/nodes/js/${name}.js`);
          console.log(`new ${name} ${type} added to ${workflow}`);
          break;
        case 'references':
          fileService.createFile(`${workflowPath}/referenceData/${name}.json`, defaultService.references());
          console.log(`new ${name} ${type} added to ${workflow}`);
          break;
        default:
          console.log(`${type} not supported. <extractor/processor>`);
          break;
      }
    } else {
      console.log(`${workflow} workflow does not exist`);
    }
  });

program
  .command('load <workflow> <type>')
  .description('load reference data/links for an existing workflow')
  .action((workflow: string, type: 'data' | 'links') => {
    console.log(`load reference ${type} for ${workflow}`);
    const workflowPath = `${config.get('wd')}/${workflow}`;
    if (fileService.exists(workflowPath)) {
      switch (type) {
        case 'data':
          referenceData.createReferenceData(workflow).then(() => {
            console.log(`reference ${type} loaded for ${workflow}`);
          });
          break;
        case 'links':
          referenceLinks.createReferenceLinkTypes(workflow).then(() => {
            console.log(`reference ${type} loaded for ${workflow}`);
          });
          break;
        default:
          console.log(`reference ${type} not supported. <data/links>`);
          return;
      }
    } else {
      console.log(`${workflow} workflow does not exist`);
    }
  });

program
  .command('rules <type> [path]')
  .description('update mapping rules for instances with optional path')
  .action((type: 'instances', path: string) => {
    const file = path === undefined ? `${config.get('wd')}/instance_mapping_rules.json` : path;
    console.log(`update ${type} mapping rules ${file}`);
    if (fileService.exists(file)) {
      switch (type) {
        case 'instances':
          mappingRules.update(file).then(() => {
            console.log(`${type} rules updated from ${file}`);
          });
          break;
        default:
          console.log(`${type} rules not supported. <instances>`);
          return;
      }
    } else {
      console.log(`${file} does not exist`);
    }
  });

program
  .command('build <name>')
  .description('build workflow by name')
  .action((name: string) => {
    modWorkflow.build(name).then(console.log, console.log);
  });

program
  .command('activate <name>')
  .description('activate workflow by name')
  .action((name: string) => {
    modWorkflow.activate(name).then(console.log, console.log);
  });

program
  .command('deactivate <name>')
  .description('deactivate workflow by name')
  .action((name: string) => {
    modWorkflow.deactivate(name).then(console.log, console.log);
  });

program
  .command('run <name>')
  .description('run workflow by name')
  .action((name: string) => {
    modWorkflow.run(name).then(console.log, console.log);
  });

program
  .parse(process.argv);

if (process.argv.length === 2) {
  clear();
  console.log(chalk.red(figlet.textSync('folio-migration-cli', { horizontalLayout: 'full' })));
  program.outputHelp();
}
