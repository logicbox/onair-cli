import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';

import { CommonConfig } from '../types/commonTypes';
import { Flight } from '../types/Flight';
import { getFlight } from '../api/getFlight';
import { logFlight } from '../loggers/logFlight';
import { logAircraft } from '../loggers/logAircraft';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('flightId', {
      describe: 'Flight ID',
      type: 'string',
      demandOption: true
    })
    .option('show-aircraft', {
      type: 'string',
      describe: 'Show aircraft information'
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
      
      const flight: Flight = await getFlight(argv['flightId'], argv['apiKey'], argv['world']);

      if (!flight) {
        throw new Error('No flight found! Is Flight ID Correct?')
      }

      if (flight.RegisterState === 0) {
        throw new Error('Only successfully completed flights supported');
      }
    
      logFlight(flight);

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