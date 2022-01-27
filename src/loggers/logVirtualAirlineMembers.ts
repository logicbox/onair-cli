import chalk from "chalk";
import { Member } from "onair-api";

import { cliTable } from "../utils/cli-table";

export const logVirtualAirlineMembers = (vaMembers: Member[]): void => {
  const vaMembersTable = cliTable();

  vaMembersTable.push([
    chalk.green('Code'),
    chalk.green('Name'),
    chalk.green('Level'),
    chalk.green('Flight Hours'),
    chalk.green('Num Flights'),
    chalk.green('Last Reported'),
    chalk.green('Role'),
    chalk.green('Percent Pay'),
  ]);

  const determineRoleName = (name: string, permission: number, color: string | undefined) => {
    let roleName;

    // if color is provided
    if (color !== undefined) {
      // apply that color to the role name
      roleName = chalk.hex(color)(name);
    } else {
      // apply default coloring
      switch (permission) {
        // Founder
        case 0:
          roleName = chalk.red(name)
        break;
        // Manager
        case 100:
          roleName = chalk.magenta(name)
        break;
        // Dispatcher
        case 200:
          roleName = chalk.yellow(name)
        break;
        // Pilot
        case 300:
          roleName = chalk.blueBright(name)
        break;
        // Pending Invitation
        case 400:
          roleName = chalk.dim.white(name)
        break;
        // Invitation Request
        case 500:
          roleName = chalk.dim.white(name)
        break;
      }
    }

    return roleName
  }

  vaMembers.forEach((member) => {
    vaMembersTable.push([
      member.Company.AirlineCode, // ICAO Code
      member.Company.Name, // Name
      member.Company.Level, // Level
      member.FlightHours.toFixed(0), // Flight Hours
      member.NumberOfFlights, // Num Flights
      `${new Date(member.Company.LastReportDate).toLocaleDateString()}`, // Last Report
      determineRoleName(member.VARole.Name, member.VARole.Permission, member.VARole.Color), // Role
      `${member.VARole.PayPercent * 100} %`, // Percent Pay
    ])


  });

  console.log(vaMembersTable.toString());


}