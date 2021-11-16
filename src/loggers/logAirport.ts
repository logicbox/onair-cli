import chalk from 'chalk';
import terminalLink from 'terminal-link';

import { Airport } from '../types/Airport';
import { Runway } from '../types/Runway';
import { cliTable } from '../utils/cli-table';

export const logAirport = (airport: Airport, label: string='Airport'): void => {
  const log = console.log;

  log(chalk.bold(`${chalk.green(label)} ${airport.ICAO}`));
  log(`${airport.Name}, ${airport.City}, ${airport.State}, ${airport.CountryName}\n`);

  const infoTable = cliTable();

  infoTable.push([chalk.green('Size'), airport.Size, '', '']);
  infoTable.push([chalk.green('UTC Offset'), airport.TimeOffsetInSec / 60 / 60, chalk.green('Closed'), airport.IsClosed ? 'Yes' : 'No']);
  infoTable.push([chalk.green('Military'), airport.IsMilitary ? 'Yes' : 'No', chalk.green('Lights'), airport.HasLights ? 'Yes' : 'No']);
  infoTable.push([chalk.green('Elevation'), airport.Elevation + 'ft', '', '']);
  infoTable.push([chalk.green('Latitude'), airport.Latitude, chalk.green('Longitude'), airport.Longitude]);

  log(infoTable.toString());

  const link = terminalLink('Open in Bing Maps', `https://www.bing.com/maps?cp=${airport.Latitude}~${airport.Longitude}&lvl=13`);
  log(link);

  if (typeof airport.Runways !== 'undefined' && airport.Runways.length) {
    log(chalk.green.bold('\nRunways\n'));

    const runwayTable = cliTable();

    runwayTable.push([chalk.green('Runway'), chalk.green('Magnetic'), chalk.green('Length'), chalk.green('Elevation'), chalk.green('ILS')]);

    airport.Runways.forEach((runway: Runway) => {
      runwayTable.push([runway.Name, runway.MagneticHeading, runway.Length + 'ft', runway.ThresholdElevation + 'ft', runway.IlsFrequency || '-']);
    });

    log(runwayTable.toString());
  }
}