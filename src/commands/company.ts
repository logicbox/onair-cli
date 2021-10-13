import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../types/commonTypes';
import { getCompany } from '../api/getCompany';
import { getCompanyFleet } from '../api/getCompanyFleet';
import { Company } from '../types/Company';
import { Aircraft } from '../types/Aircraft';

const log = console.log;

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('action', {
      describe: 'Optional info to lookup from your company',
      type: 'string',
      choices: ['fleet', 'flights', 'fbos'],
    })
    .example('$0 company','Get summary information for your company')
    .example('$0 company fleet','Get information on your aircraft');
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
        renderCompany(company);
      } else {
        switch (argv['action']) {
          case 'fleet':
            const companyFleet: Aircraft[] = await getCompanyFleet(argv['companyId'], argv['apiKey'], argv['world']);
            if (companyFleet.length) {
              renderCompanyFleet(companyFleet);
              log('\nSuggested command: onair-cli aircraft <id>');
            } else {
              log('Dude, where\'s your aircraft?! ' + chalk.magentaBright('✈'));
            }
            
        }
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}

const renderCompany = (company: Company): void => {
  const infoTable = cliTable();
  infoTable.push([chalk.green('Company'),company.Name,'','']);
  infoTable.push([
    chalk.green('Code'),
    company.AirlineCode,
    chalk.green('Reputation'),
    Math.round(company.Reputation*1000)/10+'%',
  ]);
  infoTable.push([
    chalk.green('Level'),
    `${company.Level} (${company.LevelXP}xp)`,
    chalk.green('Travel Tokens'),
    company.TravelTokens
  ]);
  log(infoTable.toString()+'\n');

  const dateTable = cliTable();
  const lastConnection = new Date(Date.parse(company.LastConnection));
  const lastReport = new Date(Date.parse(company.LastReportDate));
  dateTable.push([chalk.green('Last Connection'), lastConnection.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('Last Report'), lastReport.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('UTC Offset'), company.UTCOffsetinHours + ' hours']);
  dateTable.push([chalk.green('Paused'), company.Paused ? 'Yes' : 'No']);
  log(dateTable.toString());
}

const renderCompanyFleet = (companyFleet: Aircraft[]): void => {
  const aircraftTable = cliTable();
  
  aircraftTable.push([
    chalk.green('Name'),
    chalk.green('Ident'),
    chalk.green('Engine'),
    chalk.green('Airport'),
    chalk.green('ID')
  ]);

  companyFleet.forEach((Aircraft) => {
    aircraftTable.push([
      chalk.whiteBright(Aircraft.AircraftType.DisplayName),
      Aircraft.Identifier,
      Aircraft.AircraftType.engineType,
      Aircraft.CurrentAirport.ICAO,
      Aircraft.Id
    ])
  });

  log(aircraftTable.toString());
}