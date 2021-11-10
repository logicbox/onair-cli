import chalk from "chalk";
import dayjs from 'dayjs';
import { Flight } from "../types/Flight";
import { cliTable } from "../utils/cli-table";

const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
} 

export const logFlight = (flight: Flight, cols: number=80): void => {
  const log = console.log;
  const chars = {
    left: '  └',
    mid: '─',
    right: '┘  ',
    centre: '┬'
  };
  cols = Math.max(cols, 70);

  log(`${chalk.greenBright.bold(`Flight`)} for ${chalk.cyanBright(flight.Company.AirlineCode)} ${formatDate(flight.StartTime)} - ${flight.Aircraft.AircraftType.DisplayName} (${flight.Aircraft.Identifier}) \n`);

  const spaceCharCount = cols - flight.DepartureAirport.DisplayName.length - flight.ArrivalActualAirport.DisplayName.length;
  log(chalk.cyanBright(flight.DepartureAirport.DisplayName) + ' '.repeat(spaceCharCount) + chalk.cyanBright(flight.ArrivalActualAirport.DisplayName));

  let leftRepeatCount = Math.floor(cols / 2) - chars.left.length;
  let rightRepeatCount = cols - Math.floor(cols / 2) - chars.right.length - 1;
  log(chars.left + chars.mid.repeat(leftRepeatCount) + chars.centre + chars.mid.repeat(rightRepeatCount) + chars.right);

  const flightTimeInMinutes = dayjs(flight.LandedTime).diff(flight.AirborneTime, 'minutes');
  let flightLength;
  if (flightTimeInMinutes > 60) {
    flightLength = `${Math.floor(flightTimeInMinutes / 60)} hrs`;
    if (flightTimeInMinutes % 60) {
      flightLength += `, ${flightTimeInMinutes % 60} mins`;
    }
  } else {
    flightLength = `${flightTimeInMinutes} mins`;
  }
  const flightInfo = `Airborne time ${flightLength}`;
  leftRepeatCount = Math.floor((cols - flightInfo.length) / 2);
  log(' '.repeat(leftRepeatCount) + `${chalk.green('Airborne time')} ${flightLength}`);

  const table = cliTable();
  table.push([
    chalk.green('Engine on'),
    formatDate(flight.EngineOnTime),
    chalk.green('Airborne'),
    formatDate(flight.AirborneTime)
  ]);
  table.push([
    chalk.green('Engine off'),
    formatDate(flight.EngineOffTime),
    chalk.green('Landed'),
    formatDate(flight.LandedTime)
  ]);
  table.push([
    chalk.green('Fuel used (gals)'),
    `${Math.round(flight.ActualTotalFuelConsumptionInLbs / 6.7)} (${Math.round(flight.ActualTotalFuelConsumptionInLbs)} lbs)`,
    chalk.green('FL'),
    Math.round(flight.ActualCruiseAltitude / 1000) * 10
  ])
  table.push([
    chalk.green('Passengers'),
    flight.PAXCount,
    chalk.green('Cargo'),
    flight.CargosTotalWeight + ' lbs'
  ])
  table.push([
    chalk.green('Time offset'),
    flight.TimeOffset,
    chalk.green('Flight XP'),
    flight.XPFlight,
  ])

  log('\n' + table.toString());
}