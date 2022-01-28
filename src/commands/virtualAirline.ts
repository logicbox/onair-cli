import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import OnAirApi, { OnAirApiConfig, Member, VirtualAirline } from 'onair-api';

import { CommonConfig } from '../utils/commonTypes';;
import { logVirtualAirline } from '../loggers/logVirtualAirline';
import { logVirtualAirlineMembers } from '../loggers/logVirtualAirlineMembers';

const log = console.log;

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('action', {
      describe: 'Optional info to lookup from your virtual airline',
      type: 'string',
      choices: ['members'],
    })
    .example('$0 va','Get summary information for your virtual airline')
    .example('$0 va members','List the members of your virtual airline');
}

type VACommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never;

export const vaCommand: VACommand = {
  command: 'va [action]',
  describe: 'Get information on your virtual airline, and its members',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined') {
        throw new Error('Credentials missing or not provided.');
      } else if (typeof argv['vaId'] === 'undefined') {
        throw new Error('vaID not set, run save-creds and specify a vaId, first.');
      }

      const config: OnAirApiConfig = { apiKey: argv['apiKey'], world: argv['world'], vaId: argv['vaId'] };
      const api = new OnAirApi(config);

      if (typeof argv['action'] === 'undefined') {
        const va: VirtualAirline = await api.getVirtualAirline();
        logVirtualAirline(va);
      } else {
        switch (argv['action']) {
          case 'members': {
            const va: VirtualAirline = await api.getVirtualAirline();
            const vaMembers: Member[] = await api.getVirtualAirlineMembers();
            if (vaMembers.length) {
              log(chalk.greenBright.bold(`(${va.AirlineCode}) ${va.Name} Members\n`));
              
              logVirtualAirlineMembers(vaMembers);
              
            } else {
              log('You have no members?!');
            }
            break;
          } 
        }
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}