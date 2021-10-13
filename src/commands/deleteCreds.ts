import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import findUp from 'find-up';
import { unlinkSync } from 'fs';
import { homedir } from 'os';

import { CommonConfig } from '../types/commonTypes';
import { config } from '../utils/config';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .example('$0 delete-creds','');
}

type DeleteCredsCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const deleteCredsCommand: DeleteCredsCommand = {
  command: 'delete-creds',
  describe: 'Delete your OnAir user credentials',
  builder,
  handler: async (argv) => {
    try {
      const log = console.log;

      const credsPath = findUp.sync(homedir() + '/' + config.credentialsFilename);

      if (typeof credsPath === 'undefined') {
        throw new Error('No credentials are saved');
      }

      unlinkSync(homedir() + '/' + config.credentialsFilename);

      log(chalk.greenBright('Credientials deleted'));

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}