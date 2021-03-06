import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import OnAirApi, { OnAirApiConfig, Flight } from 'onair-api';

import { CommonConfig } from '../utils/commonTypes';
import { logFlight } from '../loggers/logFlight';
import { logAircraft } from '../loggers/logAircraft';
import { logAirport } from '../loggers/logAirport';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('flightId', {
      describe: 'Flight ID',
      type: 'string',
      demandOption: true
    })
    .option('show-aircraft', {
      type: 'string',
      describe: 'Aircraft information'
    });
}

type FlightCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const flightCommand: FlightCommand = {
  command: 'flight <flightId>',
  describe: 'Get information on a flight',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }
      
      const config: OnAirApiConfig = { apiKey: argv['apiKey'], world: argv['world'] }
      const api = new OnAirApi(config);
      const flight: Flight = await api.getFlight(argv['flightId']);

      if (!flight) {
        throw new Error('No flight found! Is Flight ID Correct?')
      }

      if (flight.RegisterState === 0) {
        throw new Error('Only successfully completed flights supported');
      }
    
      logFlight(flight);

      console.log();
      logAirport(flight.DepartureAirport, 'Departure airport');
      console.log();
      logAirport(flight.ArrivalActualAirport, 'Arrival airport');

      if (typeof argv['show-aircraft'] !== 'undefined') {
        console.log();
        logAircraft(flight.Aircraft);
      }

      console.log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}