#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { getCreds } from './utils/getCredentials';
import { saveCredsCommand } from './commands/saveCreds';
import { deleteCredsCommand } from './commands/deleteCreds';
import { airportCommand } from './commands/airport';
import { companyCommand } from './commands/company';
import { config } from './utils/config';
import { aircraftCommand } from './commands/aircraft';
import { flightsCommand } from './commands/flights';

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
  .option('companyId', {
    type: 'string',
    global: true,
    describe: 'Your Company ID (not to be confused with API key)'
  })
  .middleware(getCreds)
  .command(saveCredsCommand)
  .command(deleteCredsCommand)
  .command(airportCommand)
  .command(companyCommand)
  .command(aircraftCommand)
  .command(flightsCommand)
  .demandCommand()
  .wrap(yargs.terminalWidth())
  .parse()