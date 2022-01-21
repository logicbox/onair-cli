# CLI for OnAir Airline Manager

A CLI to display information such as flights and aircraft from [OnAir Company](https://onair.company) an addictive virtual airline for flight simulator games such as Microsoft Flight Simulator and X-Plane! 

_Requires an active OnAir Company subscription and API key_.

<img src="./assets/screenshot.png" width="80%">

## Install

Requires NodeJS, installs via NPM.

`npm i -g onair-cli`

Run

`onair-cli --help`

or run without an install via npx

`npx onair-cli --help`

## Setup

For ease of use I recommend to save your OnAir credentials:

`onair-cli save-creds --api-key=[API_KEY] --world=[WORLD] --companyId=[COMPANY_ID]`

Your OnAir API key and Company ID are found in the bottom left of the settings page in the OnAir client. The world name is 'cumulus', 'stratus', or 'thunder'. Use 'stratus' for Clear Sky server.

These credentials can also be passed into each command if you don't want them saved locally.

## Commands

### Aircraft

Show details on an aircraft, including it's recent flights.

`onair-cli aircraft <aircraftId>`

'aircraftId' is a 32 character UUID available from the aircraft details page in the OnAir client.

### Airport

Get information about an airport

`onair-cli airport <ICAO> [options]`

Optionally show airport parking spot information with `--parking-spots`

### Company

Get summary information on your company

`onair-cli company`

### Company Fleet

List details of your company's fleet of aircraft.

`onair-cli company fleet`

### Company Flights

List your company's aircraft flights, this supports pagination.

`onair-cli company flights`

`onair-cli company flights -p=2`

### Company FBOs

List your company FBOs, including fuel, fuel selling status and tied down/hanger space.

`onair-cli company fbos`

### Company Jobs

List your company's pending jobs

`onair-cli company jobs`

### Flight

Display flight data and airport info for a completed flight. In-progress or aborted flights not supported.

`onair-cli flight <flightID>`

'flightID' is a 32 character UUID that is displayed on the completed flights screen of the OnAir Company client.

Optionally show aircraft information too with `--show-aircraft`

### Flights

Show flights for an aircraft, this supports pagination.

`onair-cli flights <aircraftId>`

`onair-cli flights <aircraftId> -p=2`

'aircraftId' is a 32 character UUID available from the aircraft details page in the OnAir client.


### (VA) Virtual Airline
Get summary information for a given virtual airline
**Note:** You must specify a vaId prior to being able to run this command

`onair-cli va`


### (VA) Virtual Airline Members
Shows the members of a given VA and their associated details. The role name and color will match with whatever OnAir reports.
**Note:** You must specify a vaId prior to being able to run this command

`onair-cli va members`

### Save Credentials

`onair-cli set-creds --apiKey=[API_KEY] --world=[WORLD] --companyId=[COMPANY_ID] --vaId=[VIRTUAL_AIRLINE_ID]`

Your OnAir API key and Company ID are found in the bottom left of the settings page in the OnAir client. The world name is 'cumulus', 'stratus', or 'thunder'. Your OnAir Virtual Airline ID can be found in the Manage VA options screen.

### Delete Credentials

`onair-cli delete-creds`

Remove your locally stored OnAir credentials.

## Notes

This application is not affiliated with or endored by OnAir Company. OnAir Airline Manager &copy; OnAir Company.

## License
[MIT](https://choosealicense.com/licenses/mit/)