import chalk from "chalk";
import { Aircraft, aircraftStatuses } from "../types/Aircraft";
import { cliTable } from "../utils/cli-table";

export const logCompanyFleet = (companyFleet: Aircraft[]) => {
  const aircraftTable = cliTable();

  aircraftTable.push([
    chalk.green('Name'),
    chalk.green('Ident'),
    chalk.green('Airport'),
    chalk.green('Status'),
    chalk.green('ID')
  ]);

  companyFleet.forEach((Aircraft) => {
    aircraftTable.push([
      chalk.whiteBright(Aircraft.AircraftType.DisplayName),
      Aircraft.Identifier,
      Aircraft.CurrentAirport?.ICAO || '-',
      aircraftStatuses[Aircraft.AircraftStatus],
      Aircraft.Id
    ])
  });

  console.log(aircraftTable.toString());
}