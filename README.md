# CLI for OnAir Airline Manager

A CLI to access information from [OnAir Company](https://onair.company), because no-one asked for it! Very beta. _Requires an active OnAir Company subscription and API key_.

## Install

`npm i -g onair-cli`

Run

`onair-cli --help`

or run without an install via npx

`npx onair-cli`

All commands require an API key found in the bottom left of the settings page in the OnAir client as well as the World name (cumulus/stratus/thunder). 

## Commands

### Airport

Get information about an airport

`onair-cli --api-key=[API_KEY] --world=[WORLD] airport [ICAO] [options]`

Optionally show airport parking spot information with `--show-parking-spots`

## Notes

This package is not affiliated to or endored by OnAir Company. OnAir Airline Manager &copy; 2021 OnAir Company.

## License
[MIT](https://choosealicense.com/licenses/mit/)