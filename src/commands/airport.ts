import yargs, { BuilderCallback, CommandModule } from 'yargs';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import { cliTable } from '../utils/cli-table';
import { CommonConfig } from '../types/commonTypes';
import { getAirport } from '../api/getAirport';
import { Airport } from '../types/Airport';
import { Runway } from '../types/Runway';
import { AirportFrequency } from '../types/AirportFrequency';
import { AirportLocation } from '../types/AirportLocation';

const builder = (yargs: yargs.Argv<CommonConfig>) => {
  return yargs.positional('ICAO', {
    describe: 'ICAO airport code',
    type: 'string',
    demandOption: true
  }).option('show-parking-spots', {
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
      const airport: Airport = await getAirport(argv['ICAO'], argv['apiKey'], argv['world']);
      const log = console.log;

      log(chalk.bold(`${chalk.green('Airport')} ${airport.ICAO}`));
      log(`${airport.Name}, ${airport.City}, ${airport.State}, ${airport.CountryName}\n`);

      const infoTable = cliTable();

      infoTable.push([chalk.green('Size'), airport.Size,'','']);
      infoTable.push([chalk.green('UTC Offset'), airport.TimeOffsetInSec / 60 / 60, chalk.green('Closed'), airport.IsClosed ? 'Yes' : 'No']);
      infoTable.push([chalk.green('Military'), airport.IsMilitary ? 'Yes' : 'No',chalk.green('Lights'), airport.HasLights ? 'Yes' : 'No']);
      infoTable.push([chalk.green('Elevation'), airport.Elevation + 'ft','','']);
      infoTable.push([chalk.green('Latitude'), airport.Latitude, chalk.green('Longitude'), airport.Longitude]);

      log(infoTable.toString());

      const link = terminalLink('Open in Bing Maps', `https://www.bing.com/maps?cp=${airport.Latitude}~${airport.Longitude}&lvl=14`);
      log(link);

      if (airport.Runways.length) {
        log(chalk.green.bold('\nRunways\n'));

        const runwayTable = cliTable();

        runwayTable.push([chalk.green('Runway'),chalk.green('Magnetic'),chalk.green('Length'),chalk.green('Elevation'),chalk.green('ILS')]);

        airport.Runways.forEach((runway: Runway) => {
          runwayTable.push([runway.Name, runway.MagneticHeading, runway.Length+'ft', runway.ThresholdElevation+'ft', runway.IlsFrequency || '-']);
        });

        log(runwayTable.toString());
      }

      if (airport.AirportFrequencies.length) {
        log(chalk.green.bold('\nFrequencies\n'));

        const frequencyTable = cliTable();

        frequencyTable.push([chalk.green('Name'),chalk.green('Frequency'),chalk.green('Type')]);

        airport.AirportFrequencies.forEach((freq: AirportFrequency) => {
          frequencyTable.push([freq.Name, freq.Frequency, freq.FrequencyType]);
        });

        log(frequencyTable.toString());
      }
      
      if (airport.AirportLocations.length && typeof argv['show-parking-spots'] !== 'undefined') {
        log(chalk.green.bold('\nParking Spots\n'));

        const parkingTable = cliTable();

        parkingTable.push([chalk.green('Name'),chalk.green('Type'),chalk.green('Latitude'),chalk.green('Longitude'),chalk.green('Heading')]);

        airport.AirportLocations.forEach((parkingSpot: AirportLocation) => {
          parkingTable.push([parkingSpot.Name, parkingSpot.Type, parkingSpot.Latitude, parkingSpot.Longitude, parkingSpot.MagneticHeading]);
        });

        log(parkingTable.toString());
      }

      log(chalk.grey('\nGood Day'));
    } catch (e) {
      console.error(chalk.bold.red(e.message))
    }
  }
}