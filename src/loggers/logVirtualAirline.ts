import chalk from "chalk";
import { VirtualAirline } from "onair-api";

import { cliTable } from "../utils/cli-table";

export const logVirtualAirline = (va: VirtualAirline): void => {
  const infoTable = cliTable();
  infoTable.push([chalk.green('VirtualAirline'), va.Name, '', '']);
  infoTable.push([
    chalk.green('Code'),
    va.AirlineCode,
    chalk.green('Reputation'),
    Math.round(va.Reputation * 1000) / 10 + '%',
  ]);
  infoTable.push([
    chalk.green('Level'),
    `${va.Level} (${va.LevelXP}xp)`,
    chalk.green('Travel Tokens'),
    va.TravelTokens
  ]);
  console.log(infoTable.toString() + '\n');

  const dateTable = cliTable();
  const lastConnection = new Date(Date.parse(va.LastConnection));
  const lastReport = new Date(Date.parse(va.LastReportDate));
  dateTable.push([chalk.green('Last Connection'), lastConnection.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('Last Report'), lastReport.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('UTC Offset'), va.UTCOffsetinHours + ' hours']);
  dateTable.push([chalk.green('Paused'), va.Paused ? 'Yes' : 'No']);
  console.log(dateTable.toString());
}