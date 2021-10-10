# CLI for OnAir Airline Manager

A CLI to access information from [OnAir Company](https://onair.company), because no-one asked for it! Very beta. _Requires an active OnAir Company subscription and API key_.

## Install

`npm i -g onair-cli`

Run

`onair-cli --help`

or run without an install via npx

`npx onair-cli`

All commands require an API found in the bottom left of the OnAir client as well as the world name (Cumulus/Stratus/Thunder). 

## Commands

### Airport

Get information about an airport

`onair-cli --apiKey=[API_KEY] --world=[WORLD] airport [ICAO] [options]`

Optionally show airport parking spot information with `--show-parking-spots`

## Notes

This package is not affiliated to or endored by OnAir Company. OnAir Airline Manager copyright 2021 OnAir Company.

## License
[MIT](https://choosealicense.com/licenses/mit/)