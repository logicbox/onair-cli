import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../types/commonTypes';
import { getCompany } from '../api/getCompany';
import { Company } from '../types/Company';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .example('$0 company','Get information for your company');
}

type CompanyCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never;

export const companyCommand: CompanyCommand = {
  command: 'company',
  describe: 'Get information on your company',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined' || typeof argv['companyId'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }
      const company: Company = await getCompany(argv['companyId'], argv['apiKey'], argv['world']);
      const log = console.log;

      let infoTable = cliTable();
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

      log(chalk.grey('\nGood Day'));
    
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}