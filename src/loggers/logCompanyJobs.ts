import chalk from "chalk";
import { Airport } from "../types/Airport";
import { Job } from "../types/Job";
import { cliTable } from "../utils/cli-table";

export const logCompanyJobs = (companyJobs: Job[]): void => {
  const jobTable = cliTable();

  jobTable.push([
    chalk.green('Job Type'),
    chalk.green('Description'),
    chalk.green('Base Airport'),
    chalk.green('Num Legs'),
    chalk.green('Total Distance'),
    chalk.green('Expires In'),
    chalk.green('Pay'),
    chalk.green('XP')
  ]);

  const determineExpiresIn = (dateStr: string) => {
    const dueDate: any = new Date(dateStr);
    const today: any = new Date();
    let output;

    const diffMs = (dueDate - today); // milliseconds between now & dueDate
    const diffInMinutes = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    
    if (diffInMinutes < 0) {
      output = chalk.red(`${diffInMinutes} mins`)
    } else if (diffInMinutes <= 240) {
      output = chalk.yellow(`${diffInMinutes} mins`)
    } else if (diffInMinutes > 240) {
      output = chalk.green(`${diffInMinutes} mins`)
    }

    return output
  }

  companyJobs.forEach((job) => {
    // determine BaseAirport by matching BaseAirportId up within cargo or charter arrays
    let baseAirport: any = undefined;

    if (baseAirport !== undefined && job.Cargos.length > 0) {
      // iterate over Cargos array and find baseAirport
      job.Cargos.find((e) => {
          if (e.DepartureAirport.Id === job.BaseAirportId) {
              baseAirport = e.DepartureAirport
          } else if (e.CurrentAirport.Id === job.BaseAirportId) {
              baseAirport = e.CurrentAirport
          }else if (e.DestinationAirport.Id === job.BaseAirportId) {
              baseAirport = e.DestinationAirport
          }
      })
    }

    if (baseAirport !== undefined && job.Charters.length > 0) {
        job.Charters.find((e) => {
          if (e.DepartureAirport.Id === job.BaseAirportId) {
            baseAirport = e.DepartureAirport
        } else if (e.CurrentAirport.Id === job.BaseAirportId) {
            baseAirport = e.CurrentAirport
        }else if (e.DestinationAirport.Id === job.BaseAirportId) {
            baseAirport = e.DestinationAirport
        }
      })
    }

    jobTable.push([
      job.MissionType.ShortName,
      job.MissionType.Description,
      baseAirport.ICAO,
      `${job.Cargos.length + job.Charters.length} legs`,
      `${job.TotalDistance} mi`,
      determineExpiresIn(job.ExpirationDate),
      `${job.Pay}.00`,
      `+${job.XP}`,
    ])

  });

  console.log(jobTable.toString());


}