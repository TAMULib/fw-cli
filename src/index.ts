#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const program = require('commander');

import { okapi } from './service/okapi.service';

program
  .version('0.0.1')
  .usage("[options]")
  .description("A CLI for building and running FOLIO migration workflows");

program
  .command("login [username] [password]")
  .description("login to acquire token")
  .action((username: string, password: string) => {
    okapi.login(username, password).then((res: string) => {
      console.log(res);
    }, (err: string) => {
      console.log(err);
    });
  });

program
  .command("lookup <module>")
  .description("lookup module, matching name starting with")
  .action((name: string) => {
    okapi.getDiscoveryModuleURL(name).then((res: string) => {
      console.log(res);
    }, (err: string) => {
      console.log(err);
    });
  });

program
  .parse(process.argv);

// no arguments
if (process.argv.length === 2) {
  clear();
  console.log(chalk.red(figlet.textSync('folio-migration-cli', { horizontalLayout: 'full' })));
  program.outputHelp();
}