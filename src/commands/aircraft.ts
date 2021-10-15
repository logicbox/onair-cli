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

      const flights: Flight[] = await getAircraftFlights(aircraft.Id, argv['apiKey'], argv['world'], 1, 10);

      if (flights.length) {
        console.log(chalk.greenBright(`\nLatest flights\n`));
        logFlights(flights, false, true);
      }

      console.log(`\nSuggested command: ${argv['$0']} flights ${argv['aircraftId']}`);

      console.log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}