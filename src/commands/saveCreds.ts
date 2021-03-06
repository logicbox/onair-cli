import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { homedir } from 'os';

import { CommonConfig } from '../utils/commonTypes';
import { config } from '../utils/config';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .option('apiKey', {
      type: 'string',
      required: true,
      describe: 'Your OnAir API key'
    })
    .option('world', {
      type: 'string',
      required: true,
      describe: 'OnAir world (use "stratus" for Clear Sky)'
    })
    .option('companyId', {
      type: 'string',
      required: true,
      describe: 'Your Company ID (not to be confused with API key)'
    })
    .option('vaId', {
      type: 'string',
      required: false,
      describe: 'Your Virtual Airline ID (not to be confused with Company ID orAPI key)'
    })
    .example('$0 save-creds --apiKey=<apiKey> --world=<world> --companyId=<companyId> --vaId=<vaId>','');
}

type SaveCredsCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const saveCredsCommand: SaveCredsCommand = {
  command: 'save-creds',
  describe: 'Store your OnAir user credentials locally',
  builder,
  handler: async (argv) => {
    try {
      const log = console.log;

      writeFileSync(homedir() + '/' + config.credentialsFilename, JSON.stringify({
        apiKey: argv['apiKey'],
        world: argv['world'],
        companyId: argv['companyId'],
        vaId: argv['vaId'], 
      }));

      log(chalk.greenBright('Credientials saved'));

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}