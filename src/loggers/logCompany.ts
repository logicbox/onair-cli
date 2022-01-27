import chalk from "chalk";
import { Company } from "onair-api";

import { cliTable } from "../utils/cli-table";

export const logCompany = (company: Company): void => {
  const infoTable = cliTable();
  infoTable.push([chalk.green('Company'), company.Name, '', '']);
  infoTable.push([
    chalk.green('Code'),
    company.AirlineCode,
    chalk.green('Reputation'),
    Math.round(company.Reputation * 1000) / 10 + '%',
  ]);
  infoTable.push([
    chalk.green('Level'),
    `${company.Level} (${company.LevelXP}xp)`,
    chalk.green('Travel Tokens'),
    company.TravelTokens
  ]);
  console.log(infoTable.toString() + '\n');

  const dateTable = cliTable();
  const lastConnection = new Date(Date.parse(company.LastConnection));
  const lastReport = new Date(Date.parse(company.LastReportDate));
  dateTable.push([chalk.green('Last Connection'), lastConnection.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('Last Report'), lastReport.toLocaleString('en-GB')]);
  dateTable.push([chalk.green('UTC Offset'), company.UTCOffsetinHours + ' hours']);
  dateTable.push([chalk.green('Paused'), company.Paused ? 'Yes' : 'No']);
  console.log(dateTable.toString());
}