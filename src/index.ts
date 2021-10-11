#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { airportCommand } from './commands/airport';
import { companyCommand } from './commands/company';
import { config } from './utils/config';

console.log(chalk.bgWhite.blackBright.bold(`\n CLI for OnAir Company v${config.packageJson.version} \n`));

yargs(hideBin(process.argv))
  .option('apiKey', {
    type: 'string',
    alias: 'api-key',
    required: true,
    global: true,
    describe: 'Your OnAir Company API key'
  })
  .option('world', {
    choices: ['cumulus', 'stratus', 'thunder'] as const,
    required: true,
    global: true,
    describe: 'OnAir world (use "stratus" for Clear Sky)'
  })
  .command(airportCommand)
  .command(companyCommand)
  .wrap(yargs.terminalWidth())
  .parse()