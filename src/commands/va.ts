import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { CommonConfig } from '../types/commonTypes';
import { Member, VirtualAirline } from '../types/VirtualAirline';
import { logVirtualAirline } from '../loggers/logVirtualAirline';
import { getVirtualAirline } from '../api/getVirtualAirline';

const log = console.log;

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('action', {
      describe: 'Optional info to lookup from your virtual airline',
      type: 'string',
      choices: [],
    })
    .example('$0 va','Get summary information for your virtual airline');
    // .example('$0 va members','List the members of your virtual airline');
}

type VACommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never;

export const vaCommand: VACommand = {
  command: 'va [action]',
  describe: 'Get information on your virtual airline, and its members',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined' || typeof argv['vaId'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }

      if (typeof argv['action'] === 'undefined') {
        const va: VirtualAirline = await getVirtualAirline(argv['vaId'], argv['apiKey'], argv['world']);
        logVirtualAirline(va);
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}