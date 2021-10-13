import findUp from 'find-up';
import { readFileSync } from 'fs';
import { homedir } from 'os';

import { config } from './config';

export const getCreds = (argv: any): object => {
  if (!argv['apiKey'] || !argv['world']) {
    const credsPath = findUp.sync(homedir() + '/' + config.credentialsFilename);
    return credsPath ? JSON.parse(readFileSync(credsPath,'utf-8')) : {};
  }
  return {}
}