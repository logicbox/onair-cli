#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

import { airportCommand } from './airport';
import { packageJson } from './utils/package';

console.log(chalk.bgWhite.blackBright.bold(`\n CLI for OnAir Company v${packageJson.version} \n`));

const worlds = ["cumulus", "stratus", "thunder"] as const;

yargs(hideBin(process.argv))
  .option('apiKey', {
    type: 'string',
    required: true,
    global: true,
    describe: 'Your On Air Company API key'
  })
  .option('world', {
    choices: worlds,
    required: true,
    global: true,
    describe: 'OnAir world (use \'stratus\' for Clear Sky)'
  })
  .command(airportCommand)
  .wrap(yargs.terminalWidth())
  .parse()