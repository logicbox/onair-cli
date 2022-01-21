import chalk from "chalk";
import { Airport } from "../types/Airport";
import { Job } from "../types/Job";
import { cliTable } from "../utils/cli-table";

export const logCompanyJobs = (companyJobs: Job[]): void => {
  const jobTable = cliTable();

  jobTable.push([
    chalk.green('Job Type'),
    chalk.green('Description'),
    chalk.green('Num Legs'),
    chalk.green('Base Airport'),
    chalk.green('Cur Airport'),
    chalk.green('Dest Airport'),
    chalk.green('Total Distance'),
    chalk.green('Human Req.'),
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
    
    if (diffInMinutes <= 0) {
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

    if (job.Cargos.length > 0) {
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

    if (job.Charters.length > 0) {
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

    // build Job row
    // Description
    // Base Airport
    // Cur Airport
    // Dest Airport
    // Num Legs
    // Total Distance
    // Human Req
    
    // Expires In
    // Pay
    // XP
    jobTable.push([
      job.MissionType.ShortName, // Job Type
      null, // Leg Description
      `${job.Cargos.length + job.Charters.length} legs`, // Num Legs
      (baseAirport) ? baseAirport.ICAO : null, // Base Airport
      null, // Cur Airport
      null, // Dest Airport
      `${job.TotalDistance} mi`, // Total Distance,
      null, // Human Req
      determineExpiresIn(job.ExpirationDate), // Expires In
      `${job.Pay}.00`, // Pay
      `+${job.XP}`, // XP
    ])

    if (job.Cargos.length > 0) {
      job.Cargos.forEach((cargo) => {
        jobTable.push([
          null, // Job Type
          cargo.Description, // Leg Description
          null, // Num Legs
          null, // Base Airport
          (cargo.CurrentAirport) ? cargo.CurrentAirport.ICAO : null, // Cur Airport
          (cargo.DestinationAirport) ? cargo.DestinationAirport.ICAO : null, // Dest Airport
          `${cargo.Distance} mi`, // Total Distance
          (cargo.HumanOnly) ? 'Yes' : 'No', // Human Req
          null, // Expires In
          null, // Pay,
          null, // XP

        ])
      })
    }

    if (job.Charters.length > 0) {
      job.Charters.forEach((charter) => {
        jobTable.push([
          null, // Job Type
          charter.Description, // Leg Description
          null, // Num Legs
          null, // Base Airport
          (charter.CurrentAirport) ? charter.CurrentAirport.ICAO : null, // Cur Airport
          (charter.DestinationAirport) ? charter.DestinationAirport.ICAO : null, // Dest Airport
          `${charter.Distance} mi`, // Total Distance
          (charter.HumanOnly) ? 'Yes' : 'No', // Human Req
          null, // Expires In
          null, // Pay,
          null, // XP

        ])
      })
    }
  });

  console.log(jobTable.toString());


}