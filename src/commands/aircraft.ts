import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../types/commonTypes';
import { getAircraft } from '../api/getAircraft';
import { Aircraft, aircraftStatuses, engineTypes } from '../types/Aircraft';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs.positional('aircraftId', {
    describe: 'Aircraft ID',
    type: 'string',
    demandOption: true
  }).option('recent-flights', {
    type: 'string',
    global: false,
    describe: 'Shows 10 latest flights for aircraft'
  });
}

type AircraftCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const aircraftCommand: AircraftCommand = {
  command: 'aircraft <aircraftId>',
  describe: 'Get information on an aircraft',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }
      const aircraft: Aircraft = await getAircraft(argv['aircraftId'], argv['apiKey'], argv['world']);
      const log = console.log;

      log(chalk.bold(`${chalk.greenBright.bold('Aircraft')} ${aircraft.AircraftType.DisplayName} (${aircraft.Identifier})`));
      
      log(chalk.greenBright('\nLocation\n'))
      const locationTable = cliTable();
      locationTable.push([
        chalk.green('Status'),
        aircraftStatuses[aircraft.AircraftStatus],
        '',
        ''
      ])
      if (aircraft.CurrentAirport) {
        locationTable.push([
          chalk.green('Airport'),
          aircraft.CurrentAirport.ICAO,
          aircraft.CurrentAirport.Name,
          aircraft.CurrentAirport.City
        ])
      }
      locationTable.push([
        chalk.green('Latitude'), 
        aircraft.Latitude, 
        chalk.green('Longitude'), 
        aircraft.Longitude
      ]);
      log(locationTable.toString());
      const link = terminalLink('Open in Bing Maps', `https://www.bing.com/maps?cp=${aircraft.Latitude}~${aircraft.Longitude}&lvl=13`);
      log(link);

      log(chalk.greenBright('\nInformation\n'))
      const infoTable = cliTable();
      infoTable.push([
        chalk.green('Engine Type'), 
        engineTypes[aircraft.AircraftType.engineType],
        chalk.green('Speed'), 
        aircraft.AircraftType.designSpeedVC + 'Kts',
      ]);
      infoTable.push([
        chalk.green('Max Payload'), 
        aircraft.AircraftType.ComputedMaxPayload, 
        chalk.green('Range'), 
        aircraft.AircraftType.maximumRangeInNM + ' NM'
      ]);
      infoTable.push([
        chalk.green('Seats'),
        `${aircraft.ConfigEcoSeats}/${aircraft.ConfigBusSeats}/${aircraft.ConfigFirstSeats}`,
        '', 
        ''
      ]);
      infoTable.push([
        chalk.green('Airframe'),
        `${Math.round(aircraft.airframeHours)} hours`,
        chalk.green('100h in'), 
        `${Math.round(aircraft.HoursBefore100HInspection*10)/10} hours`
      ]);
      log(infoTable.toString());

      if (typeof argv['recent-flights'] === 'undefined') {
        log(`\nSuggested command: ${argv['$0']} aircraft ${argv['aircraftId']} --recent-flights`);
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}