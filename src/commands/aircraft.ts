import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import OnAirApi, { OnAirApiConfig, Aircraft, Flight } from 'onair-api';

import { CommonConfig } from '../utils/commonTypes';
import { logAircraft } from '../loggers/logAircraft';
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
      
      const config: OnAirApiConfig = { apiKey: argv['apiKey'], world: argv['world'] };
      const api = new OnAirApi(config);
      const aircraft: Aircraft = await api.getAircraft(argv['aircraftId']);
      logAircraft(aircraft);

      const flights: Flight[] = await api.getAircraftFlights(aircraft.Id, 1, 10);

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