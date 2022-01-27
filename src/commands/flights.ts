import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import OnAirApi, { OnAirApiConfig, Flight } from 'onair-api';

import { CommonConfig } from '../utils/commonTypes';;
import { logFlights } from '../loggers/logFlights';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs
    .positional('aircraftId', {
      describe: 'Aircraft ID',
      type: 'string',
      demandOption: true
    })
    .option('page', {
      'describe': 'Page number',
      'type': 'number',
      'alias': 'p',
    })
    .example('$0 flights <aircraftId>', 'List aircraft flights')
    .example('$0 flights <aircraftId> -p=2', 'List aircraft flights, showing page 2');
}

type FlightsCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const flightsCommand: FlightsCommand = {
  command: 'flights <aircraftId>',
  describe: 'Get information on an aircraft\'s flights',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }

      const config: OnAirApiConfig = { apiKey: argv['apiKey'], world: argv['world'] }
      const api = new OnAirApi(config);

      const page = typeof argv['page'] === 'undefined' || argv['page'] < 1 ? 1 : argv['page'];
      const limit = 20;
      const flights: Flight[] = await api.getAircraftFlights(argv['aircraftId'], page, limit);

      if (!flights.length) {
        throw new Error('No flights found! Is Aircraft ID Correct?')
      }
      console.log(chalk.greenBright.bold(`\nAircraft flights (Page ${page}, ${limit} per page)\n`));
    
      logFlights(flights, false, true);
      
      console.log('');
      if (flights.length === limit) {
        console.log(`Suggested command: ${argv['$0']} flights ${argv['aircraftId']} -p=${page + 1}`);
      }
      console.log(`Suggested command: ${argv['$0']} aircraft ${argv['aircraftId']}`);
      console.log(`Suggested command: ${argv['$0']} flight <flightId> (Completed only)`);

      console.log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}