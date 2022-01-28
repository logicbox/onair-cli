import chalk from 'chalk';
import terminalLink from 'terminal-link';

import { Aircraft } from 'onair-api';
import { cliTable } from '../utils/cli-table';

export const logAircraft = (aircraft: Aircraft): void => {
  const log = console.log;

  log(chalk.bold(`${chalk.greenBright.bold('Aircraft')} ${aircraft.AircraftType.DisplayName} (${aircraft.Identifier})`));

  log(chalk.greenBright('\nCurrent location\n'))
  const locationTable = cliTable();

  locationTable.push([
    chalk.green('Status'),
    aircraft.AircraftStatusName,
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
    aircraft.AircraftType.EngineTypeName,
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
    `${Math.round(aircraft.HoursBefore100HInspection * 10) / 10} hours`
  ]);
  log(infoTable.toString());
}