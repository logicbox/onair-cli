import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../types/commonTypes';
import { getCompany } from '../api/getCompany';
import { getCompanyFleet } from '../api/getCompanyFleet';
import { getCompanyFlights } from '../api/getCompanyFlights';
import { getCompanyFbos } from '../api/getCompanyFbos';
import { Company } from '../types/Company';
import { Aircraft, aircraftStatuses } from '../types/Aircraft';
import { Flight } from '../types/Flight';
import { Fbo } from '../types/Fbo';

const log = console.log;

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('action', {
      describe: 'Optional info to lookup from your company',
      type: 'string',
      choices: ['fleet', 'flights', 'fbos'],
    })
    .option('page', {
      'describe': 'Page number (flights/fbos only)',
      'type': 'number',
    })
    .example('$0 company','Get summary information for your company')
    .example('$0 company fleet','List your aircraft')
    .example('$0 company flights','List your flights')
    .example('$0 company flights --page=2','List your flights, showing page 2')
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
        renderCompany(company);
      } else {
        switch (argv['action']) {
          case 'fleet': {
            const companyFleet: Aircraft[] = await getCompanyFleet(argv['companyId'], argv['apiKey'], argv['world']);
            if (companyFleet.length) {
              log(chalk.greenBright.bold('Your fleet of aircraft\n'));
              renderCompanyFleet(companyFleet);
              log(`\nSuggested command: ${argv['$0']} aircraft <id>`);
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
              renderCompanyFlights(companyFlights);
              log(`\nSuggested command: ${argv['$0']} company ${argv['action']} --page=${page+1}`);
              //log(`Suggested command: ${argv['$0']} flight <id>`); 
            } else {
              log('I feel the need... the need for speed! ' + chalk.magentaBright('✈'));
            }
            break;
          }
          case 'fbos': {
            const companyFbos: Fbo[] = await getCompanyFbos(argv['companyId'], argv['apiKey'], argv['world']);
            if (companyFbos.length) {
              log(chalk.greenBright.bold('Your FBOs\n'));
              renderCompanyFbos(companyFbos);
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
    chalk.green('Airport'),
    chalk.green('Status'),
    chalk.green('ID')
  ]);

  companyFleet.forEach((Aircraft) => {
    aircraftTable.push([
      chalk.whiteBright(Aircraft.AircraftType.DisplayName),
      Aircraft.Identifier,
      Aircraft.CurrentAirport?.ICAO || '-',
      aircraftStatuses[Aircraft.AircraftStatus],
      Aircraft.Id
    ])
  });

  log(aircraftTable.toString());
}

const renderCompanyFlights = (companyFlights: Flight[]): void => {
  const flightTable = cliTable();

  flightTable.push([
    chalk.green('Ident'),
    chalk.green('Airborne'),
    chalk.green('=>'),
    chalk.green('Landed'),
    chalk.green('>='),
    chalk.green('ID'),
    chalk.green(''),
  ]);

  companyFlights.forEach((Flight) => {
    const airborneTime = typeof Flight.AirborneTime !== 'undefined' ? 
      new Date(Date.parse(Flight.AirborneTime)).toLocaleString('en-GB').substring(0,17) :
      '-';

    const landedTime = typeof Flight.LandedTime !== 'undefined' ? 
      new Date(Date.parse(Flight.LandedTime)).toLocaleString('en-GB').substring(0,17) :
      '-';

    flightTable.push([
      Flight.Aircraft.Identifier,
      airborneTime,
      Flight.DepartureAirport?.ICAO,
      landedTime,
      Flight.ArrivalActualAirport?.ICAO || '-',
      Flight.Id,
      Flight.RegisterState === 9 ? '✅' : '❌',
    ])
  });

  log(flightTable.toString());
}

const renderCompanyFbos = (companyFbos: Fbo[]): void => {
  const fboTable = cliTable();

  fboTable.push([
    chalk.green('Airport'),
    chalk.green('Name'),
    chalk.green('100LL'),
    chalk.green('Sell'),
    chalk.green('Jet'),
    chalk.green('Sell'),
    chalk.green('C'),
    chalk.green('S'),
    chalk.green('T'),
    chalk.green('H')
  ]);

  companyFbos.forEach((Fbo) => {
    fboTable.push([
      Fbo.Airport.ICAO,
      Fbo.Name,
      Fbo.Fuel100LLQuantity + '/' + Fbo.Fuel100LLCapacity,
      Fbo.AllowFuel100LLSelling ? `✅ ${Fbo.Fuel100LLSellPrice}` : '❌',
      Fbo.FuelJetQuantity + '/' + Fbo.FuelJetCapacity,
      Fbo.AllowFuelJetSelling ? `✅ ${Fbo.FuelJetSellPrice}` : '❌',
      Fbo.CargoWeightCapacity,
      Fbo.SleepingCapacity,
      Fbo.AircraftTieDownCapacity,
      Fbo.AircraftHangarCapacity
    ])
  });
  
  log(fboTable.toString());

  log(
    chalk.whiteBright.bold('\nKey ') + 
    chalk.green('C') + 
    ' Cargo capacity  ' + 
    chalk.green('S') + 
    ' Sleeping  ' + 
    chalk.green('T') + 
    ' Tiedowns  ' + 
    chalk.green('H') + 
    ' Hanger'
  );
}