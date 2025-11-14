#!/usr/bin/env node

/*
  Copyright (C) 2024-2025 Texas A&M University Libraries

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

const pkg = require('../package.json');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const process = require('node:process');
const program = require('commander');

import { okapi } from './service/okapi.service';
import { config } from './config';
import { modWorkflow } from './service/workflow.service';
import { fileService } from './service/file.service';
import { defaultService } from './service/default.service';

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
    process.exit();
  })
  .option('-w, --workflows', 'list workflows', () => {
    for (const workflow of modWorkflow.list()) {
      console.log(` - ${workflow}`);
    }
    process.exit();
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
          console.error('Error: The get command requires a property.');

          process.exit(1);
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
            console.error('Error: The set command requires a value.');

            process.exit(1);
          }
        } else {
          console.error('Error: The set command requires a property.');

          process.exit(1);
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
        console.log(`Error: ${action} not a valid action <get/set/delete/reset>.`);

        process.exit(1);
    }
  });

program
  .command('login [username] [password]')
  .description('Login to acquire authentication tokens.')
  .action((username?: string, password?: string) => {
    okapi.login(username, password).then(console.log, console.log);
  });

program
  .command('logout')
  .description('Logout to remove authentication tokens.')
  .action(() => {
    config.delete('token');
    config.delete('accessToken');
    config.delete('refreshToken');
    console.log('success');
  });

program
  .command('user [username]')
  .description('Lookup user.')
  .action((username?: string) => {
    okapi.getUser(username).then(console.log, console.log);
  });

program
  .command('lookup <module>')
  .description('Lookup module, matching name starting with.')
  .action((name: string) => {
    okapi.getDiscoveryModuleURL(name).then(console.log, console.log);
  });

program
  .command('new <name>')
  .description('Scaffold new workflow with name.')
  .action((name: string) => {
    modWorkflow.scaffold(name).then(console.log, console.log);
  });

program
  .command('add <workflow> <type> <name>')
  .description('Add new processor with name to an existing workflow.')
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
      console.error(`Error: ${workflow} workflow does not exist.`);
      process.exit(1);
    }
  });

program
  .command('build <name>')
  .description('Build workflow by name.')
  .action((name: string) => {
    modWorkflow.build(name).then(console.log, console.log);
  });

program
  .command('activate <name>')
  .description('Activate workflow by name.')
  .action((name: string) => {
    modWorkflow.activate(name).then(console.log, console.log);
  });

program
  .command('deactivate <name>')
  .description('Deactivate workflow by name.')
  .action((name: string) => {
    modWorkflow.deactivate(name).then(console.log, console.log);
  });

program
  .command('delete <name>')
  .description('Delete workflow by name.')
  .action((name: string) => {
    modWorkflow.deleteWorkflow(name).then(console.log, console.log);
  });

program
  .command('run <name>')
  .description('Run workflow by name.')
  .action((name: string) => {
    modWorkflow.run(name).then(console.log, console.log);
  });

program
  .command('uuid [count]')
  .description('Generate random UUIDs.')
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
