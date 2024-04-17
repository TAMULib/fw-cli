#!/usr/bin/env node

const pkg = require('../package.json');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

import { okapi } from './service/okapi.service';
import { config } from './config';
import { modWorkflow } from './service/workflow.service';
import { fileService } from './service/file.service';
import { defaultService } from './service/default.service';
import { exit } from 'process';

const CONF_DIR = 'configs';

if (!fileService.exists(CONF_DIR)) {
  fileService.createDirectory(CONF_DIR);
}

program
  .version(pkg.version)
  .usage('[options]')
  .allowUnknownOption(false)
  .option('-c, --config', 'show current configuration', () => {
    console.log(JSON.stringify(config.store, null, 2));
    exit();
  })
  .option('-w, --workflows', 'list workflows', () => {
    for (const workflow of modWorkflow.list()) {
      console.log(` - ${workflow}`);
    }
    exit();
  })
  .description('A CLI for building and running FOLIO workflows');

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
    config.delete('folioAccessToken');
    config.delete('folioRefreshToken');
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
  .description('add new processor with name to an existing workflow')
  .action((workflow: string, type: 'processor', name: string) => {
    const workflowPath = `${config.get('wd')}/${workflow}`;
    if (fileService.exists(workflowPath)) {
      switch (type) {
        case 'processor':
          fileService.createFile(`${workflowPath}/nodes/${name}.json`, defaultService.processor(name));
          fileService.createFile(`${workflowPath}/nodes/js/${name}.js`);
          console.log(`new ${name} ${type} added to ${workflow}`);
          break;
        default:
          console.log(`${type} not supported. <processor>`);
          break;
      }
    } else {
      console.log(`${workflow} workflow does not exist`);
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
  .command('delete <name>')
  .description('delete workflow by name')
  .action((name: string) => {
    modWorkflow.deleteWorkflow(name).then(console.log, console.log);
  });

program
  .command('run <name>')
  .description('run workflow by name')
  .action((name: string) => {
    modWorkflow.run(name).then(console.log, console.log);
  });

program
  .command('uuid [count]')
  .description('generate random UUIDs')
  .action((count = 1) => {
    while(count--) {
      console.log(defaultService.uuid());
    }
  });

if (process.argv.length === 2) {
  clear();
  console.log(chalk.red(figlet.textSync('folio-workflow-cli', { horizontalLayout: 'full' })));
}

program
  .parse(process.argv);
