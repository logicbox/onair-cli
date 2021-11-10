import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { CommonConfig } from '../types/commonTypes';
import { getCompany } from '../api/getCompany';
import { getCompanyFleet } from '../api/getCompanyFleet';
import { getCompanyFlights } from '../api/getCompanyFlights';
import { getCompanyFbos } from '../api/getCompanyFbos';
import { Company } from '../types/Company';
import { Aircraft } from '../types/Aircraft';
import { Flight } from '../types/Flight';
import { Fbo } from '../types/Fbo';
import { logFlights } from '../loggers/logFlights';
import { logCompany } from '../loggers/logCompany';
import { logCompanyFleet } from '../loggers/logCompanyFleet';
import { logCompanyFbos } from '../loggers/logCompanyFbos';

const log = console.log;

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('action', {
      describe: 'Optional info to lookup from your company',
      type: 'string',
      choices: ['fleet', 'flights', 'fbos'],
    })
    .option('page', {
      'describe': 'Page number (flights only)',
      'type': 'number',
      'alias': 'p',
    })
    .example('$0 company','Get summary information for your company')
    .example('$0 company fleet','List your aircraft')
    .example('$0 company flights','List your flights')
    .example('$0 company flights -p=2','List your flights, showing page 2')
    .example('$0 company fbos', 'List your FBOs');
}

type CompanyCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never;

export const companyCommand: CompanyCommand = {
  command: 'company [action]',
  describe: 'Get information on your company, aircraft, flights and FBOs',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined' || typeof argv['companyId'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }

      if (typeof argv['action'] === 'undefined') {
        const company: Company = await getCompany(argv['companyId'], argv['apiKey'], argv['world']);
        logCompany(company);
      } else {
        switch (argv['action']) {
          case 'fleet': {
            const companyFleet: Aircraft[] = await getCompanyFleet(argv['companyId'], argv['apiKey'], argv['world']);
            if (companyFleet.length) {
              log(chalk.greenBright.bold('Your fleet of aircraft\n'));
              
              logCompanyFleet(companyFleet);
              
              log(`\nSuggested command: ${argv['$0']} aircraft <aircraftId>`);
              log(`Suggested command: ${argv['$0']} flights <aircraftId>`);
            } else {
              log('Dude, where\'s your aircraft?! ' + chalk.magentaBright('✈'));
            }
            break;
          } 
          case 'flights': {
            const page = typeof argv['page'] === 'undefined' || argv['page'] < 1 ? 1 : argv['page'];
            const limit = 20;
            const companyFlights: Flight[] = await getCompanyFlights(argv['companyId'], argv['apiKey'], argv['world'], page, limit);
            if (companyFlights.length) {
              log(chalk.greenBright.bold(`Your flights (Page ${page}, ${limit} per page)\n`));
              
              logFlights(companyFlights);
              
              console.log('');
              if (companyFlights.length === limit) {
                log(`Suggested command: ${argv['$0']} company ${argv['action']} -p=${page+1}`);
              }
              log(`Suggested command: ${argv['$0']} airport <ICAO>`); 
              log(`Suggested command: ${argv['$0']} flight <flightId> (Completed only)`);
            } else {
              log('I feel the need... the need for speed! ' + chalk.magentaBright('✈'));
            }
            break;
          }
          case 'fbos': {
            const companyFbos: Fbo[] = await getCompanyFbos(argv['companyId'], argv['apiKey'], argv['world']);
            
            if (companyFbos.length) {
              log(chalk.greenBright.bold('Your FBOs\n'));
              logCompanyFbos(companyFbos);
            } else {
              log('No FBO... no 100LL! ' + chalk.magentaBright('✈'))
            }
          }
        }
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}