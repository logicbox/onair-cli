import chalk from "chalk";
import { Flight } from "onair-api"
import { cliTable } from "../utils/cli-table";

export const logFlights = (flights: Flight[], showIdent: boolean=true, showCompany: boolean=false): void => {
  const flightTable = cliTable();
  const flightTableHeaders = [];

  if (showIdent) {
    flightTableHeaders.push(chalk.green('Ident'));
  }
  if (showCompany) {
    flightTableHeaders.push(chalk.green('Company'));
  }

  flightTable.push([
    ...flightTableHeaders,
    chalk.green('Airborne'),
    chalk.green('=>'),
    chalk.green('Landed'),
    chalk.green('>='),
    chalk.green('Flight ID'),
    chalk.green(''),
  ]);

  flights.forEach((Flight) => {
    const airborneTime = typeof Flight.AirborneTime !== 'undefined' ?
      new Date(Date.parse(Flight.AirborneTime)).toLocaleString('en-GB').substring(0, 17) :
      '-';

    const landedTime = typeof Flight.LandedTime !== 'undefined' ?
      new Date(Date.parse(Flight.LandedTime)).toLocaleString('en-GB').substring(0, 17) :
      '-';

    const flightTableContent = [];

    if (showIdent) {
      flightTableContent.push(Flight.Aircraft.Identifier);
    }
    if (showCompany) {
      flightTableContent.push(Flight.Company.AirlineCode)
    }

    flightTable.push([
      ...flightTableContent,
      airborneTime,
      Flight.DepartureAirport?.ICAO,
      landedTime,
      Flight.ArrivalActualAirport?.ICAO || '-',
      Flight.Id,
      Flight.RegisterState === 9 ? '✅' : '❌',
    ])
  });

  console.log(flightTable.toString());
}