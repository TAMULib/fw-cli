#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

import { okapi } from './service/okapi.service';
import { config } from './config';
import { modWorkflow } from './service/workflow.service';

program
  .version('0.0.1')
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
  .command('config <action> <property> [value]')
  .description('get/set/delete config value')
  .action((action: 'get' | 'set' | 'delete', property: string, value?: string) => {
    switch (action) {
      case 'get':
        console.log(config.get(property));
        break;
      case 'set':
        if (value) {
          config.set(property, value);
          console.log(`set ${property} to ${value}`);
        } else {
          console.log('set requires a value');
        }
        break;
      case 'delete':
        config.delete(property);
        console.log(`deleted ${property}`);
        break;
      default:
        console.log(`${action} not a valid action. <get/set/delete>`);
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
