#!/usr/bin/env node

import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { getCreds } from './utils/getCredentials';
import { setCredsCommand } from './commands/saveCreds';
import { airportCommand } from './commands/airport';
import { companyCommand } from './commands/company';
import { config } from './utils/config';

console.log(chalk.bgWhite.blackBright.bold(`\n CLI for OnAir Company v${config.packageJson.version} \n`));

yargs(hideBin(process.argv))
  .option('apiKey', {
    type: 'string',
    global: true,
    describe: 'Your OnAir Company API key'
  })
  .option('world', {
    choices: ['cumulus', 'stratus', 'thunder'] as const,
    global: true,
    describe: 'OnAir world (use "stratus" for Clear Sky)'
  })
  .option('company', {
    type: 'string',
    required: true,
    describe: 'Your Company API key (not to be confused with main API key)'
  })
  .middleware(getCreds)
  .command(setCredsCommand)
  .command(airportCommand)
  .command(companyCommand)
  .wrap(yargs.terminalWidth())
  .parse()