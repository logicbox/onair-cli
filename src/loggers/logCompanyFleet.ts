import chalk from "chalk";
import { Aircraft } from "onair-api";

import { cliTable } from "../utils/cli-table";

export const logCompanyFleet = (companyFleet: Aircraft[]) => {
  const aircraftTable = cliTable();

  aircraftTable.push([
    chalk.green('Name'),
    chalk.green('Ident'),
    chalk.green('Airport'),
    chalk.green('Status'),
    chalk.green('Aircraft ID')
  ]);

  companyFleet.forEach((Aircraft) => {
    aircraftTable.push([
      chalk.whiteBright(Aircraft.AircraftType.DisplayName),
      Aircraft.Identifier,
      Aircraft.CurrentAirport?.ICAO || '-',
      Aircraft.AircraftStatusName,
      Aircraft.Id
    ])
  });

  console.log(aircraftTable.toString());
}