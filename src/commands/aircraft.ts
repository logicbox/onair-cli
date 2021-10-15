import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { CommonConfig } from '../types/commonTypes';
import { getAircraft } from '../api/getAircraft';
import { Aircraft } from '../types/Aircraft';
import { logAircraft } from '../loggers/logAircraft';
import { Flight } from '../types/Flight';
import { getAircraftFlights } from '../api/getAircraftFlights';
import { logFlights } from '../loggers/logFlights';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs.positional('aircraftId', {
    describe: 'Aircraft ID',
    type: 'string',
    demandOption: true
  }).option('flights', {
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
      logAircraft(aircraft);

      if (typeof argv['flights'] !== 'undefined') {
        const flights: Flight[] = await getAircraftFlights(aircraft.Id, argv['apiKey'], argv['world'], 1, 10);

        if (flights.length) {
          console.log(chalk.greenBright(`\nLatest flights\n`));
          logFlights(flights, false, true);
          //log(`Suggested command: ${argv['$0']} flight <id>`); 
        } else {
          console.log('I feel the need... the need for speed! ' + chalk.magentaBright('✈'));
        }
      } else {
        console.log(`\nSuggested command: ${argv['$0']} aircraft ${argv['aircraftId']} --flights`);
      }
      console.log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}