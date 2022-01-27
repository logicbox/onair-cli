import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import OnAirApi, { OnAirApiConfig, Airport, AirportFrequency, AirportLocation } from 'onair-api';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../utils/commonTypes';
import { logAirport } from '../loggers/logAirport';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs.positional('ICAO', {
    describe: 'ICAO airport code',
    type: 'string',
    demandOption: true
  }).option('parking-spots', {
    type: 'string',
    global: false,
    describe: 'Show parking spots for airport'
  });
}

type AirportCommand = (typeof builder) extends BuilderCallback<CommonConfig, infer R> ? CommandModule<CommonConfig, R> : never

export const airportCommand: AirportCommand = {
  command: 'airport <ICAO>',
  describe: 'Get information on an aiport',
  builder,
  handler: async (argv) => {
    try {
      if (typeof argv['apiKey'] === 'undefined' || typeof argv['world'] === 'undefined') {
        throw new Error('Credentials missing or not provided');
      }

      const config: OnAirApiConfig = { apiKey: argv['apiKey'], world: argv['world'] }
      const api = new OnAirApi(config);
      const airport: Airport = await api.getAirport(argv['ICAO']);
      const log = console.log;

      logAirport(airport);
      
      if (airport.AirportFrequencies.length) {
        log(chalk.green.bold('\nFrequencies\n'));

        const frequencyTable = cliTable();

        frequencyTable.push([chalk.green('Name'),chalk.green('Frequency'),chalk.green('Type')]);

        airport.AirportFrequencies.forEach((freq: AirportFrequency) => {
          frequencyTable.push([freq.Name, freq.Frequency, freq.FrequencyType]);
        });

        log(frequencyTable.toString());
      }
      
      if (airport.AirportLocations.length && typeof argv['parking-spots'] !== 'undefined') {
        log(chalk.green.bold('\nParking Spots\n'));

        const parkingTable = cliTable();

        parkingTable.push([chalk.green('Name'),chalk.green('Type'),chalk.green('Latitude'),chalk.green('Longitude'),chalk.green('Heading')]);

        airport.AirportLocations.forEach((parkingSpot: AirportLocation) => {
          parkingTable.push([parkingSpot.Name, parkingSpot.Type, parkingSpot.Latitude, parkingSpot.Longitude, parkingSpot.MagneticHeading]);
        });

        log(parkingTable.toString());
      } else {
        log(`\nSuggested command: ${argv['$0']} airport ${argv['ICAO']} --parking-spots`);
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}