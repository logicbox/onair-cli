interface CompanySkillPoint {
  Id: string,
  CompanyId: string,
  Company: {},
  Amount: number,
  Type: number,
  Tag: string,
  Comment: string,
  CreationDate: string
}

export interface Company {
  Id: string,
  WorldId: string,
  World: {
    Id: string,
    Name: string,
    IsSurvival: boolean,
    IsHumanOnly: boolean,
    Fuel100LLBasePrice: number,
    FuelJetBasePrice: number,
    JobsBaseBonus: number,
    JobsMaxBonus: number,
    ShortName: string,
    EnableEconomicBalance: boolean
  },
  Name: string,
  AirlineCode: string,
  LastConnection: string,
  LastReportDate: string,
  Reputation: number,
  CreationDate: string,
  DifficultyLevel: number,
  UTCOffsetinHours: number,
  Paused: boolean,
  PausedDate: string,
  Level: number,
  LevelXP: number,
  TransportEmployeeInstant: boolean,
  TransportPlayerInstant: boolean,
  ForceTimeInSimulator: boolean,
  UseSmallAirports: boolean,
  UseOnlyVanillaAirports: boolean,
  EnableSkillTree: boolean,
  CheckrideLevel: boolean,
  EnableLandingPenalities: boolean,
  EnableEmployeesFlightDutyAndSleep: boolean,
  AircraftRentLevel: number,
  EnableCargosAndChartersLoadingTime: boolean,
  InSurvival: boolean,
  PayBonusFactor: number,
  EnableSimFailures: boolean,
  DisableSeatsConfigCheck: boolean,
  CompanySkillPoints: CompanySkillPoint[]
  RealisticSimProcedures: boolean,
  TravelTokens: number,
  CurrentBadgeId: string,
  CurrentBadgeUrl: string,
  CurrentBadgeName: string,
  LastWeeklyManagementsPaymentDate: string;
}